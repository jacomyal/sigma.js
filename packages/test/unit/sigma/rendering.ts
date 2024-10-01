import { numberToGLSLFloat } from "sigma/rendering";
import { describe, expect, test } from "vitest";

describe("rendering utils", () => {
  describe("numberToGLSLFloat", () => {
    test('it should properly print all kind of numbers to "GLSL float" strings', () => {
      const tests: [number, string][] = [
        [1, "1.0"],
        [123, "123.0"],
        [1.23, "1.23"],
        [0.123, "0.123"],
        [1230, "1230.0"],
        [12300, "12300.0"],
        [1e-6, "0.000001"],
        [1e6, "1000000.0"],
      ];

      tests.forEach(([input, expectedOutput]) => expect(numberToGLSLFloat(input)).toBe(expectedOutput));
    });
  });
});
