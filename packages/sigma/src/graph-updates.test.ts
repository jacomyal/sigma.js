/**
 * Tests for how sigma reacts to graphology structural updates, after it is mounted.
 */
import Graph, { MultiGraph } from "graphology";
import Sigma, { DEFAULT_STYLES } from "sigma";
import { pathCurved, pathLine } from "sigma/rendering";
import { Coordinates, SigmaOptions } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, describe, expect, test, vi } from "vitest";

import { findPickingPosition, hoverNode } from "./_test-helpers";

const instances: Sigma[] = [];

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function mount(graph: Graph, options: SigmaOptions = {}): Sigma {
  const container = createElement("div", { width: "200px", height: "200px" });
  document.body.append(container);
  const sigma = new Sigma(graph, container, options);
  instances.push(sigma);
  return sigma;
}

function createTestGraph(): Graph {
  const graph = new Graph();
  graph.addNode("n1", { x: 0, y: 0, label: "Node 1" });
  graph.addNode("n2", { x: 100, y: 100, label: "Node 2" });
  graph.addNode("n3", { x: 200, y: 0, label: "Node 3" });
  graph.addEdgeWithKey("e12", "n1", "n2");
  graph.addEdgeWithKey("e23", "n2", "n3");
  return graph;
}

function expectPickableAtPosition(sigma: Sigma, node: string): void {
  const expected = sigma.graphToViewport(sigma.getGraph().getNodeAttributes(node) as Coordinates);
  const actual = findPickingPosition(sigma, "node", node);
  expect(actual).not.toBeNull();
  expect(actual!.x).toBeCloseTo(expected.x, -1);
  expect(actual!.y).toBeCloseTo(expected.y, -1);
}

afterEach(() => {
  for (const sigma of instances.splice(0)) {
    sigma.getContainer().remove();
    sigma.kill();
  }
});

describe("Adding items", () => {
  test("an added node gets display data from the styles", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();

    graph.addNode("n4", { x: 100, y: 0, color: "#ff0000" });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n4")).toMatchObject({ color: "#ff0000" });
  });

  test("an added node is pickable at its position", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();

    graph.addNode("n4", { x: 100, y: 0 });
    await nextFrame();

    expectPickableAtPosition(sigma, "n4");
  });

  test("an added edge gets display data from the styles", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();

    graph.addEdgeWithKey("e13", "n1", "n3", { color: "#ff0000" });
    await nextFrame();

    expect(sigma.getEdgeDisplayData("e13")).toMatchObject({ color: "#ff0000" });
  });

  test("importing into a displayed graph adds the new items", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();

    graph.import({
      nodes: [{ key: "n4", attributes: { x: 300, y: 300 } }],
      edges: [{ key: "e34", source: "n3", target: "n4" }],
    });
    await nextFrame();

    expect(sigma.getNodeDisplayData("n4")).toBeDefined();
    expect(sigma.getEdgeDisplayData("e34")).toBeDefined();
    expect(sigma.getNodeDisplayData("n1")).toBeDefined();
  });

  test("an added node outside the graph extends the bounding box", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph, { settings: { autoRescaleContent: "positions" } });
    await nextFrame();

    graph.addNode("far", { x: 1000, y: 0 });
    await nextFrame();

    expect(sigma.getBBox().x[1]).toBe(1000);
  });

  test("adding an edge updates a degree-based reducer on its extremities", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph, { nodeReducer: (key, data) => ({ ...data, size: graph.degree(key) * 5 }) });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n1")?.size).toBe(5);

    graph.addEdgeWithKey("e13", "n1", "n3");
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")?.size).toBe(10);
  });
});

