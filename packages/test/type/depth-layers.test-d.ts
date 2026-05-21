/**
 * Type tests for Sigma.js v4 depth layers.
 *
 * These verify that `depth` style values are constrained, at compile time, to
 * the active depth domain: the default depth layers, or a custom set declared
 * through `primitives.depthLayers`.
 *
 * NOTE: Type test files (*.test-d.ts) are statically analyzed only - they don't execute.
 * Run with: npx vitest typecheck
 */
import Graph from "graphology";
import Sigma from "sigma";
import { DEFAULT_STYLES } from "sigma/types";
import { describe, test } from "vitest";

const graph = new Graph();
const container = document.createElement("div");

describe("Depth layer type safety", () => {
  test("depth is constrained to the default depth domain", () => {
    // A default depth layer is accepted:
    new Sigma(graph, container, {
      styles: { nodes: { depth: "topNodes" } },
    });

    new Sigma(graph, container, {
      styles: {
        // @ts-expect-error - "notARealLayer" is not one of the default depth layers
        nodes: { depth: "notARealLayer" },
      },
    });
  });

  test("depth is constrained to a custom depthLayers domain", () => {
    // A layer declared in depthLayers is accepted:
    new Sigma(graph, container, {
      primitives: { depthLayers: ["back", "front"] },
      styles: { nodes: { depth: "front" } },
    });

    new Sigma(graph, container, {
      primitives: { depthLayers: ["back", "front"] },
      styles: {
        // @ts-expect-error - "nodes" is not part of the custom depthLayers
        nodes: { depth: "nodes" },
      },
    });
  });

  test("DEFAULT_STYLES rules splice into a depth-typed styles array", () => {
    new Sigma(graph, container, {
      styles: {
        nodes: [DEFAULT_STYLES.nodes, { color: "#666" }],
        edges: [DEFAULT_STYLES.edges, { color: "#ccc" }],
      },
    });

    new Sigma(graph, container, {
      primitives: {
        depthLayers: ["edges", "topEdges", "nodes", "topNodes", "selectedItems"],
      },
      styles: {
        nodes: [DEFAULT_STYLES.nodes, { color: "#666" }],
        edges: [DEFAULT_STYLES.edges, { color: "#ccc" }],
      },
    });
  });

  test("DEFAULT_STYLES is not usable when the default depth layers are no longer present", () => {
    new Sigma(graph, container, {
      primitives: {
        depthLayers: ["back", "front"],
      },
      styles: {
        // @ts-expect-error - the depth layers in DEFAULT_STYLES.nodes are missing from the given layers
        nodes: [DEFAULT_STYLES.nodes, { color: "#666" }],
        // @ts-expect-error - the depth layers in DEFAULT_STYLES.edges are missing from the given layers
        edges: [DEFAULT_STYLES.edges, { color: "#ccc" }],
      },
    });
  });
});
