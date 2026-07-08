/**
 * Sigma.js GL State Guard
 * =======================
 *
 * External code sharing sigma's WebGL context (e.g. GPU layouts hooking the
 * "afterTexturesUpload" event) must leave the GL state as it found it.
 * GLStateGuard snapshots the state such code typically touches, and restores
 * it afterward, so sigma never sees the difference:
 *
 *   guard.save();
 *   try { ...GL work... } finally { guard.restore(); }
 *
 * @module
 */
const SAVED_TEXTURE_UNITS = 8;

export class GLStateGuard {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private drawFramebuffer: WebGLFramebuffer | null = null;
  private readFramebuffer: WebGLFramebuffer | null = null;
  private viewport: Int32Array = new Int32Array(4);
  private blend = false;
  private blendSrcRGB: number = WebGL2RenderingContext.ONE;
  private blendDstRGB: number = WebGL2RenderingContext.ZERO;
  private blendSrcAlpha: number = WebGL2RenderingContext.ONE;
  private blendDstAlpha: number = WebGL2RenderingContext.ZERO;
  private blendEquationRGB: number = WebGL2RenderingContext.FUNC_ADD;
  private blendEquationAlpha: number = WebGL2RenderingContext.FUNC_ADD;
  private colorMask: boolean[] = [true, true, true, true];
  private activeTexture: number = WebGL2RenderingContext.TEXTURE0;
  private textures: (WebGLTexture | null)[] = [];

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  save(): void {
    const { gl } = this;
    this.program = gl.getParameter(gl.CURRENT_PROGRAM);
    this.vao = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
    this.drawFramebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
    this.readFramebuffer = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING);
    this.viewport = gl.getParameter(gl.VIEWPORT);
    this.blend = gl.isEnabled(gl.BLEND);
    this.blendSrcRGB = gl.getParameter(gl.BLEND_SRC_RGB);
    this.blendDstRGB = gl.getParameter(gl.BLEND_DST_RGB);
    this.blendSrcAlpha = gl.getParameter(gl.BLEND_SRC_ALPHA);
    this.blendDstAlpha = gl.getParameter(gl.BLEND_DST_ALPHA);
    this.blendEquationRGB = gl.getParameter(gl.BLEND_EQUATION_RGB);
    this.blendEquationAlpha = gl.getParameter(gl.BLEND_EQUATION_ALPHA);
    this.colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
    this.activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
    for (let i = 0; i < SAVED_TEXTURE_UNITS; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);
      this.textures[i] = gl.getParameter(gl.TEXTURE_BINDING_2D);
    }
    gl.activeTexture(this.activeTexture);
  }

  restore(): void {
    const { gl } = this;
    for (let i = 0; i < SAVED_TEXTURE_UNITS; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
    }
    gl.activeTexture(this.activeTexture);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.drawFramebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.readFramebuffer);
    gl.viewport(this.viewport[0], this.viewport[1], this.viewport[2], this.viewport[3]);
    if (this.blend) gl.enable(gl.BLEND);
    else gl.disable(gl.BLEND);
    gl.blendFuncSeparate(this.blendSrcRGB, this.blendDstRGB, this.blendSrcAlpha, this.blendDstAlpha);
    gl.blendEquationSeparate(this.blendEquationRGB, this.blendEquationAlpha);
    gl.colorMask(this.colorMask[0], this.colorMask[1], this.colorMask[2], this.colorMask[3]);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
  }
}
