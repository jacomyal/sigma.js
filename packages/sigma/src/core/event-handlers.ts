/**
 * Sigma.js Event Handlers
 * =======================
 *
 * Registers mouse/touch interaction handlers and graph event handlers on behalf
 * of sigma. Picking and event dispatch are uniform across interactive kinds:
 * a single pixel read resolves to one `Hit`, the kind decides how the hit is
 * routed per verb (e.g. labels reroute to the parent in "extend" mode), and
 * the same enter/leave/click pipeline applies to every kind.
 *
 * @module
 */
import Graph, { Attributes } from "graphology-types";

import { Listener, MouseCoords, MouseInteraction, PlainObject, SigmaEventPayload, TouchCoords } from "../types";
import { cleanMouseCoords } from "./captors/captor";
import MouseCaptor from "./captors/mouse";
import TouchCaptor from "./captors/touch";
import { EdgeGroupIndex } from "./edge-groups";
import { Hit, eventName, eventPayload, isHitValid, resolveForVerb, setHover } from "./interactive-kinds";
import { AnyInternals, SigmaInternals } from "./sigma-internals";

type RefreshOpts = {
  partialGraph?: { nodes?: string[]; edges?: string[] };
  schedule?: boolean;
  skipIndexation?: boolean;
};

/**
 * Applies the kind's per-verb routing (extend/separate/false for labels,
 * identity otherwise), and drops hits the kind rejects via `isHitValid`
 * (e.g. hidden nodes).
 */
function routeHit(i: AnyInternals, hit: Hit | null, verb: MouseInteraction): Hit | null {
  if (hit) hit = resolveForVerb(i, hit, verb);
  if (hit && !isHitValid(i, hit)) hit = null;
  return hit;
}

/**
 * Resolves the hit for `verb` at `event`. Wheel reuses the last hover hit,
 * since a fresh read would block on the GPU every tick.
 */
function resolveEventHit(i: AnyInternals, event: { x: number; y: number }, verb: MouseInteraction): Hit | null {
  const hit = verb === "wheel" ? i.stateManager.hovered : i.getHitAtPosition(event);
  return routeHit(i, hit, verb);
}

function sameHit(a: Hit | null, b: Hit | null): boolean {
  if (!a || !b) return a === b;
  return a.kind === b.kind && a.key === b.key;
}

/**
 * Routes a raw hit through the "enter" verb, then applies the leave/enter
 * transition. Called when an async picking read completes.
 */
export function updateHover(i: AnyInternals, rawHit: Hit | null, event: MouseCoords): void {
  const baseEvent: SigmaEventPayload = { event, preventSigmaDefault: () => event.preventSigmaDefault() };
  // A dragged node stays hovered for the whole session, wherever the pixels land
  const session = i.dragManager.session;
  const hit: Hit | null = session ? { kind: "node", key: session.node } : routeHit(i, rawHit, "enter");

  const { stateManager } = i;
  const prev = stateManager.hovered;
  if (sameHit(prev, hit)) return;

  if (prev) {
    setHover(i, prev, false);
    i.emit(eventName(prev.kind, "leave"), eventPayload(prev, baseEvent));
  }
  stateManager.setHovered(hit);
  if (hit) {
    setHover(i, hit, true);
    i.emit(eventName(hit.kind, "enter"), eventPayload(hit, baseEvent));
  }
  i.updateContainerCursor();
}

