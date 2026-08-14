import { DataTexture } from "sigma/rendering";
import { beforeEach, describe, expect, test } from "vitest";

import { ItemAttributeTexture, computeAttributeLayout } from "./data-texture";

class TestDataTexture extends DataTexture {
  constructor(gl: WebGL2RenderingContext, initialCapacity?: number) {
    super(gl, 2, initialCapacity);
  }

  /** Expose protected data for testing */
  getData(): Float32Array {
    return this.data;
  }

  /** Write test data at an index */
  writeData(key: string, values: number[]): void {
    const index = this.indexMap.get(key);
    if (index === undefined) throw new Error(`Key "${key}" not allocated`);
    const offset = index * this.TEXELS_PER_ITEM * 4;
    values.forEach((v, i) => (this.data[offset + i] = v));
    this.markDirty(index);
  }
}

/**
 * Minimal WebGL2 mock - only implements methods used by DataTexture.
 */
function createMockGL(): WebGL2RenderingContext {
  return {
    createTexture: () => ({}),
    deleteTexture: () => {},
    bindTexture: () => {},
    texImage2D: () => {},
    texSubImage2D: () => {},
    texParameteri: () => {},
    activeTexture: () => {},
    TEXTURE_2D: 0x0de1,
    RGBA32F: 0x8814,
    RGBA: 0x1908,
    FLOAT: 0x1406,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    NEAREST: 0x2600,
    CLAMP_TO_EDGE: 0x812f,
    TEXTURE0: 0x84c0,
  } as unknown as WebGL2RenderingContext;
}

describe("DataTexture", () => {
  let gl: WebGL2RenderingContext;
  let texture: TestDataTexture;

  beforeEach(() => {
    gl = createMockGL();
    texture = new TestDataTexture(gl, 16);
  });

  describe("allocation", () => {
    test("allocates sequential indices for new keys", () => {
      expect(texture.allocate("a")).toBe(0);
      expect(texture.allocate("b")).toBe(1);
      expect(texture.allocate("c")).toBe(2);
    });

    test("returns existing index for already-allocated key", () => {
      const index = texture.allocate("a");
      expect(texture.allocate("a")).toBe(index);
      expect(texture.getCount()).toBe(1);
    });
  });

  describe("free and reuse", () => {
    test("freed indices are reused by subsequent allocations", () => {
      texture.allocate("a"); // 0
      texture.allocate("b"); // 1
      texture.allocate("c"); // 2

      texture.free("b"); // frees index 1

      // Next allocation should reuse freed index
      expect(texture.allocate("d")).toBe(1);
    });

    test("free zeroes out the data", () => {
      texture.allocate("a");
      texture.writeData("a", [1, 2, 3, 4, 5, 6, 7, 8]);

      texture.free("a");

      const data = texture.getData();
      for (let i = 0; i < 8; i++) {
        expect(data[i]).toBe(0);
      }
    });
  });

  describe("getIndex and has", () => {
    test("getIndex returns -1 for unknown keys", () => {
      expect(texture.getIndex("unknown")).toBe(-1);
    });

    test("has returns correct boolean", () => {
      expect(texture.has("a")).toBe(false);
      texture.allocate("a");
      expect(texture.has("a")).toBe(true);
      texture.free("a");
      expect(texture.has("a")).toBe(false);
    });
  });

  describe("dirty tracking", () => {
    test("starts clean, becomes dirty after allocation", () => {
      expect(texture.isDirty()).toBe(false);
      texture.allocate("a");
      expect(texture.isDirty()).toBe(false); // allocation alone doesn't dirty

      texture.writeData("a", [1, 2, 3, 4, 5, 6, 7, 8]);
      expect(texture.isDirty()).toBe(true);
    });

    test("upload clears dirty flag", () => {
      texture.allocate("a");
      texture.writeData("a", [1, 2, 3, 4, 5, 6, 7, 8]);
      expect(texture.isDirty()).toBe(true);

      texture.upload();
      expect(texture.isDirty()).toBe(false);
    });
  });

  describe("clear", () => {
    test("removes all allocations and marks dirty", () => {
      texture.allocate("a");
      texture.allocate("b");
      texture.upload();

      texture.clear();

      expect(texture.getCount()).toBe(0);
      expect(texture.has("a")).toBe(false);
      expect(texture.has("b")).toBe(false);
      expect(texture.isDirty()).toBe(true);
    });
  });

  describe("capacity and resize", () => {
    test("auto-resizes when capacity exceeded", () => {
      const smallTexture = new TestDataTexture(gl, 2);
      const initialCapacity = smallTexture.getCapacity();

      // Allocate more than initial capacity
      for (let i = 0; i < initialCapacity + 5; i++) {
        smallTexture.allocate(`item${i}`);
      }

      expect(smallTexture.getCapacity()).toBeGreaterThan(initialCapacity);
      expect(smallTexture.getCount()).toBe(initialCapacity + 5);
    });
  });
});

describe("ItemAttributeTexture", () => {
  // One vec4 attribute -> one texel per item, so row r lives at floats [r*4, r*4+4)
  const layout = computeAttributeLayout([{ attributes: [{ name: "a_value", size: 4 }] }] as never);

  class TestItemAttributeTexture extends ItemAttributeTexture {
    getData(): Float32Array {
      return this.data;
    }
  }

  test("updateAllAttributesAtRow writes at the exact row, gaps included", () => {
    const texture = new TestItemAttributeTexture(createMockGL(), layout, 16);

    // Skipping row 0 mirrors a hidden edge: later rows must not shift down
    texture.updateAllAttributesAtRow(1, [10, 11, 12, 13]);
    texture.updateAllAttributesAtRow(2, [20, 21, 22, 23]);

    expect(Array.from(texture.getData().slice(0, 4))).toEqual([0, 0, 0, 0]);
    expect(Array.from(texture.getData().slice(4, 8))).toEqual([10, 11, 12, 13]);
    expect(Array.from(texture.getData().slice(8, 12))).toEqual([20, 21, 22, 23]);
  });

  test("updateAllAttributesAtRow grows capacity and keeps existing rows", () => {
    const texture = new TestItemAttributeTexture(createMockGL(), layout, 4);

    texture.updateAllAttributesAtRow(1, [10, 11, 12, 13]);
    texture.updateAllAttributesAtRow(64, [40, 41, 42, 43]);

    expect(texture.getCapacity()).toBeGreaterThan(64);
    expect(Array.from(texture.getData().slice(4, 8))).toEqual([10, 11, 12, 13]);
    expect(Array.from(texture.getData().slice(64 * 4, 64 * 4 + 4))).toEqual([40, 41, 42, 43]);
  });
});
