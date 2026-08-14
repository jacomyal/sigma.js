import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  hoverNode,
  rotate,
  simulateDoubleClick,
  simulateMouseEvent,
  simulateTouchEvent,
  wait,
} from "../../_test-helpers";

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
  test<SigmaTestContext>("it should zoom to the center when user double-clicks in the center", async ({
    sigma,
    target,
  }) => {
    const position = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

    await simulateDoubleClick(target, position);
    await vi.waitFor(() =>
      expect(sigma.getCamera().getState()).toEqual({
        x: 0.5,
        y: 0.5,
        angle: 0,
        ratio: 1 / sigma.getSetting("doubleClickZoomingRatio"),
      }),
    );
  });

  test<SigmaTestContext>("it should zoom to the mouse position when user double-clicks in the center", async ({
    sigma,
    target,
  }) => {
    const position = { x: STAGE_WIDTH * 0.2, y: STAGE_HEIGHT * 0.7 };
    const originalMouseGraphCoordinates = sigma.viewportToFramedGraph(position);

    await simulateDoubleClick(target, position);
    await vi.waitFor(() => {
      const newMouseGraphCoordinates = sigma.viewportToFramedGraph(position);
      (["x", "y"] as const).forEach((key) =>
        expect(newMouseGraphCoordinates[key]).toBeCloseTo(originalMouseGraphCoordinates[key], 6),
      );
    });
  });

  test<SigmaTestContext>("it should dispatch an 'enterNode' event when the mouse is hover the node", async ({
    sigma,
  }) => {
    let triggeredEventsCount = 0;
    sigma.on("enterNode", () => {
      triggeredEventsCount++;
    });

    await hoverNode(sigma, "n1");
    expect(triggeredEventsCount).toBe(1);
    expect(sigma["stateManager"].hovered?.key).toBe("n1");
    expect(sigma["stateManager"].hovered?.kind).toBe("node");
  });

  test<SigmaTestContext>("it should not throw when `setGraph` is called while a node is hovered (issue #1486)", async ({
    sigma,
  }) => {
    await hoverNode(sigma, "n1");
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

    await simulateMouseEvent(target, "pointerdown", start, { button: 2 });
    await simulateMouseEvent(target, "pointermove", end, { button: 2 });
    await simulateMouseEvent(target, "pointerup", end, { button: 2 });

    expect(camera.getState()).toEqual(initialState);
  });

  test<SigmaTestContext>("right-click drag should only change angle, not ratio", async ({ sigma, target }) => {
    const camera = sigma.getCamera();
    const initialState = camera.getState();
    const center = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

    const start = { x: center.x + 50, y: center.y };
    const end = rotate(start, center, Math.PI / 4);

    await simulateMouseEvent(target, "pointerdown", start, { button: 2 });
    await simulateMouseEvent(target, "pointermove", end, { button: 2 });
    await simulateMouseEvent(target, "pointerup", end, { button: 2 });

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

    await simulateMouseEvent(target, "pointerdown", start, { button: 2 });
    await simulateMouseEvent(target, "pointermove", end, { button: 2 });
    await simulateMouseEvent(target, "pointerup", end, { button: 2 });

    expect(camera.getState().angle).toBeCloseTo(Math.PI / 2, 6);
  });
});

