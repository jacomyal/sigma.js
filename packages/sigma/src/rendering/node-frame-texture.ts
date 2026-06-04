/**
 * Sigma.js Node Frame Texture
 * ===========================
 *
 * A per-frame scratchpad with one slot per node. The label frame-pass fills it
 * in once; every label part (text, background, backdrop, attachment) reads it
 * back, so the cost of locating a node's edge is paid once, and they all agree
 * on where the label goes.
 *
 * @module
 */

const INITIAL_CAPACITY = 1024;
const GROWTH_FACTOR = 1.5;
// Match DataTexture: cap width at a widely-supported limit, grow height.
const MAX_TEXTURE_WIDTH = 4096;

export class NodeFrameTexture {
  private gl: WebGL2RenderingContext;
  private texture: WebGLTexture | null = null;
  private framebuffer: WebGLFramebuffer | null = null;
  private capacity: number;
  private textureWidth: number;
  private textureHeight: number;

  constructor(gl: WebGL2RenderingContext, initialCapacity: number = INITIAL_CAPACITY) {
    // Float color-buffer rendering must be enabled before R32F is renderable.
    if (!gl.getExtension("EXT_color_buffer_float")) {
      throw new Error(
        "sigma: EXT_color_buffer_float is required for label placement but is unavailable in this WebGL2 context.",
      );
    }

    this.gl = gl;
    this.capacity = this.roundUpToPowerOfTwo(initialCapacity);
    const dims = this.computeDimensions(this.capacity);
    this.textureWidth = dims.width;
    this.textureHeight = dims.height;
    this.create();
  }

  private roundUpToPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(Math.max(1, n))));
  }

  private computeDimensions(capacity: number): { width: number; height: number } {
    const width = Math.min(capacity, MAX_TEXTURE_WIDTH);
    const height = Math.ceil(capacity / width);
    return { width, height };
  }

  private create(): void {
    const { gl } = this;

    this.texture = gl.createTexture();
    // Transient unit 0, so a resize never clears a data texture on the active unit.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, this.textureWidth, this.textureHeight, 0, gl.RED, gl.FLOAT, null);
    // Sampled with texelFetch (nearest, no filtering needed).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("sigma: R32F framebuffer for label placement is incomplete.");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * Grows the texture so `capacity` nodes are addressable, keeping it sized
   * against the node-data texture. A no-op once large enough.
   */
  ensureCapacity(capacity: number): void {
    if (capacity <= this.capacity) return;

    const { gl } = this;
    this.capacity = this.roundUpToPowerOfTwo(Math.ceil(capacity * GROWTH_FACTOR));
    const dims = this.computeDimensions(this.capacity);
    this.textureWidth = dims.width;
    this.textureHeight = dims.height;

    if (this.texture) gl.deleteTexture(this.texture);
    if (this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
    this.create();
  }

  /**
   * Binds the texture as the render target and sets the viewport to its size,
   * ready for the frame-pass to scatter values into it. The caller restores the
   * default framebuffer/viewport afterward.
   */
  bindAsRenderTarget(): void {
    const { gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.textureWidth, this.textureHeight);
  }

  /** Binds the texture to a unit for sampling by consumers. */
  bind(textureUnit: number): void {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  getTexture(): WebGLTexture | null {
    return this.texture;
  }

  getTextureWidth(): number {
    return this.textureWidth;
  }

  getTextureHeight(): number {
    return this.textureHeight;
  }

  kill(): void {
    const { gl } = this;
    if (this.texture) {
      gl.deleteTexture(this.texture);
      this.texture = null;
    }
    if (this.framebuffer) {
      gl.deleteFramebuffer(this.framebuffer);
      this.framebuffer = null;
    }
  }
}