export function bindInteractionHandlers<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  internals: SigmaInternals<N, E, G>,
  mouseCaptor: MouseCaptor<N, E, G>,
  touchCaptor: TouchCaptor<N, E, G>,
  activeListeners: PlainObject<Listener>,
): void {
  activeListeners.handleResize = () => internals.scheduleRefresh();
  window.addEventListener("resize", activeListeners.handleResize);

  // Hover detection: just record the position, resolution is asynchronous
  activeListeners.handleMove = (e: MouseCoords | TouchCoords): void => {
    internals.hoverResolver.pointerMoved(cleanMouseCoords(e));
  };

  // Drag movement (body-level, fires even outside the canvas)
  activeListeners.handleMoveBody = (e: MouseCoords | TouchCoords): void => {
    const event = cleanMouseCoords(e);
    const { dragManager } = internals;

    if (dragManager.pendingNode && !dragManager.session) {
      const { xAttribute, yAttribute } = internals.nodeStyleAnalysis;
      const { settings } = internals;
      dragManager.start(dragManager.pendingNode, event, settings.getDraggedNodes, xAttribute || "x", yAttribute || "y");
      dragManager.pendingNode = null;
    }

    if (dragManager.session) {
      dragManager.applyMove(event, internals.settings.dragPositionToAttributes);
      internals.emit("nodeDrag", {
        node: dragManager.session.node,
        allDraggedNodes: dragManager.session.allNodes,
        event,
      });
      event.preventSigmaDefault();
    }

    internals.emit("moveBody", { event, preventSigmaDefault: () => event.preventSigmaDefault() });
  };

  // Mouse leaves the canvas: emit a leave for whatever was hovered, then leaveStage.
  activeListeners.handleLeave = (e: MouseCoords | TouchCoords): void => {
    const event = cleanMouseCoords(e);
    const baseEvent: SigmaEventPayload = { event, preventSigmaDefault: () => event.preventSigmaDefault() };

    internals.hoverResolver.pointerLeft();
    updateHover(internals, null, event);
    internals.emit("leaveStage", baseEvent);
  };

  activeListeners.handleEnter = (e: MouseCoords | TouchCoords): void => {
    const event = cleanMouseCoords(e);
    internals.emit("enterStage", { event, preventSigmaDefault: () => event.preventSigmaDefault() });
  };

  // Click-family events: one resolved hit per verb. No hit → falls through to stage.
  const createInteractionListener = (verb: MouseInteraction): ((e: MouseCoords | TouchCoords) => void) => {
    return (e) => {
      const event = cleanMouseCoords(e);
      const baseEvent: SigmaEventPayload = { event, preventSigmaDefault: () => event.preventSigmaDefault() };
      const hit = resolveEventHit(internals, event, verb);
      if (hit) {
        internals.emit(eventName(hit.kind, verb), eventPayload(hit, baseEvent));
        return;
      }
      internals.emit(`${verb}Stage`, baseEvent);
    };
  };

  activeListeners.handleClick = createInteractionListener("click");
  activeListeners.handleRightClick = createInteractionListener("rightClick");
  activeListeners.handleDoubleClick = createInteractionListener("doubleClick");
  activeListeners.handleWheel = createInteractionListener("wheel");

  // down: same as the generic listener, but also arms the drag manager on a node hit.
  activeListeners.handleDown = (e: MouseCoords | TouchCoords): void => {
    const event = cleanMouseCoords(e);
    const baseEvent: SigmaEventPayload = { event, preventSigmaDefault: () => event.preventSigmaDefault() };

    const hit = resolveEventHit(internals, event, "down");
    if (hit) {
      if (hit.kind === "node" && internals.settings.enableNodeDrag) {
        internals.dragManager.pendingNode = hit.key;
      }
      internals.emit(eventName(hit.kind, "down"), eventPayload(hit, baseEvent));
      return;
    }
    internals.emit("downStage", baseEvent);
  };

  // up: same as the generic listener, but also ends any active drag session.
  activeListeners.handleUp = (e: MouseCoords | TouchCoords): void => {
    const event = cleanMouseCoords(e);
    const baseEvent: SigmaEventPayload = { event, preventSigmaDefault: () => event.preventSigmaDefault() };

    const dragResult = internals.dragManager.end();
    if (dragResult) {
      internals.emit("nodeDragEnd", { node: dragResult.node, allDraggedNodes: dragResult.allNodes, ...baseEvent });
    }

    const hit = resolveEventHit(internals, event, "up");
    if (hit) {
      internals.emit(eventName(hit.kind, "up"), eventPayload(hit, baseEvent));
      return;
    }
    internals.emit("upStage", baseEvent);
  };

  mouseCaptor.on("mousemove", activeListeners.handleMove);
  mouseCaptor.on("mousemovebody", activeListeners.handleMoveBody);
  mouseCaptor.on("click", activeListeners.handleClick);
  mouseCaptor.on("rightClick", activeListeners.handleRightClick);
  mouseCaptor.on("doubleClick", activeListeners.handleDoubleClick);
  mouseCaptor.on("wheel", activeListeners.handleWheel);
  mouseCaptor.on("mousedown", activeListeners.handleDown);
  mouseCaptor.on("mouseup", activeListeners.handleUp);
  mouseCaptor.on("mouseleave", activeListeners.handleLeave);
  mouseCaptor.on("mouseenter", activeListeners.handleEnter);

  touchCaptor.on("touchdown", activeListeners.handleDown);
  touchCaptor.on("touchdown", activeListeners.handleMove);
  touchCaptor.on("touchup", activeListeners.handleUp);
  touchCaptor.on("touchmove", activeListeners.handleMove);
  touchCaptor.on("tap", activeListeners.handleClick);
  touchCaptor.on("doubletap", activeListeners.handleDoubleClick);
  touchCaptor.on("touchmove", activeListeners.handleMoveBody);
}