describe("Sigma wheel gesture routing", () => {
  function dispatchWheel(target: HTMLElement, options: { deltaY?: number; ctrlKey?: boolean } = {}): WheelEvent {
    const event = new WheelEvent("wheel", { deltaY: -120, cancelable: true, bubbles: true, ...options });
    target.dispatchEvent(event);
    return event;
  }

  test<SigmaTestContext>("with gestureTarget 'graph' (default), wheel events are captured and zoom the camera", async ({
    sigma,
    target,
  }) => {
    const initialRatio = sigma.getCamera().getState().ratio;

    const event = dispatchWheel(target);

    expect(event.defaultPrevented).toBe(true);
    await vi.waitFor(() => expect(sigma.getCamera().getState().ratio).toBeLessThan(initialRatio));
  });

  test<SigmaTestContext>("with gestureTarget 'graph', wheel events stay captured at the zoom boundary", async ({
    sigma,
    target,
  }) => {
    // The camera starts at ratio 1, so zooming in is impossible:
    sigma.setSetting("minCameraRatio", 1);

    const event = dispatchWheel(target);

    expect(event.defaultPrevented).toBe(true);
    await wait(50);
    expect(sigma.getCamera().getState().ratio).toBe(1);
  });

  test<SigmaTestContext>("with gestureTarget 'page', wheel events are left to the page", async ({ sigma, target }) => {
    sigma.setSetting("gestureTarget", "page");
    const initialRatio = sigma.getCamera().getState().ratio;

    const event = dispatchWheel(target);

    expect(event.defaultPrevented).toBe(false);
    await wait(50);
    expect(sigma.getCamera().getState().ratio).toBe(initialRatio);
  });

  test<SigmaTestContext>("with gestureTarget 'shared', plain wheel events are left to the page and show the hint", async ({
    sigma,
    target,
  }) => {
    sigma.setSetting("gestureTarget", "shared");
    // Neutralize the platform detection, so this test runs everywhere:
    sigma.setSetting("sharedGestureWheelMessage", "Test wheel message");
    sigma.setSetting("sharedGestureAppleWheelMessage", "Test wheel message");

    const initialRatio = sigma.getCamera().getState().ratio;
    const event = dispatchWheel(target);

    expect(event.defaultPrevented).toBe(false);
    const hint = sigma.getContainer().querySelector(".sigma-gesture-hint");
    expect(hint).not.toBeNull();
    expect(hint?.textContent).toBe("Test wheel message");
    await wait(50);
    expect(sigma.getCamera().getState().ratio).toBe(initialRatio);
  });

  test<SigmaTestContext>("with gestureTarget 'shared', Ctrl + wheel events are captured and zoom the camera", async ({
    sigma,
    target,
  }) => {
    sigma.setSetting("gestureTarget", "shared");
    const initialRatio = sigma.getCamera().getState().ratio;

    const event = dispatchWheel(target, { ctrlKey: true });

    expect(event.defaultPrevented).toBe(true);
    await vi.waitFor(() => expect(sigma.getCamera().getState().ratio).toBeLessThan(initialRatio));
  });

  test<SigmaTestContext>("handlers receive wheel events even when they are routed to the page", async ({
    sigma,
    target,
  }) => {
    const handler = vi.fn();
    sigma.getMouseCaptor().on("wheel", handler);

    sigma.setSetting("gestureTarget", "page");
    dispatchWheel(target);
    expect(handler).toHaveBeenCalledTimes(1);

    sigma.setSetting("gestureTarget", "shared");
    dispatchWheel(target);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test<SigmaTestContext>("handlers calling preventSigmaDefault take the wheel event over", async ({
    sigma,
    target,
  }) => {
    sigma.getMouseCaptor().on("wheel", (coords) => coords.preventSigmaDefault());
    const initialRatio = sigma.getCamera().getState().ratio;

    const event = dispatchWheel(target);

    // Sigma neither zooms nor blocks the page:
    expect(event.defaultPrevented).toBe(false);
    await wait(50);
    expect(sigma.getCamera().getState().ratio).toBe(initialRatio);
  });

  test<SigmaTestContext>("with gestureTarget 'shared', preventSigmaDefault also suppresses the hint", async ({
    sigma,
    target,
  }) => {
    sigma.setSetting("gestureTarget", "shared");
    sigma.getMouseCaptor().on("wheel", (coords) => coords.preventSigmaDefault());

    dispatchWheel(target);

    expect(sigma.getContainer().querySelector(".sigma-gesture-hint")).toBeNull();
  });
});

describe("Sigma touch compatibility events", () => {
  function dispatchTapCompatibilityEvents(target: HTMLElement, position: Coordinates): void {
    const init = { pointerType: "touch", clientX: position.x, clientY: position.y, bubbles: true, cancelable: true };
    target.dispatchEvent(new PointerEvent("pointerdown", init));
    target.dispatchEvent(new PointerEvent("pointerup", init));
    target.dispatchEvent(new MouseEvent("mousedown", init));
    target.dispatchEvent(new MouseEvent("mouseup", init));
    target.dispatchEvent(new MouseEvent("click", init));
  }

  test<SigmaTestContext>("compatibility mouse events after a tap don't produce a second click", async ({
    sigma,
    target,
  }) => {
    // Off the n1-n2 diagonal, so the tap hits the stage:
    const position = { x: STAGE_WIDTH * 0.8, y: STAGE_HEIGHT * 0.2 };
    let clicks = 0;
    sigma.on("clickStage", () => clicks++);

    await simulateTouchEvent(target, "touchstart", [{ ...position, id: 1 }]);
    await simulateTouchEvent(target, "touchend", []);
    dispatchTapCompatibilityEvents(target, position);
    await wait(50);

    expect(clicks).toBe(1);
  });

  test<SigmaTestContext>("compatibility mouse events after a double tap don't zoom twice", async ({
    sigma,
    target,
  }) => {
    const position = { x: STAGE_WIDTH * 0.8, y: STAGE_HEIGHT * 0.2 };
    const touch = { ...position, id: 1 };
    const expectedRatio = 1 / sigma.getSetting("doubleClickZoomingRatio");

    await simulateTouchEvent(target, "touchstart", [touch]);
    await simulateTouchEvent(target, "touchend", []);
    await simulateTouchEvent(target, "touchstart", [touch]);
    await simulateTouchEvent(target, "touchend", []);
    dispatchTapCompatibilityEvents(target, position);
    dispatchTapCompatibilityEvents(target, position);

    // The camera zooms from the "doubletap" only, and stays there:
    await vi.waitFor(() => expect(sigma.getCamera().getState().ratio).toBeCloseTo(expectedRatio, 6));
    await wait(100);
    expect(sigma.getCamera().getState().ratio).toBeCloseTo(expectedRatio, 6);
  });
});
