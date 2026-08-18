import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates, SigmaEventType } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { add, findPickingPosition, hoverNode, simulateMouseEvent, simulateTouchEvent, wait } from "./_test-helpers";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
  target: HTMLElement;
  container: HTMLDivElement;
}

const STAGE_WIDTH = 300;
const STAGE_HEIGHT = 600;

const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
  nodes: [
    { key: "n1", attributes: { x: 0, y: 0, size: 10, color: "blue" } },
    { key: "n2", attributes: { x: 50, y: 50, size: 10, color: "red" } },
  ],
  edges: [{ source: "n1", target: "n2" }],
};

describe("Sigma interaction events", () => {
  beforeEach<SigmaTestContext>(async (context) => {
    const graph = new Graph();
    graph.import(GRAPH);
    const container = createElement("div", {
      width: `${STAGE_WIDTH}px`,
      height: `${STAGE_HEIGHT}px`,
    }) as HTMLDivElement;
    document.body.append(container);

    context.sigma = new Sigma(graph, container, {
      settings: {
        zoomDuration: 30,
        inertiaDuration: 30,
        doubleClickZoomingDuration: 30,
        doubleClickTimeout: 5000,
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

  test<SigmaTestContext>('it should trigger the events "downNode", "upNode", "clickNode", "downNode", "upNode" and finally "doubleClickNode" when double clicking a node with the mouse', async ({
    sigma,
    graph,
    container,
  }) => {
    const triggeredEvents: SigmaEventType[] = [];
    const observedEvents: SigmaEventType[] = ["clickNode", "downNode", "upNode", "doubleClickNode"];
    observedEvents.forEach((type: SigmaEventType) => {
      sigma.addListener(type, () => {
        triggeredEvents.push(type);
      });
    });

    const position = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
    await userEvent.dblClick(container, { position });
    await wait(10);

    expect(triggeredEvents).toEqual(["downNode", "upNode", "clickNode", "downNode", "upNode", "doubleClickNode"]);
  });

  test<SigmaTestContext>('it should trigger the events "downNode", "upNode", "clickNode", "downNode", "upNode" and finally "doubleClickNode" when double clicking a node with a touch gesture', async ({
    sigma,
    graph,
    target,
  }) => {
    const triggeredEvents: SigmaEventType[] = [];
    const observedEvents: SigmaEventType[] = ["clickNode", "downNode", "upNode", "doubleClickNode"];
    observedEvents.forEach((type: SigmaEventType) => {
      sigma.addListener(type, () => {
        triggeredEvents.push(type);
      });
    });

    const touch = { ...sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates), id: 1 };
    await simulateTouchEvent(target, "touchstart", [touch]);
    await simulateTouchEvent(target, "touchend", []);
    await simulateTouchEvent(target, "touchstart", [touch]);
    await simulateTouchEvent(target, "touchend", []);

    expect(triggeredEvents).toEqual(["downNode", "upNode", "clickNode", "downNode", "upNode", "doubleClickNode"]);
  });

  test<SigmaTestContext>("hovering a node should hover it and cancel other nodes hovering", async ({ sigma }) => {
    const hoveredNodes = new Set<string>();
    sigma.on("enterNode", ({ node }) => {
      hoveredNodes.add(node);
    });
    sigma.on("leaveNode", ({ node }) => {
      hoveredNodes.delete(node);
    });

    await hoverNode(sigma, "n1");
    expect.soft(Array.from(hoveredNodes)).toEqual(["n1"]);

    await hoverNode(sigma, "n2");
    expect.soft(Array.from(hoveredNodes)).toEqual(["n2"]);
  });

  test<SigmaTestContext>("a node moving away from a still cursor should stop being hovered", async ({
    sigma,
    graph,
  }) => {
    const left: string[] = [];
    sigma.on("leaveNode", ({ node }) => left.push(node));

    await hoverNode(sigma, "n1");

    // Move the node away from the still cursor
    graph.setNodeAttribute("n1", "x", 1000);
    await vi.waitFor(() => expect(sigma.getNodeState("n1").isHovered).toBe(false), { timeout: 5000 });

    expect(left).toEqual(["n1"]);
  });

  test<SigmaTestContext>("a layout tick should not invalidate picking", async ({ sigma, graph }) => {
    // Wait for the initial full process before spying, because it legitimately invalidates
    sigma.scheduleRender();
    await new Promise<void>((resolve) => sigma.once("afterRender", () => resolve()));

    const { hoverResolver } = sigma["internals"];
    const invalidate = vi.spyOn(hoverResolver, "invalidate");

    // Simulate a layout tick (it causes reindexation, but the rebuilt picking allocation is identical)
    graph.updateEachNodeAttributes((_, attributes) => ({ ...attributes }));
    await new Promise<void>((resolve) => sigma.once("afterProcess", () => resolve()));
    expect(invalidate).not.toHaveBeenCalled();

    // Simulate a structural change, that reallocates picking IDs and must invalidate
    graph.addNode("n3", { x: 100, y: 100, size: 10 });
    await new Promise<void>((resolve) => sigma.once("afterProcess", () => resolve()));
    expect(invalidate).toHaveBeenCalled();
  });

  test<SigmaTestContext>("a dragged node should stay hovered, even away from the cursor", async ({
    sigma,
    graph,
    target,
  }) => {
    sigma.setSetting("enableNodeDrag", true);

    // Freeze the node in place, so the cursor moves away from it while dragging
    sigma.setSetting("dragPositionToAttributes", () => ({}));

    await hoverNode(sigma, "n1");
    const start = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
    const away = add(start, { x: 100, y: 100 });

    await simulateMouseEvent(target, "pointerdown", start);
    await simulateMouseEvent(target, "pointermove", add(start, { x: 50, y: 50 }));
    await simulateMouseEvent(target, "pointermove", away);
    await wait(200);
    expect(sigma.getNodeState("n1").isHovered).toBe(true);

    // On release, hover falls back to what is really under the cursor
    await simulateMouseEvent(target, "pointerup", away);
    await vi.waitFor(() => expect(sigma.getNodeState("n1").isHovered).toBe(false), { timeout: 5000 });
  });

  test<SigmaTestContext>("touching a node should hover it and cancel other nodes hovering", async ({
    sigma,
    graph,
    target,
  }) => {
    const hoveredNodes = new Set<string>();
    sigma.on("enterNode", ({ node }) => {
      hoveredNodes.add(node);
    });
    sigma.on("leaveNode", ({ node }) => {
      hoveredNodes.delete(node);
    });

    const touch1 = { ...sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates), id: 1 };
    await simulateTouchEvent(target, "touchstart", [touch1]);
    await simulateTouchEvent(target, "touchmove", [touch1]);
    await simulateTouchEvent(target, "touchend", []);
    await vi.waitFor(() => expect(Array.from(hoveredNodes)).toEqual(["n1"]), { timeout: 5000 });

    const touch2 = { ...sigma.graphToViewport(graph.getNodeAttributes("n2") as Coordinates), id: 1 };
    await simulateTouchEvent(target, "touchstart", [touch2]);
    await simulateTouchEvent(target, "touchmove", [touch2]);
    await simulateTouchEvent(target, "touchend", []);
    await vi.waitFor(() => expect(Array.from(hoveredNodes)).toEqual(["n2"]), { timeout: 5000 });
  });

  test<SigmaTestContext>("touching the stage then releasing it should trigger a clickStage", async ({
    sigma,
    target,
  }) => {
    let eventsCount = 0;
    sigma.on("clickStage", () => {
      eventsCount++;
    });

    const touch = { id: 1, x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };
    await simulateTouchEvent(target, "touchstart", [touch]);
    await wait(100);
    await simulateTouchEvent(target, "touchend", []);

    expect(eventsCount).toEqual(1);
  });

  test<SigmaTestContext>("touching the stage, moving the touch a bit, then releasing it should trigger a clickStage", async ({
    sigma,
    target,
  }) => {
    let eventsCount = 0;
    sigma.on("clickStage", () => {
      eventsCount++;
    });

    const touch = { id: 1, x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };
    await simulateTouchEvent(target, "touchstart", [touch]);
    await simulateTouchEvent(target, "touchmove", [add(touch, { x: 2, y: 2 })]);
    await simulateTouchEvent(target, "touchmove", [add(touch, { x: 2, y: -2 })]);
    await simulateTouchEvent(target, "touchend", []);

    expect(eventsCount).toEqual(1);
  });

  test<SigmaTestContext>('touching the stage, moving the touch "enough", then releasing it should not trigger a clickStage', async ({
    sigma,
    target,
  }) => {
    let eventsCount = 0;
    sigma.on("clickStage", () => {
      eventsCount++;
    });

    const touch = { id: 1, x: STAGE_WIDTH / 3, y: STAGE_HEIGHT / 3 };
    await simulateTouchEvent(target, "touchstart", [touch]);
    await simulateTouchEvent(target, "touchmove", [add(touch, touch)]);
    await simulateTouchEvent(target, "touchend", []);

    expect(eventsCount).toEqual(0);
  });
});

// -----------------------------------------------------------------------------
// Label events
// -----------------------------------------------------------------------------
//
// These cover the "separate" path for both nodes and edges: clicking a
// label ribbon/rect must fire `clickNodeLabel` / `clickEdgeLabel`. The two
// label kinds each get their own contiguous range in the unified picking
// allocation; disjointness comes from those ranges, not a magic offset.

describe("Sigma label events", () => {
  interface LabelEventContext {
    sigma: Sigma;
    container: HTMLDivElement;
    graph: Graph;
  }

  beforeEach<LabelEventContext>(async (context) => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 15, label: "N1", color: "blue" });
    graph.addNode("n2", { x: 100, y: 0, size: 15, label: "N2", color: "red" });
    graph.addEdge("n1", "n2", { label: "MID", size: 6 });

    const container = createElement("div", {
      width: `${STAGE_WIDTH}px`,
      height: `${STAGE_HEIGHT}px`,
    }) as HTMLDivElement;
    document.body.append(container);

    const sigma = new Sigma(graph, container, {
      settings: {
        renderLabels: true,
        renderEdgeLabels: true,
        nodeLabelEvents: "separate",
        edgeLabelEvents: "separate",
        // Tests click the same container multiple times to scan label hitboxes.
        // A tiny doubleClickTimeout keeps each click standalone; otherwise
        // consecutive clicks collapse into a double-click and the label
        // click never fires.
        doubleClickTimeout: 0,
      },
      nodeReducer: (_key, data) => ({
        ...data,
        labelVisibility: "visible",
        labelBackgroundColor: "#eee",
      }),
      edgeReducer: (_key, data) => ({
        ...data,
        labelVisibility: "visible",
        labelBackgroundColor: "#eee",
      }),
    });
    context.sigma = sigma;
    context.graph = graph;
    context.container = container;
    // Wait for the first full frame so the picking framebuffer is populated.
    // A bare timeout is flaky under heavy parallel test load.
    await new Promise<void>((resolve) => sigma.once("afterRender", () => resolve()));
  });

  afterEach<LabelEventContext>(async ({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  test<LabelEventContext>("clicking a node label fires clickNodeLabel", async ({ sigma, graph, container }) => {
    const events: { node: string }[] = [];
    sigma.on("clickNodeLabel", ({ node }) => {
      events.push({ node });
    });

    // Node labels sit to the right of the node by default. The rendered label
    // size depends on pixel ratio, so scan a few offsets past the node edge.
    const nodePos = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
    for (const dx of [30, 40, 50, 60]) {
      await userEvent.click(container, { position: { x: nodePos.x + dx, y: nodePos.y } });
      await wait(10);
      if (events.length) break;
    }

    expect(events).toEqual([{ node: "n1" }]);
  });

  test<LabelEventContext>("clicking an edge label fires clickEdgeLabel", async ({ sigma, graph, container }) => {
    const events: { edge: string }[] = [];
    sigma.on("clickEdgeLabel", ({ edge }) => {
      events.push({ edge });
    });

    const n1 = graph.getNodeAttributes("n1") as Coordinates;
    const n2 = graph.getNodeAttributes("n2") as Coordinates;
    const midViewport = sigma.graphToViewport({ x: (n1.x + n2.x) / 2, y: (n1.y + n2.y) / 2 });
    // Scan ±8 px around the midpoint to tolerate ribbon-width / pixel-rounding.
    for (const dy of [0, -4, 4, -8, 8]) {
      for (const dx of [0, -4, 4, -8, 8]) {
        await userEvent.click(container, { position: { x: midViewport.x + dx, y: midViewport.y + dy } });
        await wait(10);
        if (events.length) break;
      }
      if (events.length) break;
    }

    expect(events).toEqual([{ edge: graph.edges()[0] }]);
  });
});

// -----------------------------------------------------------------------------
// Per-interaction label event modes
// -----------------------------------------------------------------------------
//
// Covers the Record form of `nodeLabelEvents` / `edgeLabelEvents`: an
// interaction set to "extend" should fire the parent event when the label is
// hit, while a different interaction set to "separate" should fire the
// dedicated *Label event for the same label rect.

interface MixedContext {
  sigma: Sigma;
  container: HTMLDivElement;
  graph: Graph;
}

const setupMixed = async (context: MixedContext, nodeLabelEvents: object | string | false): Promise<void> => {
  const graph = new Graph();
  graph.addNode("n1", { x: 0, y: 0, size: 15, label: "N1", color: "blue" });
  graph.addNode("n2", { x: 100, y: 0, size: 15, label: "N2", color: "red" });
  graph.addEdge("n1", "n2", { label: "MID", size: 6 });

  const container = createElement("div", {
    width: `${STAGE_WIDTH}px`,
    height: `${STAGE_HEIGHT}px`,
  }) as HTMLDivElement;
  document.body.append(container);

  const sigma = new Sigma(graph, container, {
    settings: {
      renderLabels: true,
      renderEdgeLabels: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodeLabelEvents: nodeLabelEvents as any,
      doubleClickTimeout: 0,
    },
    nodeReducer: (_key, data) => ({
      ...data,
      labelVisibility: "visible",
      labelBackgroundColor: "#eee",
    }),
    edgeReducer: (_key, data) => ({
      ...data,
      labelVisibility: "visible",
      labelBackgroundColor: "#eee",
    }),
  });
  context.sigma = sigma;
  context.graph = graph;
  context.container = container;
  await new Promise<void>((resolve) => sigma.once("afterRender", () => resolve()));
};

describe("Sigma per-interaction label events: extend-only click", () => {
  beforeEach<MixedContext>(async (ctx) => setupMixed(ctx, { click: "extend" }));
  afterEach<MixedContext>(({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  test<MixedContext>("click on label fires clickNode (extend) not clickNodeLabel", async ({
    sigma,
    graph,
    container,
  }) => {
    const nodeClicks: string[] = [];
    const labelClicks: string[] = [];
    sigma.on("clickNode", ({ node }) => nodeClicks.push(node));
    sigma.on("clickNodeLabel", ({ node }) => labelClicks.push(node));

    const nodePos = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
    for (const dx of [30, 40, 50, 60]) {
      await userEvent.click(container, { position: { x: nodePos.x + dx, y: nodePos.y } });
      await wait(10);
      if (nodeClicks.length) break;
    }

    expect(nodeClicks).toContain("n1");
    expect(labelClicks).toEqual([]);
  });
});

describe("Sigma per-interaction label events: mixed click=extend + enter=separate", () => {
  beforeEach<MixedContext>(async (ctx) => setupMixed(ctx, { click: "extend", enter: "separate", leave: "separate" }));
  afterEach<MixedContext>(({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  test<MixedContext>("hover fires enterNodeLabel, click fires clickNode", async ({ sigma, container }) => {
    const nodeClicks: string[] = [];
    const labelClicks: string[] = [];
    const labelEnters: string[] = [];
    sigma.on("clickNode", ({ node }) => nodeClicks.push(node));
    sigma.on("clickNodeLabel", ({ node }) => labelClicks.push(node));
    sigma.on("enterNodeLabel", ({ node }) => labelEnters.push(node));

    // The label rect can move between frames: re-probe it before each attempt
    await vi.waitFor(
      async () => {
        const position = findPickingPosition(sigma, "nodeLabel", "n1");
        expect(position).not.toBeNull();
        await userEvent.hover(container, { position: position! });
        expect(labelEnters).toContain("n1");
      },
      { timeout: 5000, interval: 200 },
    );

    await vi.waitFor(
      async () => {
        const position = findPickingPosition(sigma, "nodeLabel", "n1");
        expect(position).not.toBeNull();
        await userEvent.click(container, { position: position! });
        expect(nodeClicks).toContain("n1");
      },
      { timeout: 5000, interval: 200 },
    );

    expect(labelClicks).toEqual([]);
  });
});

describe("Sigma per-interaction label events: default key", () => {
  beforeEach<MixedContext>(async (ctx) => setupMixed(ctx, { default: "separate", click: "extend" }));
  afterEach<MixedContext>(({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  test<MixedContext>("click=extend overrides default=separate", async ({ sigma, graph, container }) => {
    const nodeClicks: string[] = [];
    const labelClicks: string[] = [];
    sigma.on("clickNode", ({ node }) => nodeClicks.push(node));
    sigma.on("clickNodeLabel", ({ node }) => labelClicks.push(node));

    const nodePos = sigma.graphToViewport(graph.getNodeAttributes("n1") as Coordinates);
    for (const dx of [30, 40, 50, 60]) {
      await userEvent.click(container, { position: { x: nodePos.x + dx, y: nodePos.y } });
      await wait(10);
      if (nodeClicks.length) break;
    }

    expect(nodeClicks).toContain("n1");
    expect(labelClicks).toEqual([]);
  });
});
