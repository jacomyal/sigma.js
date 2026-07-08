import { describe, expect, test } from "vitest";

import {
  getDefaultQuadTreeDepth,
  getQuadTreeAtlasHeight,
  getQuadTreeAtlasWidth,
  getQuadTreeLevelRowOffset,
  getQuadTreeLevelSize,
} from "./index";

describe("quad-tree geometry", () => {
  test("levels are 2^(level+1) grids, stacked vertically in the atlas", () => {
    expect(getQuadTreeLevelSize(0)).toBe(2);
    expect(getQuadTreeLevelSize(1)).toBe(4);
    expect(getQuadTreeLevelSize(2)).toBe(8);

    expect(getQuadTreeLevelRowOffset(0)).toBe(0);
    expect(getQuadTreeLevelRowOffset(1)).toBe(2);
    expect(getQuadTreeLevelRowOffset(2)).toBe(6);

    // The atlas is exactly tall enough to stack all levels:
    const depth = 5;
    expect(getQuadTreeAtlasHeight(depth)).toBe(getQuadTreeLevelRowOffset(depth - 1) + getQuadTreeLevelSize(depth - 1));
    expect(getQuadTreeAtlasWidth(depth)).toBe(getQuadTreeLevelSize(depth - 1));
  });

  test("default depth gives roughly one finest cell per node, clamped to [3, 11]", () => {
    expect(getDefaultQuadTreeDepth(1)).toBe(3);
    expect(getDefaultQuadTreeDepth(10)).toBe(3);
    expect(getDefaultQuadTreeDepth(10000)).toBe(7);
    expect(getDefaultQuadTreeDepth(10_000_000)).toBe(11);
  });
});
