/**
 * Type tests for Sigma.js primitives WITHOUT satellite package imports.
 *
 * These tests verify that the primitives system works correctly with
 * only built-in factory functions, without satellite packages.
 *
 * Run with: npx vitest typecheck
 */
import { layerFill, layerPlain, pathLine, sdfCircle } from "sigma/rendering";
import { defineSigmaOptions } from "sigma/types";
import { describe, test } from "vitest";

// NOTE: We intentionally DO NOT import satellite packages here.

// =============================================================================
// TYPE TESTS: Built-in primitives work without satellite imports
// =============================================================================

describe("Without satellite imports", () => {
  test("built-in factory functions work", () => {
    // This should compile without errors
    defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          layers: [layerFill()],
        },
        edges: {
          paths: [pathLine()],
          layers: [layerPlain()],
        },
      },
      styles: {
        nodes: {
          color: "#666",
          size: 10,
        },
      },
    });
  });
});
