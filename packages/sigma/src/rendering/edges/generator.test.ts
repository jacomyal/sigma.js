/**
 * Unit tests for composed edge program shader generation.
 * These tests verify that generated shaders compile correctly.
 */
import { extremityArrow, generateEdgeShaders, layerDashed, layerPlain, pathLine } from "sigma/rendering";
import { describe, expect, test } from "vitest";

import { expectShadersToCompile } from "../../_test-helpers";

describe("Composed edge program shader generation", () => {
  test("generates compilable shaders with plain layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("plain-only shaders do not pay for node color varyings", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expect(generated.vertexShader).not.toContain("v_sourceColor");
    expect(generated.fragmentShader).not.toContain("v_sourceColor");
  });

  test("generates compilable shaders with node-colored plain layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain({ color: { node: "source" } })],
    });

    expect(generated.fragmentShader).toContain("v_sourceColor");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("generates compilable shaders with node-colored dashed layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain(), layerDashed({ dashColor: { node: "target" }, gapColor: "#ffffff" })],
    });

    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });
});
