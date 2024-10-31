import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { add, expectObjectsToBeClose, remove, rotate, simulateTouchEvent } from "../_helpers";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
  target: HTMLElement;
}

// Tests context:
const STAGE_WIDTH = 200;
const STAGE_HEIGHT = 400;
const ID_A = 1;
const ID_B = 2;
const T_A = { id: ID_A, x: STAGE_WIDTH / 3, y: STAGE_HEIGHT / 3 };
const T_B = { id: ID_B, x: (STAGE_WIDTH * 2) / 3, y: (STAGE_HEIGHT * 2) / 3 };

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
  context.target = context.sigma.getCanvases().mouse;
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

// Actual tests:
describe("Sigma multi-touch management", () => {
  test<SigmaTestContext>("the camera should not move when touches are down and up, without moving at all", async ({
    sigma,
    target,
  }) => {
    const initialCameraState = { ...sigma.getCamera().getState() };

    await simulateTouchEvent(target, "touchstart", [T_A]);
    await simulateTouchEvent(target, "touchstart", [T_A, T_B]);
    await simulateTouchEvent(target, "touchmove", [T_A, T_B]);

    await simulateTouchEvent(target, "touchend", [T_B]);
    await simulateTouchEvent(target, "touchend", []);

    expect(sigma.getCamera().getState()).toEqual(initialCameraState);
  });

  test<SigmaTestContext>("the camera should move (no zoom, no rotation) when both touches move the same", async ({
    sigma,
    target,
  }) => {
    const camera = sigma.getCamera();
    const initialCameraState = camera.getState();

    const diff = { x: 100, y: 100 };
    const targetA = add(T_A, diff);
    const targetB = add(T_B, diff);
    const expectedCameraState = {
      ...initialCameraState,
      ...sigma.viewportToFramedGraph(remove(sigma.framedGraphToViewport(initialCameraState), diff)),
    };

    await simulateTouchEvent(target, "touchstart", [T_A]);
    await simulateTouchEvent(target, "touchstart", [T_A, T_B]);

    await simulateTouchEvent(target, "touchmove", [targetA, targetB]);

    await simulateTouchEvent(target, "touchend", [targetB]);
    await simulateTouchEvent(target, "touchend", []);

    const newCameraState = camera.getState();
    expectObjectsToBeClose(newCameraState, expectedCameraState);
  });

  test<SigmaTestContext>("the camera should zoom (no move, no rotation) when both touches move, while keeping the same center and orientation", async ({
    sigma,
    target,
  }) => {
    const camera = sigma.getCamera();
    const initialCameraState = camera.getState();

    const targetA = { id: ID_A, x: 0, y: 0 };
    const targetB = { id: ID_B, x: STAGE_WIDTH, y: STAGE_HEIGHT };
    const expectedCameraState = { ...initialCameraState, ratio: initialCameraState.ratio / 3 };

    await simulateTouchEvent(target, "touchstart", [T_A]);
    await simulateTouchEvent(target, "touchstart", [T_A, T_B]);

    await simulateTouchEvent(target, "touchmove", [targetA, targetB]);

    await simulateTouchEvent(target, "touchend", [targetB]);
    await simulateTouchEvent(target, "touchend", []);

    const newCameraState = camera.getState();
    expectObjectsToBeClose(newCameraState, expectedCameraState);
  });

  test<SigmaTestContext>("the camera should rotate (no move, no zoom) when both touches move, while keeping the same center and distance", async ({
    sigma,
    target,
  }) => {
    const camera = sigma.getCamera();
    const initialCameraState = camera.getState();

    const center = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };
    const targetA = rotate(T_A, center, Math.PI / 2);
    const targetB = rotate(T_B, center, Math.PI / 2);
    const expectedCameraState = {
      ...initialCameraState,
      angle: initialCameraState.angle + Math.PI / 2,
    };

    await simulateTouchEvent(target, "touchstart", [T_A]);
    await simulateTouchEvent(target, "touchstart", [T_A, T_B]);

    await simulateTouchEvent(target, "touchmove", [targetA, targetB]);

    await simulateTouchEvent(target, "touchend", [targetB]);
    await simulateTouchEvent(target, "touchend", []);

    const newCameraState = camera.getState();
    expectObjectsToBeClose(newCameraState, expectedCameraState);
  });
});
