/**
 * Unit tests for composed node program shader generation.
 * These tests verify that generated shaders compile correctly.
 */
import { generateShaders, layerFill, sdfCircle } from "sigma/rendering";
import { describe, expect, test } from "vitest";

import { expectShadersToCompile } from "../../_test-helpers";

describe("Composed node program shader generation", () => {
  test("antialias defaults to true: fragment shader keeps the smoothstep gradient", () => {
    const generated = generateShaders({
      shapes: [sdfCircle()],
      layers: [layerFill()],
    });

    expect(generated.fragmentShader).toContain("smoothstep(context.aaWidth, -context.aaWidth, context.sdf)");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("antialias: false produces a hard-edged fragment shader", () => {
    const generated = generateShaders({
      shapes: [sdfCircle()],
      layers: [layerFill()],
      antialias: false,
    });

    expect(generated.fragmentShader).not.toContain("smoothstep(context.aaWidth, -context.aaWidth, context.sdf)");
    expect(generated.fragmentShader).toContain("(context.sdf < 0.0 ? 1.0 : 0.0)");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });
});
