/**
 * Unit tests for composed edge program shader generation.
 * These tests verify that generated shaders compile correctly.
 */
import { extremityArrow, generateEdgeShaders, layerDashed, layerGradient, layerPlain, pathLine } from "sigma/rendering";
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

  test("generates compilable shaders with gradient layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerGradient({ stops: [{ node: "source" }, { node: "target" }] })],
    });

    expect(generated.vertexShader).toContain("readNodeColor");
    expect(generated.vertexShader).toContain("v_targetColor");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("generates compilable shaders with per-edge toggled gradient layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [
        layerPlain(),
        layerGradient({
          stops: [{ node: "source" }, { node: "target" }],
          enabled: { attribute: "gradient" },
        }),
      ],
    });

    expect(generated.fragmentShader).toContain("v_gradient");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("gradient layer with non-node stops does not pay for node color varyings", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerGradient({ stops: ["#ff0000", { attribute: "toColor" }] })],
    });

    expect(generated.vertexShader).not.toContain("v_sourceColor");
    expect(generated.fragmentShader).toContain("v_gradientStop1");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("generates compilable shaders with multi-stop gradient layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerGradient({ stops: [{ node: "source" }, "transparent", { node: "target" }] })],
    });

    // The unpositioned middle stop lands halfway between its neighbors
    expect(generated.fragmentShader).toContain("0.500000");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("generates compilable shaders with offset gradient stops", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerGradient({ stops: [{ node: "source" }, { color: "transparent", offset: 0.1 }] })],
    });

    // The explicit offset is baked into the segment span
    expect(generated.fragmentShader).toContain("0.100000");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("generates compilable shaders with inline stop offsets", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [
        layerGradient({
          stops: [
            { node: "source", offset: 0.5 },
            { node: "target", offset: 0.5 },
          ],
        }),
      ],
    });

    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("gradient layer requires at least two stops", () => {
    expect(() => layerGradient({ stops: [{ node: "source" }] })).toThrow();
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
