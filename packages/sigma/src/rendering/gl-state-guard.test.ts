import { beforeEach, describe, expect, test } from "vitest";

import { GLStateGuard } from "./gl-state-guard";

let gl: WebGL2RenderingContext;

beforeEach(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
});

describe("GLStateGuard", () => {
  test("it should restore the state a guarded section changes", () => {
    const guard = new GLStateGuard(gl);

    // Establish a known state:
    gl.viewport(1, 2, 3, 4);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendEquation(gl.FUNC_SUBTRACT);
    gl.colorMask(true, true, true, true);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    guard.save();

    // Trash everything a GPU pass typically touches:
    gl.viewport(0, 0, 16, 16);
    gl.disable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
    gl.colorMask(true, false, false, true);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    guard.restore();

    expect(Array.from(gl.getParameter(gl.VIEWPORT) as Int32Array)).toEqual([1, 2, 3, 4]);
    expect(gl.isEnabled(gl.BLEND)).toBe(true);
    expect(gl.getParameter(gl.BLEND_SRC_RGB)).toBe(gl.ONE);
    expect(gl.getParameter(gl.BLEND_DST_RGB)).toBe(gl.ONE_MINUS_SRC_ALPHA);
    expect(gl.getParameter(gl.BLEND_EQUATION_RGB)).toBe(gl.FUNC_SUBTRACT);
    expect(gl.getParameter(gl.COLOR_WRITEMASK)).toEqual([true, true, true, true]);
    expect(gl.getParameter(gl.ACTIVE_TEXTURE)).toBe(gl.TEXTURE2);
    expect(gl.getParameter(gl.TEXTURE_BINDING_2D)).toBe(texture);
    expect(gl.getParameter(gl.VERTEX_ARRAY_BINDING)).toBe(vao);
    expect(gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING)).toBe(framebuffer);
    expect(gl.getParameter(gl.READ_FRAMEBUFFER_BINDING)).toBe(framebuffer);
  });
});