describe("Dropping items", () => {
  test("dropping a node removes it and its edges from the display data", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getNodeDisplayData("n1")).toBeUndefined();
    expect(sigma.getEdgeDisplayData("e12")).toBeUndefined();
    expect(sigma.getNodeDisplayData("n2")).toBeDefined();
    expect(sigma.getNodeDisplayData("n3")).toBeDefined();
    expect(sigma.getEdgeDisplayData("e23")).toBeDefined();
  });

  test("a dropped node is no longer pickable", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    expect(findPickingPosition(sigma, "node", "n1")).not.toBeNull();

    graph.dropNode("n1");
    await nextFrame();

    expect(findPickingPosition(sigma, "node", "n1")).toBeNull();
  });

  test("remaining nodes are still pickable at their position after a drop", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();

    graph.dropNode("n1");
    await nextFrame();

    expectPickableAtPosition(sigma, "n2");
    expectPickableAtPosition(sigma, "n3");
  });

  test("dropping a node with a forced label removes its label", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph, { styles: { nodes: [DEFAULT_STYLES.nodes, { labelVisibility: "visible" }] } });
    await nextFrame();
    expect(sigma.getNodeDisplayedLabels().has("n1")).toBe(true);

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getNodeDisplayedLabels().has("n1")).toBe(false);
  });

  test("dropping a node outside the graph shrinks the bounding box", async () => {
    const graph = createTestGraph();
    graph.addNode("far", { x: 1000, y: 0 });
    const sigma = mount(graph, { settings: { autoRescaleContent: "positions" } });
    await nextFrame();
    expect(sigma.getBBox().x[1]).toBe(1000);

    graph.dropNode("far");
    await nextFrame();

    expect(sigma.getBBox().x[1]).toBe(200);
  });

  test("dropping an edge updates a degree-based reducer on its extremities", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph, { nodeReducer: (key, data) => ({ ...data, size: graph.degree(key) * 5 }) });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n2")?.size).toBe(10);

    graph.dropEdge("e12");
    await nextFrame();

    expect(sigma.getNodeDisplayData("n2")?.size).toBe(5);
  });
});

describe("Parallel edges", () => {
  function mountMulti(graph: MultiGraph): Sigma {
    return mount(graph, {
      primitives: { edges: { paths: [pathLine(), pathCurved()] } },
      styles: { nodes: DEFAULT_STYLES.nodes, edges: [DEFAULT_STYLES.edges, { parallelPath: "curved" }] },
    });
  }

  test("adding a parallel edge curves both edges", async () => {
    const graph = new MultiGraph();
    graph.addNode("n1", { x: 0, y: 0 });
    graph.addNode("n2", { x: 100, y: 100 });
    graph.addEdgeWithKey("e1", "n1", "n2");
    const sigma = mountMulti(graph);
    await nextFrame();
    expect(sigma.getEdgeDisplayData("e1")).toMatchObject({ curvature: 0 });

    graph.addEdgeWithKey("e2", "n1", "n2");
    await nextFrame();

    // Default parallelSpread is 0.25, so the two edges sit at +/- 0.125
    expect(sigma.getEdgeDisplayData("e1")).toMatchObject({ curvature: -0.125 });
    expect(sigma.getEdgeDisplayData("e2")).toMatchObject({ curvature: 0.125 });
  });

  test("dropping a parallel edge straightens the remaining one", async () => {
    const graph = new MultiGraph();
    graph.addNode("n1", { x: 0, y: 0 });
    graph.addNode("n2", { x: 100, y: 100 });
    graph.addEdgeWithKey("e1", "n1", "n2");
    graph.addEdgeWithKey("e2", "n1", "n2");
    const sigma = mountMulti(graph);
    await nextFrame();
    expect(sigma.getEdgeDisplayData("e1")).not.toMatchObject({ curvature: 0 });

    graph.dropEdge("e2");
    await nextFrame();

    expect(sigma.getEdgeDisplayData("e1")).toMatchObject({ curvature: 0 });
  });
});

describe("Graph state after removals", () => {
  test("dropping the only highlighted node clears hasHighlighted", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    sigma.setNodeState("n1", { isHighlighted: true });
    expect(sigma.getGraphState().hasHighlighted).toBe(true);

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getGraphState().hasHighlighted).toBe(false);
  });

  test("dropping one of several highlighted nodes keeps hasHighlighted", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    sigma.setNodesState(["n1", "n2"], { isHighlighted: true });
    expect(sigma.getGraphState().hasHighlighted).toBe(true);

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getGraphState().hasHighlighted).toBe(true);
  });

  test("dropping the dragged node clears isDragging", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    sigma.setNodeState("n1", { isDragged: true });
    expect(sigma.getGraphState().isDragging).toBe(true);

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getGraphState().isDragging).toBe(false);
  });

  test("dropping the hovered node clears hasHovered", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    await hoverNode(sigma, "n1");
    expect(sigma.getGraphState().hasHovered).toBe(true);

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getGraphState().hasHovered).toBe(false);
  });

  test("dropping the hovered edge clears hasHovered", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    sigma.setEdgeState("e12", { isHovered: true });
    expect(sigma.getGraphState().hasHovered).toBe(true);

    graph.dropEdge("e12");
    await nextFrame();

    expect(sigma.getGraphState().hasHovered).toBe(false);
  });

  test("clearing the graph clears hasHovered", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    await hoverNode(sigma, "n1");
    expect(sigma.getGraphState().hasHovered).toBe(true);

    graph.clear();

    await vi.waitFor(() => expect(sigma.getGraphState().hasHovered).toBe(false), { timeout: 5000 });
  });

  test("styles depending on the graph state update when the highlighted node is dropped", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph, {
      styles: {
        nodes: [
          DEFAULT_STYLES.nodes,
          { color: "#666" },
          {
            when: (_attrs, state, graphState) => graphState.hasHighlighted && !state.isHighlighted,
            then: { color: "#e0e0e0" },
          },
        ],
      },
    });
    await nextFrame();
    sigma.setNodeState("n1", { isHighlighted: true });
    await nextFrame();
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#e0e0e0");

    graph.dropNode("n1");
    await nextFrame();

    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#666");
  });
});

