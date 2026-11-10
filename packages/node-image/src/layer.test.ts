import { LayerLifecycleContext } from "sigma/rendering";
import { describe, expect, test } from "vitest";

import { layerImage } from "./layer";
import { TextureManager } from "./texture";

const MAX_TEXTURE_SIZE = 2048;
const IMAGES_COUNT = 20;

// Mock GL reporting a low limit (e.g. Firefox with resistFingerprinting).
function createLimitedGL(): WebGL2RenderingContext {
  return {
    getParameter: (pname: number) => (pname === WebGL2RenderingContext.MAX_TEXTURE_SIZE ? MAX_TEXTURE_SIZE : 0),
    createTexture: () => ({}),
    deleteTexture: () => {},
    activeTexture: () => {},
    bindTexture: () => {},
    texImage2D: () => {},
    generateMipmap: () => {},
    MAX_TEXTURE_SIZE: WebGL2RenderingContext.MAX_TEXTURE_SIZE,
    TEXTURE_2D: WebGL2RenderingContext.TEXTURE_2D,
    TEXTURE0: WebGL2RenderingContext.TEXTURE0,
    RGBA: WebGL2RenderingContext.RGBA,
    UNSIGNED_BYTE: WebGL2RenderingContext.UNSIGNED_BYTE,
  } as unknown as WebGL2RenderingContext;
}

function createImageURL(i: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = `hsl(${i * 18}, 80%, 50%)`;
  ctx.fillRect(0, 0, 512, 512);
  return canvas.toDataURL();
}

describe("Image atlas size limit (regression #1565)", () => {
  test("keeps atlases within the context MAX_TEXTURE_SIZE", async () => {
    const textureManager = new TextureManager({ debounceTimeout: null });
    const context: LayerLifecycleContext = {
      gl: createLimitedGL(),
      renderer: { refresh: () => {} },
      getUniformLocation: () => null,
      requestShaderRegeneration: () => {},
      requestRefresh: () => {},
    };
    layerImage({ textureManager }).lifecycle!(context).init?.();

    // 20 images of 512px take ~3600px wide in a 4096 atlas
    await Promise.all(Array.from({ length: IMAGES_COUNT }, (_, i) => textureManager.registerImage(createImageURL(i))));

    const textures = textureManager.getTextures();
    expect(textures.length).toBeGreaterThan(1);
    for (const { width, height } of textures) {
      expect(width).toBeLessThanOrEqual(MAX_TEXTURE_SIZE);
      expect(height).toBeLessThanOrEqual(MAX_TEXTURE_SIZE);
    }
    const atlas = textureManager.getAtlas();
    expect(Object.keys(atlas)).toHaveLength(IMAGES_COUNT);
    for (const key in atlas) expect(atlas[key].textureIndex).toBeLessThan(textures.length);
  });
});
