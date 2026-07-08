import { QUAD_VERTEX_SHADER, createFloatTexture, createProgram, getTextureSize } from "../../utils";
import { getForceAtlas2FragmentShader } from "./fragment";

export type ForceAtlas2ProgramOptions = {
  nodesCount: number;
  edgeEntriesCount: number;
  linLogMode: boolean;
  strongGravityMode: boolean;
  outboundAttractionDistribution: boolean;
  // Resolved quad-tree geometry (never "auto" at this point):
  quadTreeDepth: number;
  quadTreeTheta: number;
  // Owned by the QuadTreeGPU, only read here:
  boundariesTexture: WebGLTexture;
  quadTreeTexture: WebGLTexture;
};

export type ForceAtlas2Uniforms = {
  edgeWeightInfluence: number;
  scalingRatio: number;
  gravity: number;
  maxForce: number;
  slowDown: number;
  outboundAttCompensation: number;
};

// Texture units the fragment shader's samplers are pinned to, once at
// construction:
const POSITION_UNIT = 0;
const MOVEMENT_UNIT = 1;
const METADATA_UNIT = 2;
const EDGES_UNIT = 3;
const BOUNDARIES_UNIT = 4;
const QUAD_TREE_UNIT = 5;

/**
 * The ForceAtlas2 iteration pass: a full-screen quad over an NxN float
 * texture, one fragment per node, computing the node's new position and
 * movement (Multiple Render Targets).
 *
 * Positions and movements ping-pong between two texture pairs, each wired to
 * its own framebuffer once at construction: an iteration reads the "current"
 * pair and renders into the other one, then the roles swap.
 *
 * Runs in an injected WebGL2 context (sigma's), on its own VAO, so it never
 * touches the default-VAO attribute state sigma relies on.
 */
export class ForceAtlas2Program {
  private gl: WebGL2RenderingContext;
  private nodesTextureSize: number;
  private edgesTextureSize: number;

  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private quadBuffer: WebGLBuffer;

  // Ping-pong pairs (positionTextures[current] is the freshest data):
  private positionTextures: [WebGLTexture, WebGLTexture];
  private movementTextures: [WebGLTexture, WebGLTexture];
  private framebuffers: [WebGLFramebuffer, WebGLFramebuffer];
  private current = 0;

  private metadataTexture: WebGLTexture;
  private edgesTexture: WebGLTexture;
  // Not owned (see ForceAtlas2ProgramOptions):
  private boundariesTexture: WebGLTexture;
  private quadTreeTexture: WebGLTexture;

  private uniformLocations: Record<keyof ForceAtlas2Uniforms, WebGLUniformLocation | null>;

