import { createProgram } from "../../utils";
import { getScatterFragmentShader } from "./fragment";
import { getScatterVertexShader } from "./vertex";

/**
 * This program copies the layout's positions into sigma's node data texture,
 * fully on GPU: one POINTS draw call, one point per node, each point landing
 * exactly on the node's geometry texel (sigma packs two texels per node, and
 * x/y live in the first one). Positions are converted from graph space to
 * sigma's framed-graph space on the fly, with the exact same formula as
 * sigma's own normalization function, so GPU-written and CPU-written
 * positions always agree.
 *
 * The draw call runs with colorMask(R, G only), so the other channels of the
 * geometry texel (size, shapeId) are preserved.
 */
export class ScatterProgram {
  private gl: WebGL2RenderingContext;
  private nodesCount: number;

  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private indicesBuffer: WebGLBuffer;
  private framebuffer: WebGLFramebuffer;
  private attachedTexture: WebGLTexture | null = null;
  private uniformLocations: {
    nodesPositionTexture: WebGLUniformLocation | null;
    normalization: WebGLUniformLocation | null;
    targetSize: WebGLUniformLocation | null;
  };

  constructor(gl: WebGL2RenderingContext, { nodesCount }: { nodesCount: number }) {
    this.gl = gl;
    this.nodesCount = nodesCount;

    this.program = createProgram(
      gl,
      getScatterVertexShader({ nodesCount }),
      getScatterFragmentShader(),
      "scatter program",
      "a_sigmaIndex",
    );
    this.uniformLocations = {
      nodesPositionTexture: gl.getUniformLocation(this.program, "u_nodesPositionTexture"),
      normalization: gl.getUniformLocation(this.program, "u_normalization"),
      targetSize: gl.getUniformLocation(this.program, "u_targetSize"),
    };

    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    gl.bindVertexArray(this.vao);
    this.indicesBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.indicesBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.framebuffer = gl.createFramebuffer() as WebGLFramebuffer;
  }

  /**
   * Uploads the fa2Index -> sigma texture index mapping.
   */
  public setIndices(indices: Float32Array) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public run({
    positionsTexture,
    targetTexture,
    targetWidth,
    targetHeight,
    normalization,
  }: {
    positionsTexture: WebGLTexture;
    targetTexture: WebGLTexture;
    targetWidth: number;
    targetHeight: number;
    normalization: { dX: number; dY: number; ratio: number };
  }) {
    const { gl } = this;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    // Sigma's texture object changes when its capacity grows:
    if (this.attachedTexture !== targetTexture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);
      this.attachedTexture = targetTexture;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, positionsTexture);
    gl.uniform1i(this.uniformLocations.nodesPositionTexture, 0);
    gl.uniform3f(this.uniformLocations.normalization, normalization.dX, normalization.dY, normalization.ratio);
    gl.uniform2f(this.uniformLocations.targetSize, targetWidth, targetHeight);

    gl.viewport(0, 0, targetWidth, targetHeight);
    gl.disable(gl.BLEND);
    // Only write x/y, preserve size and shapeId:
    gl.colorMask(true, true, false, false);
    gl.drawArrays(gl.POINTS, 0, this.nodesCount);
    gl.colorMask(true, true, true, true);

    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public kill() {
    const { gl } = this;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.indicesBuffer);
    gl.deleteFramebuffer(this.framebuffer);
  }
}
