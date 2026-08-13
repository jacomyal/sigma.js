import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, describe, expect, test } from "vitest";

import { simulateMouseEvent, wait } from "./_test-helpers";

const STAGE_WIDTH = 300;
const STAGE_HEIGHT = 600;

/**
 * `n1` and `e1` are declared first, so they are the first items allocated in
 * their data textures and end up at row 0 — the row a zeroed-out vertex buffer
 * slot points at. `n3` / `e2` are the items the tests hide.
 */
const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
  nodes: [
    { key: "n1", attributes: { x: 0, y: 0, size: 10, color: "blue" } },
    { key: "n2", attributes: { x: 50, y: 50, size: 10, color: "red" } },
    { key: "n3", attributes: { x: 50, y: 0, size: 10, color: "green" } },
  ],
  edges: [
    { key: "e1", source: "n1", target: "n2", attributes: { size: 10 } },
    { key: "e2", source: "n1", target: "n3", attributes: { size: 10 } },
  ],
};

let instances: Sigma[] = [];

function mount({ hiddenNode, hiddenEdge }: { hiddenNode?: string; hiddenEdge?: string } = {}) {
  const graph = new Graph();
  graph.import(GRAPH);
  const container = createElement("div", {
    width: `${STAGE_WIDTH}px`,
    height: `${STAGE_HEIGHT}px`,
  }) as HTMLDivElement;
  document.body.append(container);

  // Reducers are constructor options, not settings:
  const sigma = new Sigma(graph, container, {
    settings: { enableEdgeEvents: true },
    nodeReducer: hiddenNode ? (node, data) => (node === hiddenNode ? { ...data, visibility: "hidden" } : data) : undefined,
    edgeReducer: hiddenEdge ? (edge, data) => (edge === hiddenEdge ? { ...data, visibility: "hidden" } : data) : undefined,
  });
  instances.push(sigma);

  return { sigma, graph, container };
}

/** Viewport position of `n1`, which owns node-data-texture row 0. */
function rowZeroNodePosition(sigma: Sigma, graph: Graph): Coordinates {
  return sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
}

/** Viewport position of the middle of `e1`, which owns edge-data-texture row 0. */
function rowZeroEdgePosition(sigma: Sigma, graph: Graph): Coordinates {
  const n1 = graph.getNodeAttributes("n1") as Coordinates;
  const n2 = graph.getNodeAttributes("n2") as Coordinates;
  return sigma.graphToViewport({ x: (n1.x + n2.x) / 2, y: (n1.y + n2.y) / 2 });
}

afterEach(() => {
  instances.forEach((sigma) => {
    sigma.kill();
    sigma.getContainer().remove();
  });
  instances = [];
});

/**
 * Regression tests: hiding *any* item used to break the item at texture row 0.
 *
 * A hidden item's vertex buffer slot is zeroed out, which leaves
 * `a_nodeIndex` / `a_edgeIndex` at 0 and `a_id` at 0. Row 0 is a valid item, so
 * the hidden instance was drawn using item 0's geometry and attributes, and —
 * because the picking pass runs with blending disabled — its `a_id = 0`
 * overwrote item 0's real picking ID. Item 0 therefore became impossible to
 * hover or click even though it was perfectly visible.
 */
describe("Hidden items", () => {
  test("a node at texture row 0 is hoverable when nothing is hidden", async () => {
    const { sigma, graph } = mount();
    await wait(100);

    const entered: string[] = [];
    sigma.addListener("enterNode", ({ node }) => entered.push(node));
    await simulateMouseEvent(sigma.getMouseLayer(), "pointermove", rowZeroNodePosition(sigma, graph));
    await wait(50);

    expect(entered).toEqual(["n1"]);
  });

  test("a node at texture row 0 stays hoverable while another node is hidden", async () => {
    const { sigma, graph } = mount({ hiddenNode: "n3" });
    await wait(100);

    const entered: string[] = [];
    sigma.addListener("enterNode", ({ node }) => entered.push(node));
    await simulateMouseEvent(sigma.getMouseLayer(), "pointermove", rowZeroNodePosition(sigma, graph));
    await wait(50);

    expect(entered).toEqual(["n1"]);
  });

  test("an edge at texture row 0 is hoverable when nothing is hidden", async () => {
    const { sigma, graph } = mount();
    await wait(100);

    const entered: string[] = [];
    sigma.addListener("enterEdge", ({ edge }) => entered.push(edge));
    await simulateMouseEvent(sigma.getMouseLayer(), "pointermove", rowZeroEdgePosition(sigma, graph));
    await wait(50);

    expect(entered).toEqual(["e1"]);
  });

  test("an edge at texture row 0 stays hoverable while another edge is hidden", async () => {
    const { sigma, graph } = mount({ hiddenEdge: "e2" });
    await wait(100);

    const entered: string[] = [];
    sigma.addListener("enterEdge", ({ edge }) => entered.push(edge));
    await simulateMouseEvent(sigma.getMouseLayer(), "pointermove", rowZeroEdgePosition(sigma, graph));
    await wait(50);

    expect(entered).toEqual(["e1"]);
  });
});
