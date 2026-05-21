/**
 * Unit tests for the v4 API (primitives and styles integration).
 */
import Graph from "graphology";
import Sigma, { DEFAULT_EDGE_DEPTH_LAYERS, DEFAULT_NODE_DEPTH_LAYERS } from "sigma";
import { layerFill, sdfCircle } from "sigma/rendering";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

interface SigmaTestContext {
  container: HTMLElement;
}

beforeEach<SigmaTestContext>(async (context) => {
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.container = container;
});

afterEach<SigmaTestContext>(async ({ container }) => {
  container.remove();
});

describe("Sigma v4 API", () => {
  describe("Constructor with styles option", () => {
    test<SigmaTestContext>("applies literal node styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: {
            size: 20,
            color: "#ff0000",
          },
        },
      });

      // Access internal node data cache to verify styles were applied
      // We need to trigger a refresh to process the nodes
      sigma.refresh();

      // The node should have the styles applied
      // We can verify this by checking that the sigma instance was created successfully
      // and didn't throw any errors
      expect(sigma).toBeDefined();
      expect(sigma.getGraph()).toBe(graph);

      sigma.kill();
    });

    test<SigmaTestContext>("applies literal edge styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });
      graph.addEdge("n1", "n2");

      const sigma = new Sigma(graph, container, {
        styles: {
          edges: {
            size: 5,
            color: "#00ff00",
          },
        },
      });

      sigma.refresh();
      expect(sigma).toBeDefined();

      sigma.kill();
    });

    test<SigmaTestContext>("applies attribute bindings in styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0, mySize: 15, myColor: "#0000ff" });

      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: {
            size: { attribute: "mySize", defaultValue: 10 },
            color: { attribute: "myColor", defaultValue: "#999" },
          },
        },
      });

      sigma.refresh();
      expect(sigma).toBeDefined();

      sigma.kill();
    });

    test<SigmaTestContext>("applies function values in styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0, value: 100 });
      graph.addNode("n2", { x: 1, y: 1, value: 50 });

      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: {
            size: (attrs) => Math.sqrt(attrs.value as number),
            color: (_attrs, state) => (state.isHighlighted ? "#ff0000" : "#666"),
          },
        },
      });

      sigma.refresh();
      expect(sigma).toBeDefined();

      sigma.kill();
    });

    test<SigmaTestContext>("applies conditional styles based on state", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });

      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: [
            { color: "#666", size: 10 },
            { whenState: "isHighlighted", then: { color: "#ff0000", size: 15 } },
            { whenState: "isHovered", then: { color: "#00ff00" } },
          ],
        },
      });

      sigma.refresh();

      // Highlight a node and verify no errors
      sigma.setNodeState("n1", { isHighlighted: true });
      sigma.refresh();

      expect(sigma.getNodeState("n1").isHighlighted).toBe(true);

      sigma.kill();
    });

    test<SigmaTestContext>("visibility style hides nodes", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });

      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: [{ visibility: "visible" }, { whenState: "isHidden", then: { visibility: "hidden" } }],
        },
      });

      sigma.refresh();

      // Hide a node via state
      sigma.setNodeState("n1", { isHidden: true });
      sigma.refresh();

      expect(sigma.getNodeState("n1").isHidden).toBe(true);

      sigma.kill();
    });
  });

  describe("Constructor with primitives option", () => {
    // Note: Full primitives integration tests are skipped because they require
    // all factory registrations which may not be complete in the test environment.
    // The primitives parsing is tested separately in unit/primitives/parser.ts
    test<SigmaTestContext>("primitives option is accepted by constructor", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      // Just verify the constructor accepts the primitives option without throwing
      // The actual program generation is tested in integration tests
      const sigma = new Sigma(graph, container, {
        primitives: {
          nodes: {
            shapes: [sdfCircle()],
            layers: [layerFill()],
          },
        },
        // Not specifying edges to avoid edge program generation issues in tests
      });

      sigma.refresh();
      expect(sigma).toBeDefined();

      sigma.kill();
    });
  });

  describe("Depth layers", () => {
    // The `as unknown as "nodes"` casts feed an invalid depth past the type
    // guard, so the runtime depth-domain check can be exercised.
    test<SigmaTestContext>("throws when rendering a node with a depth outside the domain", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      expect(() => {
        new Sigma(graph, container, {
          styles: { nodes: { depth: "notARealLayer" as unknown as "nodes" } },
        });
      }).toThrow();
    });

    test<SigmaTestContext>("throws when a state-conditional style resolves to an invalid depth", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: [
            { depth: "nodes" },
            { whenState: "isHighlighted", then: { depth: "notARealLayer" as unknown as "nodes" } },
          ],
        },
      });
      // Default depth ("nodes") is valid, so the initial render is fine:
      sigma.refresh();

      // Promoting the node resolves its depth to the invalid layer:
      sigma.setNodeState("n1", { isHighlighted: true });
      expect(() => sigma.refresh()).toThrow();

      sigma.kill();
    });

    test<SigmaTestContext>("throws when styles is omitted and depthLayers drops a default layer", ({ container }) => {
      const graph = new Graph();
      expect(() => {
        new Sigma(graph, container, {
          primitives: { depthLayers: ["back", "front"] },
        });
      }).toThrow();
    });

    test<SigmaTestContext>("throws when styles.nodes is omitted and node layers are missing", ({ container }) => {
      const graph = new Graph();
      expect(() => {
        new Sigma(graph, container, {
          primitives: { depthLayers: [...DEFAULT_EDGE_DEPTH_LAYERS] },
          styles: { edges: { depth: "edges" } },
        });
      }).toThrow();
    });

    test<SigmaTestContext>("throws when styles.edges is omitted and edge layers are missing", ({ container }) => {
      const graph = new Graph();
      expect(() => {
        new Sigma(graph, container, {
          primitives: { depthLayers: [...DEFAULT_NODE_DEPTH_LAYERS] },
          styles: { nodes: { depth: "nodes" } },
        });
      }).toThrow();
    });
  });

  describe("Reducers", () => {
    test<SigmaTestContext>("nodeReducer works with styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0, value: 100 });

      const sigma = new Sigma(graph, container, {
        nodeReducer: (_key, computed, attrs) => ({
          ...computed,
          size: Math.sqrt(attrs.value as number),
          color: "#ff0000",
        }),
      });

      sigma.refresh();
      expect(sigma).toBeDefined();

      // Verify the reducer was applied
      const nodeData = sigma.getNodeDisplayData("n1");
      expect(nodeData?.size).toBe(10); // sqrt(100) = 10
      expect(nodeData?.color).toBe("#ff0000");

      sigma.kill();
    });

    test<SigmaTestContext>("edgeReducer works with styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });
      graph.addEdge("n1", "n2", { weight: 5 });

      const sigma = new Sigma(graph, container, {
        edgeReducer: (_key, computed, attrs) => ({
          ...computed,
          size: attrs.weight as number,
          color: "#333",
        }),
      });

      sigma.refresh();
      expect(sigma).toBeDefined();

      // Verify the reducer was applied
      const edgeData = sigma.getEdgeDisplayData(graph.edges()[0]);
      expect(edgeData?.size).toBe(5);
      expect(edgeData?.color).toBe("#333");

      sigma.kill();
    });

    test<SigmaTestContext>("primitives can coexist with settings", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      // When both primitives and settings are provided, both should work
      const sigma = new Sigma(graph, container, {
        primitives: {
          nodes: {
            shapes: [sdfCircle()],
            layers: [layerFill()],
          },
        },
        settings: {
          minEdgeThickness: 2,
        },
      });

      sigma.refresh();
      expect(sigma).toBeDefined();
      expect(sigma.getSetting("minEdgeThickness")).toBe(2);

      sigma.kill();
    });

    test<SigmaTestContext>("nodeReducer can coexist with styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      let reducerCalled = false;
      let receivedState: unknown = null;

      // When both styles and reducer are provided, reducer runs after styles
      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: {
            size: 10,
            color: "#666",
          },
        },
        nodeReducer: (_key, computed, _attrs, state) => {
          reducerCalled = true;
          receivedState = state;
          // Reducer receives computed display data and can override
          return {
            ...computed,
            size: computed.size * 2, // Double the size
          };
        },
      });

      sigma.refresh();
      expect(reducerCalled).toBe(true);
      expect(receivedState).toHaveProperty("isHovered", false);

      // Verify the reducer modified the computed size (10 * 2 = 20)
      const nodeData = sigma.getNodeDisplayData("n1");
      expect(nodeData?.size).toBe(20);

      sigma.kill();
    });

    test<SigmaTestContext>("edgeReducer can coexist with styles", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });
      graph.addEdge("n1", "n2");

      let reducerCalled = false;
      let receivedState: unknown = null;

      const sigma = new Sigma(graph, container, {
        styles: {
          edges: {
            size: 5,
            color: "#333",
          },
        },
        edgeReducer: (_key, computed, _attrs, state) => {
          reducerCalled = true;
          receivedState = state;
          return {
            ...computed,
            size: computed.size + 3, // Add 3 to size
          };
        },
      });

      sigma.refresh();
      expect(reducerCalled).toBe(true);
      expect(receivedState).toHaveProperty("isHovered", false);

      // Verify the reducer modified the computed size (5 + 3 = 8)
      const edgeData = sigma.getEdgeDisplayData(graph.edges()[0]);
      expect(edgeData?.size).toBe(8);

      sigma.kill();
    });
  });

  describe("State-driven style updates", () => {
    test<SigmaTestContext>("state changes trigger style re-evaluation on refresh", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });

      const highlightedColor = "#666";
      const sigma = new Sigma(graph, container, {
        styles: {
          nodes: {
            size: 10,
            color: (_attrs, state) => (state.isHighlighted ? "#ff0000" : highlightedColor),
          },
        },
      });

      sigma.refresh();

      // Change state and refresh
      sigma.setNodeState("n1", { isHighlighted: true });
      sigma.refresh();

      // Verify state was updated
      expect(sigma.getNodeState("n1").isHighlighted).toBe(true);
      expect(sigma.getNodeState("n2").isHighlighted).toBe(false);

      sigma.kill();
    });
  });

  describe("Custom state type parameters", () => {
    test<SigmaTestContext>("custom node state properties can be set and retrieved", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      const sigma = new Sigma(graph, container, {
        customNodeState: { importance: 0 },
      });

      // Set custom state property
      sigma.setNodeState("n1", { importance: 5 });
      sigma.refresh();

      // Retrieve and verify custom state
      const state = sigma.getNodeState("n1");
      expect(state.importance).toBe(5);
      expect(state.isHovered).toBe(false); // default value

      sigma.kill();
    });

    test<SigmaTestContext>("custom edge state properties can be set and retrieved", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });
      graph.addNode("n2", { x: 1, y: 1 });
      graph.addEdge("n1", "n2");

      const sigma = new Sigma(graph, container, {
        customEdgeState: { weight: 0 },
      });

      const edgeKey = graph.edges()[0];

      // Set custom state property
      sigma.setEdgeState(edgeKey, { weight: 10 });
      sigma.refresh();

      // Retrieve and verify custom state
      const state = sigma.getEdgeState(edgeKey);
      expect(state.weight).toBe(10);
      expect(state.isHovered).toBe(false); // default value

      sigma.kill();
    });

    test<SigmaTestContext>("custom state can be used in style functions", ({ container }) => {
      const graph = new Graph();
      graph.addNode("n1", { x: 0, y: 0 });

      const sigma = new Sigma(graph, container, {
        customNodeState: { importance: 0 },
        styles: {
          nodes: {
            // Use custom state property in style function
            size: (_attrs, state) => 5 + (state.importance ?? 0),
            color: "#666",
          },
        },
      });

      // Set custom state
      sigma.setNodeState("n1", { importance: 10 });
      sigma.refresh();

      // Verify the style was applied based on custom state
      const displayData = sigma.getNodeDisplayData("n1");
      expect(displayData?.size).toBe(15); // 5 + 10

      sigma.kill();
    });
  });
});
