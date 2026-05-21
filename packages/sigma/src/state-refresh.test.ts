/**
 * Tests for the state refresh pipeline: state change → style re-evaluation → correct display data.
 *
 * These tests verify the contract that after a state change and a render frame,
 * getNodeDisplayData() and getEdgeDisplayData() return correctly computed values.
 * This is the safety net for optimizing refreshNodeState/refreshEdgeState.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { describe, expect, test } from "vitest";

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function createTestGraph(): Graph {
  const graph = new Graph();
  graph.addNode("n1", { x: 0, y: 0 });
  graph.addNode("n2", { x: 1, y: 1 });
  graph.addNode("n3", { x: 2, y: 0 });
  graph.addEdge("n1", "n2");
  graph.addEdge("n2", "n3");
  return graph;
}

function createContainer(): HTMLElement {
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  return container;
}

describe("State refresh: node display data", () => {
  test("node color updates when state changes with conditional style", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ color: "#666" }, { whenState: "isHighlighted", then: { color: "#ff0000" } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#666");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#666");

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#666");

    sigma.kill();
    container.remove();
  });

  test("node color reverts when state is reset", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ color: "#666" }, { whenState: "isHighlighted", then: { color: "#ff0000" } }],
      },
    });

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");

    sigma.setNodeState("n1", { isHighlighted: false });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#666");

    sigma.kill();
    container.remove();
  });

  test("node size updates from state-dependent style", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ size: 10 }, { whenState: "isHovered", then: { size: 20 } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(10);

    sigma.setNodeState("n1", { isHovered: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(20);

    sigma.kill();
    container.remove();
  });

  test("node visibility updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ visibility: "visible" }, { whenState: "isHidden", then: { visibility: "hidden" } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.visibility).toBe("visible");

    sigma.setNodeState("n1", { isHidden: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.visibility).toBe("hidden");

    sigma.setNodeState("n1", { isHidden: false });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.visibility).toBe("visible");

    sigma.kill();
    container.remove();
  });

  test("node label updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [
          { label: { attribute: "label", defaultValue: "default" } },
          { whenState: "isHighlighted", then: { label: "highlighted!" } },
        ],
      },
    });

    graph.setNodeAttribute("n1", "label", "Node 1");
    sigma.refresh();
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.label).toBe("Node 1");

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.label).toBe("highlighted!");

    sigma.setNodeState("n1", { isHighlighted: false });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.label).toBe("Node 1");

    sigma.kill();
    container.remove();
  });

  test("node forceLabel updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ labelVisibility: "auto" }, { whenState: "isHighlighted", then: { labelVisibility: "visible" } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.labelVisibility).toBe("auto");

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.labelVisibility).toBe("visible");

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: edge display data", () => {
  test("edge color updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        edges: [{ color: "#ccc" }, { whenState: "isHighlighted", then: { color: "#ff0000" } }],
      },
    });

    const edge = graph.edges()[0];
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.color).toBe("#ccc");

    sigma.setEdgeState(edge, { isHighlighted: true });
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.color).toBe("#ff0000");

    sigma.setEdgeState(edge, { isHighlighted: false });
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.color).toBe("#ccc");

    sigma.kill();
    container.remove();
  });

  test("edge visibility updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        edges: [{ visibility: "visible" }, { whenState: "isHidden", then: { visibility: "hidden" } }],
      },
    });

    const edge = graph.edges()[0];
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.visibility).toBe("visible");

    sigma.setEdgeState(edge, { isHidden: true });
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.visibility).toBe("hidden");

    sigma.kill();
    container.remove();
  });

  test("edge size updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        edges: [{ size: 1 }, { whenState: "isHighlighted", then: { size: 5 } }],
      },
    });

    const edge = graph.edges()[0];
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.size).toBe(1);

    sigma.setEdgeState(edge, { isHighlighted: true });
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.size).toBe(5);

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: graph state affects all items", () => {
  test("graph state change updates all nodes via function predicate", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      customNodeState: { isActive: false },
      customGraphState: { hasActiveSubgraph: false },
      styles: {
        nodes: [
          { color: "#666" },
          {
            when: (_attrs, state, graphState) => graphState.hasActiveSubgraph && !state.isActive,
            then: { color: "#e0e0e0" },
          },
          { whenState: "isActive", then: { color: "#ff0000" } },
        ],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#666");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#666");
    expect(sigma.getNodeDisplayData("n3")?.color).toBe("#666");

    // Activate subgraph: n1 is active, others should be grayed
    sigma.setNodeState("n1", { isActive: true });
    sigma.setGraphState({ hasActiveSubgraph: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#e0e0e0");
    expect(sigma.getNodeDisplayData("n3")?.color).toBe("#e0e0e0");

    // Deactivate: all nodes back to normal
    sigma.setNodeState("n1", { isActive: false });
    sigma.setGraphState({ hasActiveSubgraph: false });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#666");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#666");
    expect(sigma.getNodeDisplayData("n3")?.color).toBe("#666");

    sigma.kill();
    container.remove();
  });

  test("graph state change updates all edges via function predicate", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      customEdgeState: { isActive: false },
      customGraphState: { hasActiveSubgraph: false },
      styles: {
        edges: [
          { color: "#ccc" },
          {
            when: (_attrs, state, graphState) => graphState.hasActiveSubgraph && !state.isActive,
            then: { color: "#e0e0e0" },
          },
          { whenState: "isActive", then: { color: "#00ff00" } },
        ],
      },
    });

    const [e1, e2] = graph.edges();
    await nextFrame();
    expect(sigma.getEdgeDisplayData(e1)?.color).toBe("#ccc");
    expect(sigma.getEdgeDisplayData(e2)?.color).toBe("#ccc");

    // Activate: e1 is active, e2 should be grayed
    sigma.setEdgeState(e1, { isActive: true });
    sigma.setGraphState({ hasActiveSubgraph: true });
    await nextFrame();

    expect(sigma.getEdgeDisplayData(e1)?.color).toBe("#00ff00");
    expect(sigma.getEdgeDisplayData(e2)?.color).toBe("#e0e0e0");

    // Deactivate
    sigma.setEdgeState(e1, { isActive: false });
    sigma.setGraphState({ hasActiveSubgraph: false });
    await nextFrame();

    expect(sigma.getEdgeDisplayData(e1)?.color).toBe("#ccc");
    expect(sigma.getEdgeDisplayData(e2)?.color).toBe("#ccc");

    sigma.kill();
    container.remove();
  });

  test("switching active node updates display data correctly", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      customNodeState: { isActive: false },
      customGraphState: { hasActiveSubgraph: false },
      styles: {
        nodes: [
          { color: "#666" },
          {
            when: (_attrs, state, graphState) => graphState.hasActiveSubgraph && !state.isActive,
            then: { color: "#e0e0e0" },
          },
          { whenState: "isActive", then: { color: "#ff0000" } },
        ],
      },
    });

    // Activate n1
    sigma.setNodeState("n1", { isActive: true });
    sigma.setGraphState({ hasActiveSubgraph: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#e0e0e0");

    // Switch to n2
    sigma.setNodeState("n1", { isActive: false });
    sigma.setNodeState("n2", { isActive: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#e0e0e0");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n3")?.color).toBe("#e0e0e0");

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: depth and zIndex", () => {
  test("node depth updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ depth: "nodes" }, { whenState: "isHighlighted", then: { depth: "topNodes" } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.depth).toBe("nodes");

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.depth).toBe("topNodes");

    sigma.setNodeState("n1", { isHighlighted: false });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.depth).toBe("nodes");

    sigma.kill();
    container.remove();
  });

  test("node zIndex updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ zIndex: 0 }, { whenState: "isHighlighted", then: { zIndex: 5 } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.zIndex).toBe(0);

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.zIndex).toBe(5);

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: multiple state changes in same frame", () => {
  test("multiple node state changes coalesce correctly", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [
          { color: "#666", size: 10 },
          { whenState: "isHighlighted", then: { color: "#ff0000" } },
          { whenState: "isHovered", then: { size: 20 } },
        ],
      },
    });

    // Both changes in same frame
    sigma.setNodeState("n1", { isHighlighted: true });
    sigma.setNodeState("n1", { isHovered: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(20);

    sigma.kill();
    container.remove();
  });

  test("rapid state toggle settles on final value", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ color: "#666" }, { whenState: "isHighlighted", then: { color: "#ff0000" } }],
      },
    });

    // Toggle rapidly in same frame
    sigma.setNodeState("n1", { isHighlighted: true });
    sigma.setNodeState("n1", { isHighlighted: false });
    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: custom state properties", () => {
  test("custom node state drives style via function", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      customNodeState: { importance: 0 },
      styles: {
        nodes: {
          size: (_attrs, state) => 5 + state.importance,
          color: "#666",
        },
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(5);

    sigma.setNodeState("n1", { importance: 10 });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(15);

    sigma.setNodeState("n1", { importance: 0 });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(5);

    sigma.kill();
    container.remove();
  });

  test("custom edge state drives style", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      customEdgeState: { weight: 1 },
      styles: {
        edges: {
          size: (_attrs, state) => state.weight * 2,
          color: "#ccc",
        },
      },
    });

    const edge = graph.edges()[0];
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.size).toBe(2);

    sigma.setEdgeState(edge, { weight: 5 });
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.size).toBe(10);

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: match/cases styles unaffected by state changes", () => {
  test("match/cases style persists through state changes", async () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, type: "person" });
    graph.addNode("n2", { x: 1, y: 1, type: "company" });
    graph.addEdge("n1", "n2");

    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [
          { size: 10 },
          { matchData: "type", cases: { person: { color: "#0000ff" }, company: { color: "#00ff00" } } },
          { whenState: "isHighlighted", then: { size: 20 } },
        ],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#0000ff");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#00ff00");
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(10);

    // State change should NOT affect match/cases colors
    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#0000ff");
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(20);
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#00ff00");
    expect(sigma.getNodeDisplayData("n2")?.size).toBe(10);

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: opacity", () => {
  test("node opacity updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ opacity: 1 }, { whenState: "isHighlighted", then: { opacity: 0.3 } }],
      },
    });

    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.opacity).toBe(1);

    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.opacity).toBe(0.3);

    sigma.setNodeState("n1", { isHighlighted: false });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.opacity).toBe(1);

    sigma.kill();
    container.remove();
  });

  test("edge opacity updates from state change", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        edges: [{ opacity: 1 }, { whenState: "isHighlighted", then: { opacity: 0.2 } }],
      },
    });

    const edge = graph.edges()[0];
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.opacity).toBe(1);

    sigma.setEdgeState(edge, { isHighlighted: true });
    await nextFrame();
    expect(sigma.getEdgeDisplayData(edge)?.opacity).toBe(0.2);

    sigma.kill();
    container.remove();
  });
});

describe("State refresh: setNodesState and setEdgesState batch updates", () => {
  test("batch node state update produces correct display data", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        nodes: [{ color: "#666" }, { whenState: "isHighlighted", then: { color: "#ff0000" } }],
      },
    });

    sigma.setNodesState(["n1", "n2"], { isHighlighted: true });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n3")?.color).toBe("#666");

    sigma.kill();
    container.remove();
  });

  test("batch edge state update produces correct display data", async () => {
    const graph = createTestGraph();
    const container = createContainer();
    const sigma = new Sigma(graph, container, {
      styles: {
        edges: [{ color: "#ccc" }, { whenState: "isHighlighted", then: { color: "#ff0000" } }],
      },
    });

    const edges = graph.edges();
    sigma.setEdgesState(edges, { isHighlighted: true });
    await nextFrame();

    expect(sigma.getEdgeDisplayData(edges[0])?.color).toBe("#ff0000");
    expect(sigma.getEdgeDisplayData(edges[1])?.color).toBe("#ff0000");

    sigma.kill();
    container.remove();
  });
});
