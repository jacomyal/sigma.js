import type Sigma from "sigma";
import { Program, ProgramAttributeSpecification } from "sigma/rendering";
import { RenderParams } from "sigma/types";
import { describe, expect, test } from "vitest";

const { FLOAT, SHORT, UNSIGNED_BYTE, TRIANGLES } = WebGL2RenderingContext;

// language=GLSL
const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec4 a_color;
out vec4 v_color;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`;

// language=GLSL
const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 fragColor;
void main() {
  fragColor = v_color;
}`;

const SIZE = 16;
const RED = [255, 0, 0, 255];

// Draws a red viewport-covering triangle and returns the center pixel.
function renderCenterPixel(extraAttributes: ProgramAttributeSpecification[] = []): number[] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  class TestProgram extends Program {
    getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE: VERTEX_SHADER,
        FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER,
        UNIFORMS: [],
        METHOD: TRIANGLES,
        ATTRIBUTES: [
          ...extraAttributes,
          { name: "a_position", size: 2, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
        ],
      };
    }
    setUniforms() {}
  }
  const program = new TestProgram(gl, null, null as unknown as Sigma);

  program.reallocate(1);
  const slots = program.ATTRIBUTES_ITEMS_COUNT;
  [
    [-1, -1],
    [3, -1],
    [-1, 3],
  ].forEach(([x, y], i) => {
    const offset = (i + 1) * slots - 3;
    program.floats[offset] = x;
    program.floats[offset + 1] = y;
    program.ints[offset + 2] = 0xff0000ff; // red, packed as RGBA bytes
  });
  program.invalidateBuffers();

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  program.render({ width: SIZE, height: SIZE, pixelRatio: 1, downSizingRatio: 1 } as RenderParams);

  const pixel = new Uint8Array(4);
  gl.readPixels(SIZE / 2, SIZE / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  return Array.from(pixel);
}

const SUPPORTED: [string, ProgramAttributeSpecification[]][] = [
  ["no extra attribute", []],
  ["a FLOAT attribute", [{ name: "a_extra", size: 2, type: FLOAT }]],
  ["a normalized UNSIGNED_BYTE * 4 attribute", [{ name: "a_extra", size: 4, type: UNSIGNED_BYTE, normalized: true }]],
];

const UNSUPPORTED: [string, ProgramAttributeSpecification[]][] = [
  ["a SHORT attribute", [{ name: "a_extra", size: 2, type: SHORT }]],
  ["a normalized UNSIGNED_BYTE * 2 attribute", [{ name: "a_extra", size: 2, type: UNSIGNED_BYTE, normalized: true }]],
  ["a normalized FLOAT attribute", [{ name: "a_extra", size: 2, type: FLOAT, normalized: true }]],
];

describe("Program vertex attributes (regression #1323)", () => {
  test.each(SUPPORTED)("renders correctly with %s", (_label, extra) => {
    expect(renderCenterPixel(extra)).toEqual(RED);
  });

  test.each(UNSUPPORTED)("%s throws instead of silently corrupting rendering", (_label, extra) => {
    let pixel: number[];
    try {
      pixel = renderCenterPixel(extra);
    } catch {
      return;
    }
    // Silent breakage: GL reads a_position and a_color from the wrong bytes
    expect(pixel).toEqual(RED);
  });
});
