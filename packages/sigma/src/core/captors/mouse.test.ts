import { userEvent } from "@vitest/browser/context";
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { rotate, simulateMouseEvent, wait } from "../../_test-helpers";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
  container: HTMLDivElement;
  target: HTMLElement;
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
    settings: {
      zoomDuration: 30,
      inertiaDuration: 30,
      doubleClickZoomingDuration: 30,
    },
  });
  context.graph = graph;
  context.container = container;
  context.target = context.sigma.getMouseLayer();
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

    await userEvent.hover(container, { position, timeout: 5000 });
    expect(triggeredEventsCount).toBe(1);
    expect(sigma["stateManager"].hovered?.key).toBe("n1");
    expect(sigma["stateManager"].hovered?.kind).toBe("node");
  });

  test<SigmaTestContext>("it should not throw when `setGraph` is called while a node is hovered (issue #1486)", async ({
    sigma,
    graph,
    container,
  }) => {
    const position = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);

    await userEvent.hover(container, { position, timeout: 5000 });
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

describe("Sigma right-click mouse rotation", () => {
  test<SigmaTestContext>("right-click drag should not rotate when enableCameraMouseRotation is false", async ({
    sigma,
    target,
  }) => {
    sigma.setSetting("enableCameraMouseRotation", false);
    const camera = sigma.getCamera();
    const initialState = camera.getState();
    const center = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

    // Right-click drag from right of center to above center (90° rotation)
    const start = { x: center.x + 50, y: center.y };
    const end = rotate(start, center, Math.PI / 2);

    await simulateMouseEvent(target, "mousedown", start, { button: 2 });
    await simulateMouseEvent(target, "mousemove", end, { button: 2 });
    await simulateMouseEvent(target, "mouseup", end, { button: 2 });

    expect(camera.getState()).toEqual(initialState);
  });

  test<SigmaTestContext>("right-click drag should only change angle, not ratio", async ({ sigma, target }) => {
    const camera = sigma.getCamera();
    const initialState = camera.getState();
    const center = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

    const start = { x: center.x + 50, y: center.y };
    const end = rotate(start, center, Math.PI / 4);

    await simulateMouseEvent(target, "mousedown", start, { button: 2 });
    await simulateMouseEvent(target, "mousemove", end, { button: 2 });
    await simulateMouseEvent(target, "mouseup", end, { button: 2 });

    expect(camera.getState().ratio).toBe(initialState.ratio);
    expect(camera.getState().x).toBe(initialState.x);
    expect(camera.getState().y).toBe(initialState.y);
    expect(camera.getState().angle).not.toBe(initialState.angle);
  });

  test<SigmaTestContext>("right-click drag should rotate around the center of the stage", async ({ sigma, target }) => {
    sigma.setSetting("enableCameraMouseRotation", true);
    const camera = sigma.getCamera();
    const center = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

    // Drag from right of center to above center: 90° counter-clockwise in viewport
    const start = { x: center.x + 50, y: center.y };
    const end = rotate(start, center, Math.PI / 2);

    await simulateMouseEvent(target, "mousedown", start, { button: 2 });
    await simulateMouseEvent(target, "mousemove", end, { button: 2 });
    await simulateMouseEvent(target, "mouseup", end, { button: 2 });

    expect(camera.getState().angle).toBeCloseTo(Math.PI / 2, 6);
  });
});