export function bindGraphHandlers(
  ctx: {
    graph: Graph;
    edgeGroups: EdgeGroupIndex;
    addNode(key: string): void;
    updateNode(key: string): void;
    removeNode(key: string): void;
    addEdge(key: string): void;
    updateEdge(key: string): void;
    removeEdge(key: string): void;
    clearEdgeState(): void;
    clearNodeState(): void;
    clearEdgeIndices(): void;
    clearNodeIndices(): void;
    refresh(opts?: RefreshOpts): void;
  },
  activeListeners: PlainObject<Listener>,
): void {
  const { graph } = ctx;
  const LAYOUT_IMPACTING_FIELDS = new Set(["x", "y", "zIndex", "type"]);

  activeListeners.eachNodeAttributesUpdatedGraphUpdate = (e: { hints?: { attributes?: string[] } }) => {
    const updatedFields = e.hints?.attributes;
    const layoutChanged = !updatedFields || updatedFields.some((f) => LAYOUT_IMPACTING_FIELDS.has(f));
    ctx.refresh({ partialGraph: { nodes: graph.nodes() }, skipIndexation: !layoutChanged, schedule: true });
  };

  activeListeners.eachEdgeAttributesUpdatedGraphUpdate = (e: { hints?: { attributes?: string[] } }) => {
    const updatedFields = e.hints?.attributes;
    const layoutChanged = updatedFields && ["zIndex", "type"].some((f) => updatedFields?.includes(f));
    ctx.refresh({ partialGraph: { edges: graph.edges() }, skipIndexation: !layoutChanged, schedule: true });
  };

  activeListeners.addNodeGraphUpdate = (payload: { key: string }): void => {
    ctx.addNode(payload.key);
    ctx.refresh({ partialGraph: { nodes: [payload.key] }, skipIndexation: false, schedule: true });
  };

  activeListeners.updateNodeGraphUpdate = (payload: { key: string }): void => {
    ctx.refresh({ partialGraph: { nodes: [payload.key] }, skipIndexation: false, schedule: true });
  };

  activeListeners.dropNodeGraphUpdate = (payload: { key: string }): void => {
    ctx.removeNode(payload.key);
    ctx.refresh({ schedule: true });
  };

  activeListeners.addEdgeGraphUpdate = (payload: { key: string }): void => {
    const edge = payload.key;
    ctx.edgeGroups.register(edge);
    ctx.addEdge(edge);
    const siblings = ctx.edgeGroups.getSiblings(edge);
    for (const sib of siblings) ctx.addEdge(sib);
    ctx.refresh({ partialGraph: { edges: [edge, ...siblings] }, schedule: true });
  };

  activeListeners.updateEdgeGraphUpdate = (payload: { key: string }): void => {
    ctx.refresh({ partialGraph: { edges: [payload.key] }, skipIndexation: false, schedule: true });
  };

  activeListeners.dropEdgeGraphUpdate = (payload: { key: string }): void => {
    const edge = payload.key;
    const siblings = ctx.edgeGroups.getSiblings(edge);
    ctx.edgeGroups.unregister(edge);
    ctx.removeEdge(edge);
    for (const sib of siblings) ctx.addEdge(sib);
    ctx.refresh({ schedule: true });
  };

  activeListeners.clearEdgesGraphUpdate = (): void => {
    ctx.clearEdgeState();
    ctx.clearEdgeIndices();
    ctx.refresh({ schedule: true });
  };

  activeListeners.clearGraphUpdate = (): void => {
    ctx.clearEdgeState();
    ctx.clearNodeState();
    ctx.clearEdgeIndices();
    ctx.clearNodeIndices();
    ctx.refresh({ schedule: true });
  };

  graph.on("nodeAdded", activeListeners.addNodeGraphUpdate);
  graph.on("nodeDropped", activeListeners.dropNodeGraphUpdate);
  graph.on("nodeAttributesUpdated", activeListeners.updateNodeGraphUpdate);
  graph.on("eachNodeAttributesUpdated", activeListeners.eachNodeAttributesUpdatedGraphUpdate);
  graph.on("edgeAdded", activeListeners.addEdgeGraphUpdate);
  graph.on("edgeDropped", activeListeners.dropEdgeGraphUpdate);
  graph.on("edgeAttributesUpdated", activeListeners.updateEdgeGraphUpdate);
  graph.on("eachEdgeAttributesUpdated", activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
  graph.on("edgesCleared", activeListeners.clearEdgesGraphUpdate);
  graph.on("cleared", activeListeners.clearGraphUpdate);
}

export function unbindGraphHandlers(graph: Graph, activeListeners: PlainObject<Listener>): void {
  graph.removeListener("nodeAdded", activeListeners.addNodeGraphUpdate);
  graph.removeListener("nodeDropped", activeListeners.dropNodeGraphUpdate);
  graph.removeListener("nodeAttributesUpdated", activeListeners.updateNodeGraphUpdate);
  graph.removeListener("eachNodeAttributesUpdated", activeListeners.eachNodeAttributesUpdatedGraphUpdate);
  graph.removeListener("edgeAdded", activeListeners.addEdgeGraphUpdate);
  graph.removeListener("edgeDropped", activeListeners.dropEdgeGraphUpdate);
  graph.removeListener("edgeAttributesUpdated", activeListeners.updateEdgeGraphUpdate);
  graph.removeListener("eachEdgeAttributesUpdated", activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
  graph.removeListener("edgesCleared", activeListeners.clearEdgesGraphUpdate);
  graph.removeListener("cleared", activeListeners.clearGraphUpdate);
}
