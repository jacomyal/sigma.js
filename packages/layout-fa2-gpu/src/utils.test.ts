import { beforeEach, describe, expect, test } from "vitest";

import { createFloatTexture, createFramebuffer, createProgram, getTextureSize } from "./utils";

let gl: WebGL2RenderingContext;

beforeEach(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  gl.getExtension("EXT_color_buffer_float");
});

describe("getTextureSize", () => {
  test("it should return the side of the smallest square texture holding the items", () => {
    expect(getTextureSize(0)).toBe(0);
    expect(getTextureSize(1)).toBe(1);
    expect(getTextureSize(4)).toBe(2);
    expect(getTextureSize(5)).toBe(3);
    expect(getTextureSize(10000)).toBe(100);
    expect(getTextureSize(10001)).toBe(101);
  });
});

describe("createFloatTexture / createFramebuffer", () => {
  test("it should create a complete, readable render target", () => {
    const texture = createFloatTexture(gl, 4);
    // createFramebuffer throws if the framebuffer is not complete:
    const framebuffer = createFramebuffer(gl, texture, "test framebuffer");

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const pixels = new Float32Array(4 * 4 * 4);
    gl.readPixels(0, 0, 4, 4, gl.RGBA, gl.FLOAT, pixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    expect(gl.getError()).toBe(gl.NO_ERROR);
    expect(Array.from(pixels.slice(0, 4))).toEqual([0, 0, 0, 0]);
  });

  test("it should support non-square textures", () => {
    const texture = createFloatTexture(gl, 8, 2);
    expect(() => createFramebuffer(gl, texture, "non-square framebuffer")).not.toThrow();
  });
});

describe("createProgram", () => {
  test("it should compile, link, and pin the given attribute on location 0", () => {
    const program = createProgram(
      gl,
      `#version 300 es
in float a_custom;
void main() { gl_Position = vec4(a_custom, 0.0, 0.0, 1.0); gl_PointSize = 1.0; }`,
      `#version 300 es
precision highp float;
out vec4 fragColor;
void main() { fragColor = vec4(1.0); }`,
      "test program",
      "a_custom",
    );

    expect(gl.getAttribLocation(program, "a_custom")).toBe(0);
  });

  test("it should throw on invalid GLSL", () => {
    expect(() => createProgram(gl, "not GLSL", "not GLSL either", "broken program")).toThrow();
  });
});