describe("Stale hover reads (regression)", () => {
  test("a hover read resolving after graph.clear() does not hover the removed node", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    await hoverNode(sigma, "n1");

    const internals = sigma["internals"];
    const resolver = internals.hoverResolver;
    const staleId = internals.pickingState.idsByKind.node.get("n1")!;
    const lastEvent = resolver["lastEvent"]!;

    graph.clear();
    // Simulates an async picking read landing before the next render.
    resolver["options"].onIndex(staleId, lastEvent);

    expect(sigma.getNodeState("n1").isHovered).toBe(false);
    expect(sigma.getGraphState().hasHovered).toBe(false);
    expect(() => sigma.refresh()).not.toThrow();
  });

  test("a hover read resolving after a drop and re-add does not hover the new node", async () => {
    const graph = createTestGraph();
    const sigma = mount(graph);
    await nextFrame();
    await hoverNode(sigma, "n1");

    const internals = sigma["internals"];
    const resolver = internals.hoverResolver;
    const staleId = internals.pickingState.idsByKind.node.get("n1")!;
    const lastEvent = resolver["lastEvent"]!;

    graph.dropNode("n1");
    graph.addNode("n1", { x: 200, y: 200 });

    // Simulates an async picking read landing before the next render.
    resolver["options"].onIndex(staleId, lastEvent);

    expect(sigma.getNodeState("n1").isHovered).toBe(false);
    expect(sigma.getGraphState().hasHovered).toBe(false);
  });
});

describe("Batch drops (regression #1516)", () => {
  test("dropping nodes does not re-evaluate every remaining node", async () => {
    const graph = new Graph();
    for (let i = 0; i < 100; i++) graph.addNode(`n${i}`, { x: i * 100, y: 0 });

    let calls = 0;
    const sigma = mount(graph, {
      nodeReducer: (_key, data) => {
        calls++;
        return data;
      },
    });
    let processes = 0;
    let renders = 0;
    sigma.on("beforeProcess", () => processes++);
    sigma.on("beforeRender", () => renders++);
    await nextFrame();

    calls = processes = renders = 0;
    for (let i = 0; i < 10; i++) graph.dropNode(`n${i}`);
    expect(processes).toBe(0);
    expect(renders).toBe(0);

    await nextFrame();
    expect(calls).toBe(0);
    expect(processes).toBe(1);
    expect(renders).toBe(1);
  });

  test("dropping edges does not re-evaluate every remaining edge", async () => {
    const graph = new Graph();
    for (let i = 0; i < 101; i++) graph.addNode(`n${i}`, { x: i * 100, y: 0 });
    for (let i = 0; i < 100; i++) graph.addEdgeWithKey(`e${i}`, `n${i}`, `n${i + 1}`);

    let calls = 0;
    const sigma = mount(graph, {
      edgeReducer: (_key, data) => {
        calls++;
        return data;
      },
    });
    let processes = 0;
    let renders = 0;
    sigma.on("beforeProcess", () => processes++);
    sigma.on("beforeRender", () => renders++);
    await nextFrame();

    calls = processes = renders = 0;
    for (let i = 0; i < 10; i++) graph.dropEdge(`e${i}`);
    expect(processes).toBe(0);
    expect(renders).toBe(0);

    await nextFrame();
    expect(calls).toBe(0);
    expect(processes).toBe(1);
    expect(renders).toBe(1);
  });
});
