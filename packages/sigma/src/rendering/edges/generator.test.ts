/**
 * Unit tests for composed edge program shader generation.
 * These tests verify that generated shaders compile correctly.
 */
import {
  extremityArrow,
  extremityCircle,
  generateEdgeShaders,
  layerDashed,
  layerGradient,
  layerPlain,
  pathLine,
  pathLoop,
} from "sigma/rendering";
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

  test("generates compilable shaders with round-capped dashed layer", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerDashed({ cap: "round", dashSize: { value: 1, mode: "relative" } })],
    });

    expect(generated.fragmentShader).toContain("capRadius");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("dashed layer defaults to butt caps", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerDashed()],
    });

    expect(generated.fragmentShader).not.toContain("capRadius");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("no registered extremity produces geometry: skips the dead tail/head branch", () => {
    // A single zero-length extremity mirrors extremityNone(), which the factory always registers.
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow({ lengthRatio: 0 })],
      layers: [layerPlain()],
    });

    expect(generated.fragmentShader).not.toContain("TAIL ZONE");
    expect(generated.fragmentShader).not.toContain("EXTREMITY_BASE_RATIOS");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("single extremity with geometry keeps the branch but inlines the base ratio constant", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expect(generated.fragmentShader).toContain("TAIL ZONE");
    expect(generated.fragmentShader).not.toContain("EXTREMITY_BASE_RATIOS");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("multiple extremities keep the dynamic base-ratio array lookup", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow(), extremityCircle()],
      layers: [layerPlain()],
    });

    expect(generated.fragmentShader).toContain("EXTREMITY_BASE_RATIOS[v_headId]");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("EdgeContext normal reuses the already-computed tangent instead of re-deriving it", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expect(generated.fragmentShader).toContain("context.normal = vec2(-context.tangent.y, context.tangent.x);");
    expect(generated.fragmentShader).not.toContain("queryPathNormal(v_pathId");
  });

  test("pathLine-only shaders do not pay for node-size varyings", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expect(generated.vertexShader).not.toContain("v_sourceNodeSize");
    expect(generated.fragmentShader).not.toContain("v_sourceNodeSize");
  });

  test("pathLoop pulls in node-size varyings", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine(), pathLoop()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expect(generated.vertexShader).toContain("v_sourceNodeSize");
    expect(generated.fragmentShader).toContain("v_sourceNodeSize");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("antialias defaults to true: fragment shader keeps the smoothstep gradient", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
    });

    expect(generated.fragmentShader).toContain("smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF)");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("antialias: false produces a hard-edged fragment shader", () => {
    const generated = generateEdgeShaders({
      paths: [pathLine()],
      extremities: [extremityArrow()],
      layers: [layerPlain()],
      antialias: false,
    });

    expect(generated.fragmentShader).not.toContain("smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF)");
    expect(generated.fragmentShader).toContain("(finalSDF < 0.0 ? 1.0 : 0.0)");
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });
});
