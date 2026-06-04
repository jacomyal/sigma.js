/**
 * Unit tests for composed node program shader generation.
 * These tests verify that generated shaders compile correctly.
 */
import { generateShaders, layerFill, sdfCircle, sdfDiamond, sdfSquare, sdfTriangle } from "sigma/rendering";
import { describe, expect, test } from "vitest";

import { expectShadersToCompile } from "../_test-helpers";

describe("Composed node program shader generation", () => {
  describe("Circle shape", () => {
    test("generates compilable shaders with fill layer", () => {
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });
  });

  describe("Square shape", () => {
    test("generates compilable shaders with default options", () => {
      const generated = generateShaders({
        shapes: [sdfSquare()],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with cornerRadius", () => {
      const generated = generateShaders({
        shapes: [sdfSquare({ cornerRadius: 0.2 })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with rotation", () => {
      const generated = generateShaders({
        shapes: [sdfSquare({ rotation: Math.PI / 4 })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with both options", () => {
      const generated = generateShaders({
        shapes: [sdfSquare({ cornerRadius: 0.1, rotation: Math.PI / 6 })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });
  });

  describe("Triangle shape", () => {
    test("generates compilable shaders with default options", () => {
      const generated = generateShaders({
        shapes: [sdfTriangle()],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with cornerRadius", () => {
      const generated = generateShaders({
        shapes: [sdfTriangle({ cornerRadius: 0.1 })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with rotation", () => {
      const generated = generateShaders({
        shapes: [sdfTriangle({ rotation: Math.PI })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });
  });

  describe("Diamond shape", () => {
    test("generates compilable shaders with default options", () => {
      const generated = generateShaders({
        shapes: [sdfDiamond()],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with cornerRadius", () => {
      const generated = generateShaders({
        shapes: [sdfDiamond({ cornerRadius: 0.15 })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("generates compilable shaders with rotation", () => {
      const generated = generateShaders({
        shapes: [sdfDiamond({ rotation: Math.PI / 4 })],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });
  });

  describe("Shader metadata", () => {
    test("collects correct uniforms for circle + fill", () => {
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [layerFill()],
      });

      expect(generated.uniforms).toContain("u_matrix");
      expect(generated.uniforms).toContain("u_sizeRatio");
      expect(generated.uniforms).toContain("u_correctionRatio");
    });

    test("collects shape-specific uniforms for square", () => {
      const generated = generateShaders({
        shapes: [sdfSquare({ cornerRadius: 0.2, rotation: Math.PI / 4 })],
        layers: [layerFill()],
      });

      expect(generated.uniforms).toContain("u_cornerRadius");
      expect(generated.uniforms).toContain("u_rotation");
    });

    test("collects standard attributes", () => {
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [layerFill()],
      });

      // New architecture: position, size, color are fetched from textures
      // Only nodeIndex (for texture lookup) and id (for picking) remain in buffer
      const attrNames = generated.attributes.map((a) => a.name);
      expect(attrNames).toContain("a_nodeIndex");
      expect(attrNames).toContain("a_id");
    });
  });

  describe("Edge cases", () => {
    test("handles no layers gracefully", () => {
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });

    test("handles multiple layers (when available)", () => {
      // For now we only have layerFill, but this tests the composition logic
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
    });
  });

  describe("per-node rotation alignment", () => {
    test("vertex applies the camera counter-rotation scaled by the per-node flag", () => {
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [layerFill()],
      });

      expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
      // Rotation is data-driven: the angle scales by (1 - nodeRotation) so both
      // viewport (0) and graph (1) alignment fall out of one code path.
      expect(generated.vertexShader).toContain("1.0 - nodeRotation");
      expect(generated.vertexShader).toContain("u_cameraAngle");
    });

    test("includes u_cameraAngle uniform", () => {
      const generated = generateShaders({
        shapes: [sdfCircle()],
        layers: [layerFill()],
      });

      expect(generated.uniforms).toContain("u_cameraAngle");
    });

    test("works with all shapes", () => {
      const allShapes = [sdfCircle(), sdfSquare(), sdfTriangle(), sdfDiamond()];

      for (const shape of allShapes) {
        const generated = generateShaders({
          shapes: [shape],
          layers: [layerFill()],
        });

        expectShadersToCompile(generated.vertexShader, generated.fragmentShader);
      }
    });
  });
});
