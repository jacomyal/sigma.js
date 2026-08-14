import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { pathCurved, pathLine } from "sigma/rendering";
import { Coordinates, DEFAULT_STYLES } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, describe, expect, test } from "vitest";

import { simulateMouseEvent, wait } from "./_test-helpers";

let instances: Sigma[] = [];

afterEach(() => {
  instances.forEach((sigma) => {
    sigma.kill();
    sigma.getContainer().remove();
  });
  instances = [];
});

function createContainer(): HTMLDivElement {
  const container = createElement("div", { width: "300px", height: "600px" }) as HTMLDivElement;
  document.body.append(container);
  return container;
}

async function hover(sigma: Sigma, position: Coordinates): Promise<string[]> {
  const entered: string[] = [];
  const onEnterNode = ({ node }: { node: string }) => entered.push(node);
  const onEnterEdge = ({ edge }: { edge: string }) => entered.push(edge);
  sigma.addListener("enterNode", onEnterNode);
  sigma.addListener("enterEdge", onEnterEdge);

  await simulateMouseEvent(sigma.getMouseLayer(), "pointermove", sigma.graphToViewport(position));
  await wait(50);

  sigma.removeListener("enterNode", onEnterNode);
  sigma.removeListener("enterEdge", onEnterEdge);
  return entered;
}

// Bug: a hidden item was written as all zeros, which meant "texture row 0,
// picking id 0". It then masked the real row-0 item in the picking buffer,
// making it impossible to hover.
describe("Hidden items (regression #1549 - part 1)", () => {
  // "n1" and "e1" come first, so they own row 0. Tests hide "n3" or "e2".
  const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
    nodes: [
      { key: "n1", attributes: { x: 0, y: 0, size: 10 } },
      { key: "n2", attributes: { x: 50, y: 50, size: 10 } },
      { key: "n3", attributes: { x: 50, y: 0, size: 10 } },
    ],
    edges: [
      { key: "e1", source: "n1", target: "n2", attributes: { size: 10 } },
      { key: "e2", source: "n1", target: "n3", attributes: { size: 10 } },
    ],
  };

  async function mount({ hiddenNode, hiddenEdge }: { hiddenNode?: string; hiddenEdge?: string } = {}) {
    const graph = new Graph();
    graph.import(GRAPH);
    const sigma = new Sigma(graph, createContainer(), { settings: { enableEdgeEvents: true } });
    instances.push(sigma);
    if (hiddenNode) sigma.setNodeState(hiddenNode, { isHidden: true });
    if (hiddenEdge) sigma.setEdgeState(hiddenEdge, { isHidden: true });
    await wait(100);
    return sigma;
  }

  const OVER_N1 = { x: 0, y: 0 };
  const OVER_E1 = { x: 25, y: 25 }; // middle of "e1"

  test("the row-0 node is hoverable when nothing is hidden", async () => {
    const sigma = await mount();
    expect(await hover(sigma, OVER_N1)).toEqual(["n1"]);
  });

  test("the row-0 node stays hoverable while another node is hidden", async () => {
    const sigma = await mount({ hiddenNode: "n3" });
    expect(await hover(sigma, OVER_N1)).toEqual(["n1"]);
  });

  test("the row-0 edge is hoverable when nothing is hidden", async () => {
    const sigma = await mount();
    expect(await hover(sigma, OVER_E1)).toEqual(["e1"]);
  });

  test("the row-0 edge stays hoverable while another edge is hidden", async () => {
    const sigma = await mount({ hiddenEdge: "e2" });
    expect(await hover(sigma, OVER_E1)).toEqual(["e1"]);
  });
});

// Bug: shaders read path attributes (like curvature) at the edge's texture
// row, but rows were assigned in write order. A hidden edge writes nothing,
// so every edge after it read another edge's attributes.
describe("Hidden edges and path attributes (regression #1549 - part 2)", () => {
  // "e1" owns row 0. Hiding it used to shift "e2"'s curvature away, so "e2"
  // rendered straight.
  const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
    nodes: [
      { key: "n1", attributes: { x: 0, y: 0, size: 10 } },
      { key: "n2", attributes: { x: 100, y: 0, size: 10 } },
      { key: "n3", attributes: { x: 0, y: 100, size: 10 } },
      { key: "n4", attributes: { x: 100, y: 100, size: 10 } },
    ],
    edges: [
      { key: "e1", source: "n3", target: "n4", attributes: { size: 10 } },
      { key: "e2", source: "n1", target: "n2", attributes: { size: 10, path: "curved", curvature: 0.5 } },
    ],
  };

  async function mount({ hiddenEdge }: { hiddenEdge?: string } = {}) {
    const graph = new Graph();
    graph.import(GRAPH);
    // The bug only showed when the edge is hidden from the very first render,
    // so it is hidden through data + styles, not state:
    if (hiddenEdge) graph.setEdgeAttribute(hiddenEdge, "visibility", "hidden");
    const sigma = new Sigma(graph, createContainer(), {
      primitives: { edges: { paths: [pathLine(), pathCurved()] } },
      styles: {
        nodes: DEFAULT_STYLES.nodes,
        edges: [
          DEFAULT_STYLES.edges,
          { path: { attribute: "path" }, visibility: { attribute: "visibility", defaultValue: "visible" } },
        ],
      },
      settings: { enableEdgeEvents: true },
    });
    instances.push(sigma);
    await wait(100);
    return sigma;
  }

  // The arc of "e2" peaks 25 units off its chord (curvature * length / 2).
  // A straight "e2" misses this point.
  const OVER_E2_ARC = { x: 50, y: 25 };

  test("the curved edge is hoverable on its arc when nothing is hidden", async () => {
    const sigma = await mount();
    expect(await hover(sigma, OVER_E2_ARC)).toEqual(["e2"]);
  });

  test("the curved edge stays hoverable on its arc while another edge is hidden", async () => {
    const sigma = await mount({ hiddenEdge: "e1" });
    expect(await hover(sigma, OVER_E2_ARC)).toEqual(["e2"]);
  });
});
