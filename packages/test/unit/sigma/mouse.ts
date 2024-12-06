import { userEvent } from "@vitest/browser/context";
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { wait } from "../_helpers";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
  container: HTMLDivElement;
}

const STAGE_WIDTH = 200;
const STAGE_HEIGHT = 400;

const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
  nodes: [
    { key: "n1", attributes: { x: 0, y: 0, size: 5 } },
    { key: "n2", attributes: { x: 50, y: 50, size: 5 } },
  ],
  edges: [{ source: "n1", target: "n2" }],
};

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  graph.import(GRAPH);
  const container = createElement("div", { width: `${STAGE_WIDTH}px`, height: `${STAGE_HEIGHT}px` }) as HTMLDivElement;
  document.body.append(container);

  context.sigma = new Sigma(graph, container, {
    zoomDuration: 30,
    inertiaDuration: 30,
    doubleClickZoomingDuration: 30,
  });
  context.graph = graph;
  context.container = container;
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("Sigma mouse management", () => {
  test<SigmaTestContext>(
    "it should zoom to the center when user double-clicks in the center",
    async ({ sigma, container }) => {
      const position = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

      await userEvent.dblClick(container, { position });
      await wait(sigma.getSetting("doubleClickZoomingDuration") * 1.1);

      expect(sigma.getCamera().getState()).toEqual({
        x: 0.5,
        y: 0.5,
        angle: 0,
        ratio: 1 / sigma.getSetting("doubleClickZoomingRatio"),
      });
    },
    { retry: 2 },
  );

  test<SigmaTestContext>(
    "it should zoom to the mouse position when user double-clicks in the center",
    async ({ sigma, container }) => {
      const position = { x: STAGE_WIDTH * 0.2, y: STAGE_HEIGHT * 0.7 };
      const originalMouseGraphCoordinates = sigma.viewportToFramedGraph(position);

      await userEvent.dblClick(container, { position });
      await wait(sigma.getSetting("doubleClickZoomingDuration") * 1.1);

      const newMouseGraphCoordinates = sigma.viewportToFramedGraph(position);
      (["x", "y"] as const).forEach((key) =>
        expect(newMouseGraphCoordinates[key]).toBeCloseTo(originalMouseGraphCoordinates[key], 6),
      );
    },
    { retry: 2 },
  );

  test<SigmaTestContext>("it should dispatch an 'enterNode' event when the mouse is hover the node", async ({
    sigma,
    graph,
    container,
  }) => {
    const position = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
    let triggeredEventsCount = 0;
    sigma.on("enterNode", () => {
      triggeredEventsCount++;
    });

    await userEvent.hover(container, { position });
    expect(triggeredEventsCount).toBe(1);
    expect(sigma["hoveredNode"]).toBe("n1");
  });

  test<SigmaTestContext>("it should not throw when `setGraph` is called while a node is hovered (issue #1486)", async ({
    sigma,
    graph,
    container,
  }) => {
    const position = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);

    await userEvent.hover(container, { position });
    const newGraph = new Graph();
    newGraph.import({
      nodes: [
        { key: "n3", attributes: { x: 0, y: 0, size: 5 } },
        { key: "n4", attributes: { x: 50, y: 50, size: 5 } },
      ],
      edges: [{ source: "n3", target: "n4" }],
    });
    sigma.setGraph(newGraph);
  });
});
