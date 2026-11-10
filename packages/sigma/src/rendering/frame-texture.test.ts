import { describe, expect, test } from "vitest";

import { FrameTexture } from "./frame-texture";

const MAX_TEXTURE_SIZE = 2048;

// Mock GL reporting a low limit (e.g. Firefox with resistFingerprinting), recording uploaded sizes.
function createLimitedGL() {
  const sizes: { width: number; height: number }[] = [];
  const gl = {
    getExtension: () => ({}),
    getParameter: (pname: number) => (pname === WebGL2RenderingContext.MAX_TEXTURE_SIZE ? MAX_TEXTURE_SIZE : 0),
    createTexture: () => ({}),
    deleteTexture: () => {},
    bindTexture: () => {},
    activeTexture: () => {},
    texParameteri: () => {},
    texImage2D: (_target: number, _level: number, _format: number, width: number, height: number) => {
      sizes.push({ width, height });
    },
    createFramebuffer: () => ({}),
    deleteFramebuffer: () => {},
    bindFramebuffer: () => {},
    framebufferTexture2D: () => {},
    checkFramebufferStatus: () => WebGL2RenderingContext.FRAMEBUFFER_COMPLETE,
    MAX_TEXTURE_SIZE: WebGL2RenderingContext.MAX_TEXTURE_SIZE,
    TEXTURE_2D: WebGL2RenderingContext.TEXTURE_2D,
    TEXTURE0: WebGL2RenderingContext.TEXTURE0,
    R32F: WebGL2RenderingContext.R32F,
    RED: WebGL2RenderingContext.RED,
    RGBA32F: WebGL2RenderingContext.RGBA32F,
    RGBA: WebGL2RenderingContext.RGBA,
    FLOAT: WebGL2RenderingContext.FLOAT,
    TEXTURE_MIN_FILTER: WebGL2RenderingContext.TEXTURE_MIN_FILTER,
    TEXTURE_MAG_FILTER: WebGL2RenderingContext.TEXTURE_MAG_FILTER,
    TEXTURE_WRAP_S: WebGL2RenderingContext.TEXTURE_WRAP_S,
    TEXTURE_WRAP_T: WebGL2RenderingContext.TEXTURE_WRAP_T,
    NEAREST: WebGL2RenderingContext.NEAREST,
    CLAMP_TO_EDGE: WebGL2RenderingContext.CLAMP_TO_EDGE,
    FRAMEBUFFER: WebGL2RenderingContext.FRAMEBUFFER,
    COLOR_ATTACHMENT0: WebGL2RenderingContext.COLOR_ATTACHMENT0,
    FRAMEBUFFER_COMPLETE: WebGL2RenderingContext.FRAMEBUFFER_COMPLETE,
  } as unknown as WebGL2RenderingContext;
  return { gl, sizes };
}

function expectWithinLimit(sizes: { width: number; height: number }[]) {
  expect(sizes.length).toBeGreaterThan(0);
  for (const { width, height } of sizes) {
    expect(width).toBeLessThanOrEqual(MAX_TEXTURE_SIZE);
    expect(height).toBeLessThanOrEqual(MAX_TEXTURE_SIZE);
  }
}

describe("Frame texture size limit (regression #1565)", () => {
  test("keeps the texture within MAX_TEXTURE_SIZE at creation", () => {
    const { gl, sizes } = createLimitedGL();
    const texture = new FrameTexture(gl, { channels: 1, initialCapacity: 4096 });

    expectWithinLimit(sizes);
    expect(texture.getTextureWidth() * texture.getTextureHeight()).toBeGreaterThanOrEqual(4096);
  });

  test("keeps the texture within MAX_TEXTURE_SIZE after growing", () => {
    const { gl, sizes } = createLimitedGL();
    const texture = new FrameTexture(gl, { channels: 4 });

    texture.ensureCapacity(3000);

    expectWithinLimit(sizes);
    expect(texture.getTextureWidth() * texture.getTextureHeight()).toBeGreaterThanOrEqual(3000);
  });
});
