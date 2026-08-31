/**
 * Unit tests for SDFAtlasManager's texture paging.
 *
 * Glyphs are packed into fixed-size pages, and every finalized page is captured
 * with `getImageData`. The capture width has to reflect what the page actually
 * holds: cropping a page that already carries completed rows discards its
 * glyphs, and since the label programs only ever upload page 0, that shows up
 * as labels rendering with no visible text at all.
 */
import { describe, expect, test } from "vitest";

import { SDFAtlasManager } from "./sdf-atlas";

const FONT = { family: "sans-serif", weight: "normal", style: "normal" };

// Enough distinct characters to fill several rows of a deliberately tiny page.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function createManager(maxTextureSize: number) {
  return new SDFAtlasManager({ fontSize: 32, maxTextureSize, debounceTimeout: null });
}

describe("SDFAtlasManager", () => {
  test("keeps a page that holds completed rows at full width when overflowing", () => {
    const maxTextureSize = 128;
    const manager = createManager(maxTextureSize);
    const fontKey = manager.registerFont(FONT);

    manager.ensureGlyphs(GLYPHS, fontKey);
    manager.flush();

    const textures = manager.getTextures();

    // The point of the tiny page size: this must actually have overflowed.
    expect(textures.length).toBeGreaterThan(1);
    expect(textures[0].width).toBe(maxTextureSize);
    for (const [index, page] of textures.entries()) {
      expect(page.width, `page ${index} was cropped`).toBeGreaterThan(1);
    }

    manager.destroy();
  });

  test("packs a small glyph set into a single page", () => {
    const manager = createManager(2048);
    const fontKey = manager.registerFont(FONT);

    manager.ensureGlyphs("abc", fontKey);
    manager.flush();

    const textures = manager.getTextures();

    expect(textures).toHaveLength(1);
    expect(textures[0].width).toBeGreaterThan(1);
    expect(manager.getGlyphCount()).toBe(3);

    manager.destroy();
  });
});
