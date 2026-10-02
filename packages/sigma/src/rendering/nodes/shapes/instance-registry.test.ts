/**
 * Unit tests for the shape instance registry, focused on shape attributes.
 */
import {
  extremityArrow,
  generateBackdropShaders,
  generateShaders,
  layerFill,
  layerPlain,
  pathLine,
  sdfCircle,
} from "sigma/rendering";
import { beforeEach, describe, expect, test } from "vitest";

import { compileShader, createTestGL, expectShadersToCompile } from "../../../_test-helpers";
import { generateEdgeFramePassVertexShader } from "../../edges/generator";
import { AttributeSpecification, SDFShape } from "../types";
import {
  clearShapeInstanceRegistry,
  generateNodeShapeSelectorGLSL,
  generateShapeSelectorGLSL,
  getStaticAttributeDefault,
  registerShapeInstance,
} from "./instance-registry";
import { sdfRectangle } from "./rectangle";

/** A rectangle-ish shape with one real per-node attribute (aspectRatio). */
function sdfTestRectangle(name = "instanceRegistryTestRectangle"): SDFShape {
  return {
    name,
    glsl: `
float sdf_${name}(vec2 uv, float size, float aspectRatio) {
  vec2 halfExtent = aspectRatio >= 1.0 ? size * vec2(1.0, 1.0 / aspectRatio) : size * vec2(aspectRatio, 1.0);
  vec2 d = abs(uv) - halfExtent;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,
    uniforms: [],
    attributes: [{ name: "aspectRatio", size: 1, type: WebGL2RenderingContext.FLOAT }],
    variables: { aspectRatio: { type: "number", default: 1 } },
  };
}

beforeEach(() => {
  clearShapeInstanceRegistry();
});

describe("generateNodeShapeSelectorGLSL (per-node fragment shader)", () => {
  test("passes a shape attribute as the real per-node varying, single-shape mode", () => {
    const glsl = generateNodeShapeSelectorGLSL([sdfTestRectangle()]);
    expect(glsl).toContain("sdf_instanceRegistryTestRectangle(uv, size, v_aspectRatio)");
  });

  test("passes a shape attribute as the real per-node varying, multi-shape mode", () => {
    const glsl = generateNodeShapeSelectorGLSL([sdfCircle(), sdfTestRectangle()]);
    expect(glsl).toContain("sdf_instanceRegistryTestRectangle(uv, size, v_aspectRatio)");
  });

  test("a shape with no declared attributes is unaffected (no extra params)", () => {
    const glsl = generateNodeShapeSelectorGLSL([sdfCircle()]);
    expect(glsl).toContain("sdf_circle(uv, size)");
    expect(glsl).not.toContain("v_");
  });
});

describe("generateShapeSelectorGLSL (global registry, used by edge clamping)", () => {
  test("falls back to the shape's declared default literal instead of a varying", () => {
    registerShapeInstance(sdfTestRectangle());
    const glsl = generateShapeSelectorGLSL();
    expect(glsl).toContain("sdf_instanceRegistryTestRectangle(uv, size, 1.0)");
    expect(glsl).not.toContain("v_aspectRatio");
  });
});

describe("rectangle", () => {
  test("uses its per-node inradius factor in the node fragment shader", () => {
    const glsl = generateNodeShapeSelectorGLSL([sdfRectangle()]);
    expect(glsl).toContain("context.inradiusFactor = 0.70710678 / max(v_aspectRatio, 1.0 / v_aspectRatio);");
  });

  test("registers distinct instances for distinct attribute sources", () => {
    const a = registerShapeInstance(sdfRectangle());
    const b = registerShapeInstance(sdfRectangle({ aspectRatio: { attribute: "imageRatio" } }));
    expect(a).not.toBe(b);
  });
});

describe("getStaticAttributeDefault", () => {
  const attr: AttributeSpecification = { name: "aspectRatio", size: 1, type: WebGL2RenderingContext.FLOAT };

  test("prefers the shape's declared variable default", () => {
    const shape = sdfTestRectangle();
    expect(getStaticAttributeDefault(shape, attr)).toBe("1.0");
  });

  test("falls back to the attribute's own defaultValue when the shape declares no variable", () => {
    const shape: SDFShape = { ...sdfTestRectangle(), variables: undefined };
    const attrWithDefault: AttributeSpecification = { ...attr, defaultValue: 2.5 };
    expect(getStaticAttributeDefault(shape, attrWithDefault)).toBe("2.5");
  });

  test("reads the variable keyed by the attribute's source", () => {
    const shape: SDFShape = { ...sdfTestRectangle(), variables: { imageRatio: { type: "number", default: 3 } } };
    expect(getStaticAttributeDefault(shape, { ...attr, source: "imageRatio" })).toBe("3.0");
  });

  test("falls back to 0 when neither declares a numeric default", () => {
    const shape: SDFShape = { ...sdfTestRectangle(), variables: undefined };
    expect(getStaticAttributeDefault(shape, attr)).toBe("0.0");
  });
});

describe("backdrop shaders", () => {
  test("pass a shape attribute as the per-node varying, and compile", () => {
    const { vertexShader, fragmentShader } = generateBackdropShaders({
      shapes: [sdfCircle(), sdfTestRectangle()],
      layers: [layerFill()],
      shapeGlobalIds: [0, 1],
    });
    expect(fragmentShader).toContain("sdf_instanceRegistryTestRectangle(nodeUV, 1.0, v_aspectRatio)");
    expectShadersToCompile(vertexShader, fragmentShader);
  });
});

describe("edge frame-pass vertex shader", () => {
  test("reads a_-prefixed shape attributes per node, and compiles", () => {
    const shape: SDFShape = {
      ...sdfTestRectangle(),
      attributes: [{ name: "a_aspectRatio", size: 1, type: WebGL2RenderingContext.FLOAT }],
    };
    registerShapeInstance(shape);
    const vertexShader = generateEdgeFramePassVertexShader(
      [pathLine()],
      [extremityArrow()],
      [layerPlain()],
      [shape],
      [layerFill()],
    );
    expect(vertexShader).toContain("g_aspectRatio = v_source_aspectRatio;");
    expect(vertexShader).toContain("g_aspectRatio = v_target_aspectRatio;");
    expect(vertexShader).toContain("sdf_instanceRegistryTestRectangle(uv, size, g_aspectRatio)");

    const gl = createTestGL();
    expect(compileShader(gl, gl.VERTEX_SHADER, vertexShader)).toBeNull();
  });
});

describe("end-to-end: shapes with attributes still produce compilable shaders", () => {
  test("single-shape program", () => {
    const generated = generateShaders({
      shapes: [sdfTestRectangle()],
      layers: [],
    });
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });

  test("multi-shape program (attribute-bearing shape alongside a plain one)", () => {
    const generated = generateShaders({
      shapes: [sdfCircle(), sdfTestRectangle()],
      layers: [],
      shapeGlobalIds: [0, 1],
    });
    expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
  });
});
