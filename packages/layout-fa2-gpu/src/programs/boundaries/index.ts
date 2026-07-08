import { QUAD_VERTEX_SHADER, createFloatTexture, createFramebuffer, createProgram, getTextureSize } from "../../utils";
import { getBoundariesInitFragmentShader } from "./fragment-init";
import { getBoundariesReduceFragmentShader } from "./fragment-reduce";

const REDUCE_FACTOR = 4;

/**
 * This class computes the bounding box (xMin, xMax, yMin, yMax) of the nodes,
 * as a 1x1 RGBA32F texture, using a parallel min/max reduction: each pass
 * merges 4x4 blocks of the previous pass, so the whole computation takes
 * O(log(nodesCount)) small fully-parallel draw calls, instead of one
 * O(nodesCount) serial loop in a single fragment.
 */
export class BoundariesGPU {
  private gl: WebGL2RenderingContext;
  private passSizes: number[];

  // Programs:
  private initProgram: WebGLProgram;
  private reduceProgram: WebGLProgram;
  private initUniformLocations: { nodesPositionTexture: WebGLUniformLocation | null };
  private reduceUniformLocations: {
    inputTexture: WebGLUniformLocation | null;
    inputSize: WebGLUniformLocation | null;
  };
  private vao: WebGLVertexArrayObject;
  private quadBuffer: WebGLBuffer;

  // Textures:
  private pingTexture: WebGLTexture;
  private pongTexture: WebGLTexture;
  private boundariesTexture: WebGLTexture;
  private pingFramebuffer: WebGLFramebuffer;
  private pongFramebuffer: WebGLFramebuffer;
  private boundariesFramebuffer: WebGLFramebuffer;

  constructor(gl: WebGL2RenderingContext, { nodesCount }: { nodesCount: number }) {
    this.gl = gl;

    // Sizes of each pass output, down to 1:
    this.passSizes = [Math.ceil(getTextureSize(nodesCount) / REDUCE_FACTOR)];
    while (this.passSizes[this.passSizes.length - 1] > 1) {
      this.passSizes.push(Math.ceil(this.passSizes[this.passSizes.length - 1] / REDUCE_FACTOR));
    }

    // Programs:
    this.initProgram = createProgram(
      gl,
      QUAD_VERTEX_SHADER,
      getBoundariesInitFragmentShader({ nodesCount }),
      "boundaries init program",
    );
    this.reduceProgram = createProgram(
      gl,
      QUAD_VERTEX_SHADER,
      getBoundariesReduceFragmentShader(),
      "boundaries reduce program",
    );
    this.initUniformLocations = {
      nodesPositionTexture: gl.getUniformLocation(this.initProgram, "u_nodesPositionTexture"),
    };
    this.reduceUniformLocations = {
      inputTexture: gl.getUniformLocation(this.reduceProgram, "u_inputTexture"),
      inputSize: gl.getUniformLocation(this.reduceProgram, "u_inputSize"),
    };

    // Quad geometry, in a dedicated VAO, so that the default-VAO attribute
    // state (which sigma's own programs rely on) is left untouched:
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    gl.bindVertexArray(this.vao);
    this.quadBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Textures and framebuffers:
    const pingPongSize = this.passSizes[0];
    this.pingTexture = createFloatTexture(gl, pingPongSize);
    this.pongTexture = createFloatTexture(gl, pingPongSize);
    this.boundariesTexture = createFloatTexture(gl, 1);
    this.pingFramebuffer = createFramebuffer(gl, this.pingTexture, "BoundariesGPU ping framebuffer");
    this.pongFramebuffer = createFramebuffer(gl, this.pongTexture, "BoundariesGPU pong framebuffer");
    this.boundariesFramebuffer = createFramebuffer(gl, this.boundariesTexture, "BoundariesGPU boundaries framebuffer");
  }

  /**
   * Public API:
   * ***********
   */

  /**
   * Reduces the given nodes position texture into the boundaries texture.
   */
  public compute(nodesTexture: WebGLTexture) {
    const { gl, passSizes } = this;

    gl.bindVertexArray(this.vao);
    // Sigma's programs leave blending enabled; a compute pass must overwrite:
    gl.disable(gl.BLEND);

    passSizes.forEach((size, passIndex) => {
      const isLastPass = size === 1;

      if (passIndex === 0) {
        gl.useProgram(this.initProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, nodesTexture);
        gl.uniform1i(this.initUniformLocations.nodesPositionTexture, 0);
      } else {
        gl.useProgram(this.reduceProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, passIndex % 2 === 1 ? this.pingTexture : this.pongTexture);
        gl.uniform1i(this.reduceUniformLocations.inputTexture, 0);
        gl.uniform1i(this.reduceUniformLocations.inputSize, passSizes[passIndex - 1]);
      }

      const framebuffer = isLastPass
        ? this.boundariesFramebuffer
        : passIndex % 2 === 0
          ? this.pingFramebuffer
          : this.pongFramebuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, size, size);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public getBoundariesTexture(): WebGLTexture {
    return this.boundariesTexture;
  }

  public kill() {
    const { gl } = this;
    gl.deleteProgram(this.initProgram);
    gl.deleteProgram(this.reduceProgram);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.quadBuffer);
    gl.deleteTexture(this.pingTexture);
    gl.deleteTexture(this.pongTexture);
    gl.deleteTexture(this.boundariesTexture);
    gl.deleteFramebuffer(this.pingFramebuffer);
    gl.deleteFramebuffer(this.pongFramebuffer);
    gl.deleteFramebuffer(this.boundariesFramebuffer);
  }
}