  constructor(gl: WebGL2RenderingContext, options: ForceAtlas2ProgramOptions) {
    this.gl = gl;
    this.nodesTextureSize = getTextureSize(options.nodesCount);
    this.edgesTextureSize = getTextureSize(options.edgeEntriesCount);
    this.boundariesTexture = options.boundariesTexture;
    this.quadTreeTexture = options.quadTreeTexture;

    this.program = createProgram(gl, QUAD_VERTEX_SHADER, getForceAtlas2FragmentShader(options), "ForceAtlas2");

    // Uniform locations are constant for the program's lifetime; inactive
    // uniforms (e.g. u_outboundAttCompensation when its mode is off) resolve
    // to null, which uniform1f silently ignores:
    this.uniformLocations = {
      edgeWeightInfluence: gl.getUniformLocation(this.program, "u_edgeWeightInfluence"),
      scalingRatio: gl.getUniformLocation(this.program, "u_scalingRatio"),
      gravity: gl.getUniformLocation(this.program, "u_gravity"),
      maxForce: gl.getUniformLocation(this.program, "u_maxForce"),
      slowDown: gl.getUniformLocation(this.program, "u_slowDown"),
      outboundAttCompensation: gl.getUniformLocation(this.program, "u_outboundAttCompensation"),
    };

    // Samplers point to fixed texture units, set once (uniform values persist
    // with the program):
    gl.useProgram(this.program);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_nodesPositionTexture"), POSITION_UNIT);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_nodesMovementTexture"), MOVEMENT_UNIT);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_nodesMetadataTexture"), METADATA_UNIT);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_edgesTexture"), EDGES_UNIT);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_boundariesTexture"), BOUNDARIES_UNIT);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_quadTreeTexture"), QUAD_TREE_UNIT);

    // Quad geometry, in a dedicated VAO (a_position is pinned on location 0):
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    gl.bindVertexArray(this.vao);
    this.quadBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Ping-pong textures and their pre-wired MRT framebuffers:
    const size = this.nodesTextureSize;
    this.positionTextures = [createFloatTexture(gl, size), createFloatTexture(gl, size)];
    this.movementTextures = [createFloatTexture(gl, size), createFloatTexture(gl, size)];
    this.framebuffers = [0, 1].map((side) => {
      const framebuffer = gl.createFramebuffer() as WebGLFramebuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.positionTextures[side], 0);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.movementTextures[side], 0);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw new Error("ForceAtlas2Program: framebuffer is not complete");
      return framebuffer;
    }) as [WebGLFramebuffer, WebGLFramebuffer];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.metadataTexture = createFloatTexture(gl, size);
    // Edges only carry (otherNodeIndex, weight), so RG32F is enough:
    this.edgesTexture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, this.edgesTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, this.edgesTextureSize, this.edgesTextureSize, 0, gl.RG, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  /**
   * Uploads all the graph data at once (at the beginning of a run). Arrays
   * must be sized for the full square textures.
   */
  public setData({
    nodesPosition,
    nodesMovement,
    nodesMetadata,
    edges,
  }: {
    nodesPosition: Float32Array;
    nodesMovement: Float32Array;
    nodesMetadata: Float32Array;
    edges: Float32Array;
  }) {
    const { gl } = this;
    const size = this.nodesTextureSize;

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.bindTexture(gl.TEXTURE_2D, this.positionTextures[this.current]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, nodesPosition);
    gl.bindTexture(gl.TEXTURE_2D, this.movementTextures[this.current]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, nodesMovement);
    gl.bindTexture(gl.TEXTURE_2D, this.metadataTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, nodesMetadata);
    gl.bindTexture(gl.TEXTURE_2D, this.edgesTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, this.edgesTextureSize, this.edgesTextureSize, 0, gl.RG, gl.FLOAT, edges);
  }

  /**
   * Single-texel patches, used to inject external updates (node drags, fixed
   * flags) into a running layout:
   */
  public setPositionItem(itemIndex: number, values: Float32Array) {
    this.setTexel(this.positionTextures[this.current], itemIndex, values);
  }
  public setMovementItem(itemIndex: number, values: Float32Array) {
    this.setTexel(this.movementTextures[this.current], itemIndex, values);
  }
  public setMetadataItem(itemIndex: number, values: Float32Array) {
    this.setTexel(this.metadataTexture, itemIndex, values);
  }

  private setTexel(texture: WebGLTexture, itemIndex: number, values: Float32Array) {
    const { gl } = this;
    const size = this.nodesTextureSize;
    const col = itemIndex % size;
    const row = Math.floor(itemIndex / size);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, col, row, 1, 1, gl.RGBA, gl.FLOAT, values);
  }

  /**
   * Sets the force parameters. Uniform values persist with the program, so
   * this only needs to run when they change (once per frame in practice).
   */
  public setUniforms(uniforms: ForceAtlas2Uniforms) {
    const { gl, uniformLocations } = this;
    gl.useProgram(this.program);
    for (const key in uniforms)
      gl.uniform1f(uniformLocations[key as keyof ForceAtlas2Uniforms], uniforms[key as keyof ForceAtlas2Uniforms]);
  }

  /**
   * Runs one iteration: reads the current textures, renders into the other
   * pair, and swaps the roles.
   */
  public run() {
    const { gl } = this;
    const size = this.nodesTextureSize;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.viewport(0, 0, size, size);
    // Sigma's programs leave blending enabled; a compute pass must overwrite:
    gl.disable(gl.BLEND);

    gl.activeTexture(gl.TEXTURE0 + POSITION_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this.positionTextures[this.current]);
    gl.activeTexture(gl.TEXTURE0 + MOVEMENT_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this.movementTextures[this.current]);
    gl.activeTexture(gl.TEXTURE0 + METADATA_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this.metadataTexture);
    gl.activeTexture(gl.TEXTURE0 + EDGES_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this.edgesTexture);
    gl.activeTexture(gl.TEXTURE0 + BOUNDARIES_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this.boundariesTexture);
    gl.activeTexture(gl.TEXTURE0 + QUAD_TREE_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this.quadTreeTexture);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[1 - this.current]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.current = 1 - this.current;
  }

  /**
   * Returns the texture holding the freshest positions (a different object
   * after every run() call, because of the ping-pong).
   */
  public getPositionsTexture(): WebGLTexture {
    return this.positionTextures[this.current];
  }

  /**
   * Synchronously reads the positions back to the CPU (a full pipeline
   * stall: used once, when a run finishes).
   */
  public readPositionsSync(): Float32Array {
    const { gl } = this;
    const size = this.nodesTextureSize;

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.getPositionsTexture(), 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(framebuffer);
      throw new Error("ForceAtlas2Program: failed to create framebuffer for reading positions");
    }

    const positions = new Float32Array(size * size * 4);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, positions);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);

    return positions;
  }

  public kill() {
    const { gl } = this;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.quadBuffer);
    this.positionTextures.forEach((texture) => gl.deleteTexture(texture));
    this.movementTextures.forEach((texture) => gl.deleteTexture(texture));
    this.framebuffers.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
    gl.deleteTexture(this.metadataTexture);
    gl.deleteTexture(this.edgesTexture);
  }
}
