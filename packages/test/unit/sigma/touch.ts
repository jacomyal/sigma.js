import { userEvent } from "@vitest/browser/context";
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
  container: HTMLDivElement;
}

function wait(timeout: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

function add<T extends Coordinates>(p: T, vec: Coordinates): T {
  return {
    ...p,
    x: p.x + vec.x,
    y: p.y + vec.y,
  };
}

const STAGE_WIDTH = 200;
const STAGE_HEIGHT = 400;
const T_A = { x: STAGE_WIDTH / 3, y: STAGE_HEIGHT / 3 };
const T_B = { x: (STAGE_WIDTH * 2) / 3, y: (STAGE_HEIGHT * 2) / 3 };

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

describe.skip("Sigma multi-touch management", () => {
  test<SigmaTestContext>("the camera should not move when touches are down and up, without moving at all", async ({
    sigma,
    container,
  }) => {
    const initialCameraState = { ...sigma.getCamera().getState() };

    await userEvent.pointer({
      keys: "[TouchA>]",
      target: container,
      coords: T_A,
    });
    await userEvent.pointer({
      keys: "[TouchB>]",
      target: container,
      coords: T_B,
    });
    await userEvent.pointer({ keys: "[/TouchA]" });
    await userEvent.pointer({ keys: "[/TouchB]" });
    await wait(200);

    expect(sigma.getCamera().getState()).toEqual(initialCameraState);
  });

  test<SigmaTestContext>("the camera should move (no zoom, no rotation) when both touches move the same", async ({
    sigma,
    container,
  }) => {
    const initialCameraState = { ...sigma.getCamera().getState() };
    const diff = { x: 12, y: 34 };

    await userEvent.pointer([
      {
        keys: "[TouchA>]",
        target: container,
        coords: T_A,
      },
      {
        keys: "[TouchB>]",
        target: container,
        coords: T_B,
      },
    ]);

    await userEvent.pointer([
      { pointerName: "TouchA", coords: add(T_A, diff) },
      { pointerName: "TouchB", coords: add(T_B, diff) },
    ]);

    await userEvent.pointer([{ keys: "[/TouchA]" }, { keys: "[/TouchB]" }]);
    await wait(200);

    expect(sigma.getCamera().getState()).toEqual(add(initialCameraState, diff));
  });

  test<SigmaTestContext>("the camera should zoom (no move, no rotation) when both touches move, while keeping the same center and orientation", async ({
    sigma,
    container,
  }) => {
    const initialCameraState = { ...sigma.getCamera().getState() };

    await userEvent.pointer([
      {
        keys: "[TouchA>]",
        target: container,
        coords: T_A,
      },
      {
        keys: "[TouchB>]",
        target: container,
        coords: T_B,
      },
    ]);

    await userEvent.pointer([
      { pointerName: "TouchA", coords: { x: 0, y: 0 } },
      { pointerName: "TouchB", coords: { x: STAGE_WIDTH, y: STAGE_HEIGHT } },
    ]);

    await userEvent.pointer([{ keys: "[/TouchA]" }, { keys: "[/TouchB]" }]);
    await wait(200);

    expect(sigma.getCamera().getState()).toEqual({ ...initialCameraState, ratio: initialCameraState.ratio * 3 });
  });

  test<SigmaTestContext>("the camera should rotate (no move, no zoom) when both touches move, while keeping the same center and distance", async ({
    sigma,
    container,
  }) => {
    const initialCameraState = { ...sigma.getCamera().getState() };

    await userEvent.pointer([
      {
        keys: "[TouchA>]",
        target: container,
        coords: T_A,
      },
      {
        keys: "[TouchB>]",
        target: container,
        coords: T_B,
      },
    ]);

    await userEvent.pointer([
      { pointerName: "TouchA", coords: { x: T_A.y, y: -T_A.x } },
      { pointerName: "TouchB", coords: { x: T_B.y, y: -T_B.x } },
    ]);

    await userEvent.pointer([{ keys: "[/TouchA]" }, { keys: "[/TouchB]" }]);
    await wait(200);

    expect(sigma.getCamera().getState()).toEqual({
      ...initialCameraState,
      angle: initialCameraState.angle + Math.PI / 2,
    });
  });
});
