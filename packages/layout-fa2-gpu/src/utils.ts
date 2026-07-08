import { loadFragmentShader, loadVertexShader } from "sigma/rendering";

/**
 * Side of the smallest square texture with at least itemsCount texels.
 */
export function getTextureSize(itemsCount: number) {
  return Math.ceil(Math.sqrt(itemsCount));
}

/**
 * Compiles and links a program. `attribute0` (when the vertex shader has it)
 * is pinned on attribute location 0, so that programs can share VAOs.
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
  name = "program",
  attribute0 = "a_position",
): WebGLProgram {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, loadVertexShader(gl, vertexShaderSource));
  gl.attachShader(program, loadFragmentShader(gl, fragmentShaderSource));
  gl.bindAttribLocation(program, 0, attribute0);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Failed to link ${name}: ` + gl.getProgramInfoLog(program));
  }
  return program;
}

/**
 * Creates an RGBA32F texture with NEAREST filtering and CLAMP_TO_EDGE
 * wrapping (the settings all data textures use here).
 */
export function createFloatTexture(gl: WebGL2RenderingContext, width: number, height = width): WebGLTexture {
  const texture = gl.createTexture() as WebGLTexture;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

/**
 * Creates a framebuffer with the given texture as its color attachment.
 */
export function createFramebuffer(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  name = "framebuffer",
): WebGLFramebuffer {
  const framebuffer = gl.createFramebuffer() as WebGLFramebuffer;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`${name} is not complete`);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return framebuffer;
}

/**
 * Asynchronously reads a width x height RGBA float texture back to the CPU,
 * through a pixel pack buffer: the readPixels call is only *enqueued*, so the
 * CPU never waits for the GPU. Call poll() each frame to check for (and
 * retrieve) the result, then start() again for a fresh one.
 */
export class AsyncTexelsReader {
  private gl: WebGL2RenderingContext;
  private pbo: WebGLBuffer;
  private framebuffer: WebGLFramebuffer;
  private width: number;
  private height: number;
  private array: Float32Array;
  private fence: WebGLSync | null = null;

  constructor(gl: WebGL2RenderingContext, width = 1, height = width) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.array = new Float32Array(width * height * 4);
    this.pbo = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.pbo);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, this.array.byteLength, gl.STREAM_READ);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    this.framebuffer = gl.createFramebuffer() as WebGLFramebuffer;
  }

  /**
   * Enqueues a read of the given texture. Returns false if a read is already
   * in flight.
   */
  start(texture: WebGLTexture): boolean {
    const { gl } = this;
    if (this.fence) return false;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.readBuffer(gl.COLOR_ATTACHMENT0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.pbo);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.FLOAT, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) as WebGLSync;
    gl.flush();
    return true;
  }

  /**
   * Polls the pending read, without ever blocking. Returns the data if the
   * GPU is done with it, null else. The returned Float32Array is reused
   * across reads: consume it before starting a new read.
   */
  poll(): Float32Array | null {
    const { gl } = this;
    if (!this.fence) return null;

    const status = gl.clientWaitSync(this.fence, 0, 0);
    if (status === gl.TIMEOUT_EXPIRED) return null;

    gl.deleteSync(this.fence);
    this.fence = null;
    if (status === gl.WAIT_FAILED) throw new Error("AsyncTexelsReader: failed to wait for the read fence");

    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.pbo);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.array);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

    return this.array;
  }

  /**
   * Drops the pending read, if any (its data will never be retrieved).
   */
  cancel() {
    if (this.fence) {
      this.gl.deleteSync(this.fence);
      this.fence = null;
    }
  }

  kill() {
    this.cancel();
    this.gl.deleteBuffer(this.pbo);
    this.gl.deleteFramebuffer(this.framebuffer);
  }
}

/**
 * Full-screen quad vertex shader, shared by every "one fragment per texel"
 * compute pass.
 */
// language=GLSL
export const QUAD_VERTEX_SHADER = /*glsl*/ `#version 300 es
in vec2 a_position;

out vec2 v_textureCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_textureCoord = (a_position + vec2(1.0, 1.0)) / 2.0;
}`;

// language=GLSL
export const GLSL_getValueInTexture = /*glsl*/ `
vec4 getValueInTexture(sampler2D inputTexture, float index, float textureSize) {
  float row = floor(index / textureSize);
  float col = index - row * textureSize;

  return texelFetch(inputTexture, ivec2(int(col), int(row)), 0);
}
`;

// language=GLSL
export const GLSL_getIndex = /*glsl*/ `
float getIndex(vec2 positionInTexture, float textureSize) {
  float col = floor(positionInTexture.x * textureSize);
  float row = floor(positionInTexture.y * textureSize);
  return row * textureSize + col;
}
`;
