import { colorToGLSLString, colorToIndex, indexToColor, parseColor } from "sigma/utils";
import { describe, expect, test } from "vitest";

/** Bytes the GPU sees for a packed picking ID (little-endian: R, G, B, A). */
function bytesOf(packed: number): [r: number, g: number, b: number, a: number] {
  // Two views over the same 4 bytes: write through `ints`, read through `bytes`
  const buf = new ArrayBuffer(4);
  const ints = new Uint32Array(buf);
  const bytes = new Uint8Array(buf);
  ints[0] = packed;
  return [bytes[0], bytes[1], bytes[2], bytes[3]];
}

describe("parseColor", () => {
  test("it should parse 6-digit hex colors", () => {
    expect(parseColor("#ff0000")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("#00ff00")).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(parseColor("#0000ff")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(parseColor("#ffffff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("#000000")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  test("it should parse 3-digit hex colors", () => {
    expect(parseColor("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("#0f0")).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(parseColor("#00f")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("#000")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  test("it should parse 8-digit hex colors with alpha", () => {
    expect(parseColor("#ff0000ff")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("#ff000080")).toEqual({ r: 255, g: 0, b: 0, a: 128 / 255 });
    expect(parseColor("#ff000000")).toEqual({ r: 255, g: 0, b: 0, a: 0 });
  });

  test("it should parse rgb() notation", () => {
    expect(parseColor("rgb(255, 0, 0)")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("rgb(0, 255, 0)")).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(parseColor("rgb(0, 0, 255)")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(parseColor("rgb(128, 64, 32)")).toEqual({ r: 128, g: 64, b: 32, a: 1 });
  });

  test("it should parse rgba() notation", () => {
    expect(parseColor("rgba(255, 0, 0, 1)")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("rgba(255, 0, 0, 0.5)")).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    expect(parseColor("rgba(255, 0, 0, 0)")).toEqual({ r: 255, g: 0, b: 0, a: 0 });
    expect(parseColor("rgba(128, 64, 32, 0.75)")).toEqual({ r: 128, g: 64, b: 32, a: 0.75 });
  });

  test("it should parse named CSS colors", () => {
    expect(parseColor("red")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("green")).toEqual({ r: 0, g: 128, b: 0, a: 1 });
    expect(parseColor("blue")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(parseColor("white")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("black")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  test("it should be case-insensitive for named CSS colors", () => {
    expect(parseColor("RED")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("Red")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("BLUE")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
  });

  test("it should parse 'transparent' keyword", () => {
    expect(parseColor("transparent")).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(parseColor("Transparent")).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(parseColor("TRANSPARENT")).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });
});

describe("colorToGLSLString", () => {
  test("it should convert hex colors to GLSL vec4", () => {
    expect(colorToGLSLString("#ff0000")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#00ff00")).toBe("vec4(0.000000, 1.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#0000ff")).toBe("vec4(0.000000, 0.000000, 1.000000, 1.000000)");
    expect(colorToGLSLString("#ffffff")).toBe("vec4(1.000000, 1.000000, 1.000000, 1.000000)");
    expect(colorToGLSLString("#000000")).toBe("vec4(0.000000, 0.000000, 0.000000, 1.000000)");
  });

  test("it should convert 3-digit hex colors to GLSL vec4", () => {
    expect(colorToGLSLString("#f00")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#0f0")).toBe("vec4(0.000000, 1.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#00f")).toBe("vec4(0.000000, 0.000000, 1.000000, 1.000000)");
  });

  test("it should convert 8-digit hex colors with alpha to GLSL vec4", () => {
    expect(colorToGLSLString("#ff0000ff")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#ff000080")).toBe("vec4(1.000000, 0.000000, 0.000000, 0.501961)");
    expect(colorToGLSLString("#ff000000")).toBe("vec4(1.000000, 0.000000, 0.000000, 0.000000)");
  });

  test("it should convert HTML color names to GLSL vec4", () => {
    expect(colorToGLSLString("red")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("green")).toBe("vec4(0.000000, 0.501961, 0.000000, 1.000000)"); // #008000
    expect(colorToGLSLString("blue")).toBe("vec4(0.000000, 0.000000, 1.000000, 1.000000)");
    expect(colorToGLSLString("white")).toBe("vec4(1.000000, 1.000000, 1.000000, 1.000000)");
    expect(colorToGLSLString("black")).toBe("vec4(0.000000, 0.000000, 0.000000, 1.000000)");
  });

  test("it should be case-insensitive for HTML color names", () => {
    expect(colorToGLSLString("RED")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("Red")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("BLUE")).toBe("vec4(0.000000, 0.000000, 1.000000, 1.000000)");
  });

  test("it should convert rgb() notation to GLSL vec4", () => {
    expect(colorToGLSLString("rgb(255, 0, 0)")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("rgb(0, 255, 0)")).toBe("vec4(0.000000, 1.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("rgb(128, 128, 128)")).toBe("vec4(0.501961, 0.501961, 0.501961, 1.000000)");
  });

  test("it should convert rgba() notation to GLSL vec4", () => {
    expect(colorToGLSLString("rgba(255, 0, 0, 1)")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("rgba(255, 0, 0, 0.5)")).toBe("vec4(1.000000, 0.000000, 0.000000, 0.500000)");
    expect(colorToGLSLString("rgba(255, 0, 0, 0)")).toBe("vec4(1.000000, 0.000000, 0.000000, 0.000000)");
  });

  test("it should handle mixed-case hex values", () => {
    expect(colorToGLSLString("#FF0000")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#Ff0000")).toBe("vec4(1.000000, 0.000000, 0.000000, 1.000000)");
    expect(colorToGLSLString("#aAbBcC")).toBe("vec4(0.666667, 0.733333, 0.800000, 1.000000)");
  });

  test("it should produce valid GLSL float format with decimal points", () => {
    const result = colorToGLSLString("#808080");
    // Should contain decimal points for valid GLSL floats
    expect(result).toMatch(/vec4\(\d+\.\d+, \d+\.\d+, \d+\.\d+, \d+\.\d+\)/);
    // Gray (128) should be approximately 0.5
    expect(result).toBe("vec4(0.501961, 0.501961, 0.501961, 1.000000)");
  });

  test("it should convert 'transparent' to GLSL vec4", () => {
    expect(colorToGLSLString("transparent")).toBe("vec4(0.000000, 0.000000, 0.000000, 0.000000)");
    expect(colorToGLSLString("Transparent")).toBe("vec4(0.000000, 0.000000, 0.000000, 0.000000)");
  });
});

describe("indexToColor / colorToIndex (picking IDs)", () => {
  describe("encoding layout", () => {
    test("ID 0 (no-hit sentinel) encodes to (0, 0, 0, 0)", () => {
      expect(bytesOf(indexToColor(0))).toEqual([0, 0, 0, 0]);
    });

    test("ID 1 (first allocated) encodes to (0, 0, 0, 1)", () => {
      expect(bytesOf(indexToColor(1))).toEqual([0, 0, 0, 1]);
    });

    test("alpha is the fast-changing byte (consecutive IDs differ in alpha by 1)", () => {
      for (let k = 1; k <= 10; k++) {
        expect(bytesOf(indexToColor(k))[3]).toBe(k & 0xff);
      }
    });
  });

  describe("round-trip indexToColor -> bytes -> colorToIndex", () => {
    test("IDs in the first 300 round-trip", () => {
      for (let k = 1; k <= 300; k++) {
        const [r, g, b, a] = bytesOf(indexToColor(k));
        expect(colorToIndex(r, g, b, a)).toBe(k);
      }
    });

    test("IDs at byte-rollover boundaries round-trip", () => {
      const boundaries = [
        1, 0x100, 0x101, 0xffff, 0x10000, 0x10001, 0xffffff, 0x1000000, 0x1000001, 0x7fffffff, 0x80000000, 0x80000001,
        0xfffffffe, 0xffffffff,
      ];
      for (const k of boundaries) {
        const [r, g, b, a] = bytesOf(indexToColor(k));
        expect(colorToIndex(r, g, b, a)).toBe(k);
      }
    });

    test("IDs that would land on float32 NaN bit patterns round-trip", () => {
      // Regression for #1397: these IDs encode to NaN/Inf as float32.
      const ids = [
        0x800000ff, // bytes (0,0,0x80,0xff), float = -Infinity
        0x8000007f, // bytes (0,0,0x80,0x7f), float = +Infinity
        0x800001ff, // bytes (1,0,0x80,0xff), float = NaN
        0x800100ff, // bytes (0,1,0x80,0xff), float = NaN
        0x810000ff, // bytes (0,0,0x81,0xff), float = NaN
        0xffff7fff, // bytes (0x7f,0xff,0xff,0xff), float = NaN
      ];
      for (const k of ids) {
        const [r, g, b, a] = bytesOf(indexToColor(k));
        expect(colorToIndex(r, g, b, a)).toBe(k);
      }
    });
  });

  describe("colorToIndex decoding", () => {
    test("(0, 0, 0, 0) is the no-hit sentinel -> 0", () => {
      expect(colorToIndex(0, 0, 0, 0)).toBe(0);
    });

    test("decodes the extreme valid IDs", () => {
      // Max representable picking ID.
      const max = 0xffffffff;
      const [r, g, b, a] = bytesOf(indexToColor(max));
      expect(colorToIndex(r, g, b, a)).toBe(max);
    });

    test("partial-pixel reads (single non-zero channel) decode to valid IDs", () => {
      // A read where only one channel is non-zero must not collide with
      // no-hit. (Useful sanity: any byte tuple other than 0,0,0,0 is a hit.)
      expect(colorToIndex(1, 0, 0, 0)).not.toBe(0);
      expect(colorToIndex(0, 1, 0, 0)).not.toBe(0);
      expect(colorToIndex(0, 0, 1, 0)).not.toBe(0);
      expect(colorToIndex(0, 0, 0, 1)).not.toBe(0);
    });
  });
});
