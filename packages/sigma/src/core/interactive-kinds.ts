/**
 * Sigma.js Interactive Kinds
 * ==========================
 *
 * Internal abstraction over the things sigma can pick and hover: nodes, edges,
 * node labels, edge labels. Each kind has a metadata + handler entry in
 * `KIND_REGISTRY`. Dispatch helpers (`setHover`, `getCursor`, `eventName`, …)
 * route through this table by kind name; nothing in the rest of the codebase
 * branches on kind.
 *
 * The picking state owns all ID encoding: `pickingIdOf` is the only thing
 * other modules ever read. Future interactive kinds (autonomous or
 * parent-linked) plug in by adding a registry entry. The dispatch loops and
 * the allocator don't need to change.
 *
 * @module
 */
import { MouseInteraction, SigmaEventPayload } from "../types";
import { BaseEdgeState, BaseNodeState } from "../types/styles";
import { hasAnyEnabled, hasAnySeparate, resolveLabelMode } from "./label-events";
import { AnyInternals } from "./sigma-internals";

export type KindName = "node" | "edge" | "nodeLabel" | "edgeLabel";

/** A resolved pick. The lookup table maps picking IDs to these. */
export interface Hit {
  kind: KindName;
  key: string;
}

/** Per-kind metadata + behavior. */
export interface KindEntry {
  /** For parent-linked kinds, the parent kind whose key this kind borrows. */
  parent: KindName | null;
  /** Event suffix: `${verb}${eventSuffix}` (e.g. enterNode, clickNodeLabel). */
  eventSuffix: string;
  /** Property name under which `Hit.key` lives in event payloads. */
  payloadKey: "node" | "edge";
  /** Does this kind allocate picking IDs this frame? */
  isEnabled(i: AnyInternals): boolean;
  /** Does this kind's renderer write picking IDs this frame? */
  writesPickingThisFrame(i: AnyInternals): boolean;
  /** Flip the kind's hover flag on the (parent) item state. */
  setHover(i: AnyInternals, key: string, on: boolean): void;
  /** Cursor to show when an item of this kind is hovered. */
  getCursor(i: AnyInternals, key: string): string | undefined;
  /** Optional per-verb routing (labels: extend/separate/false). */
  resolveForVerb?(hit: Hit, verb: MouseInteraction, i: AnyInternals): Hit | null;
  /** Optional post-filter: drop hits for items that shouldn't react. */
  isHitValid?(i: AnyInternals, key: string): boolean;
}

export const KIND_REGISTRY: Record<KindName, KindEntry> = {
  node: {
    parent: null,
    eventSuffix: "Node",
    payloadKey: "node",
    isEnabled: () => true,
    writesPickingThisFrame: () => true,
    setHover: (i, k, on) => i.setNodeState(k, { isHovered: on } as Partial<BaseNodeState>),
    getCursor: (i, k) => i.nodeDataCache[k]?.cursor,
    isHitValid: (i, k) => i.nodeDataCache[k]?.visibility !== "hidden",
  },
  edge: {
    parent: null,
    eventSuffix: "Edge",
    payloadKey: "edge",
    isEnabled: (internals) => !!internals.settings.enableEdgeEvents,
    writesPickingThisFrame: (internals) => !!internals.settings.enableEdgeEvents,
    setHover: (internals, k, on) => internals.setEdgeState(k, { isHovered: on } as Partial<BaseEdgeState>),
    getCursor: (internals, k) => internals.edgeDataCache[k]?.cursor,
  },
  nodeLabel: {
    parent: "node",
    eventSuffix: "NodeLabel",
    payloadKey: "node",
    isEnabled: (internals) => hasAnySeparate(internals.settings.nodeLabelEvents),
    writesPickingThisFrame: (internals) => hasAnyEnabled(internals.settings.nodeLabelEvents),
    setHover: (internals, k, on) => internals.setNodeState(k, { isLabelHovered: on } as Partial<BaseNodeState>),
    getCursor: (internals, k) => internals.nodeDataCache[k]?.labelCursor,
    resolveForVerb: (hit, verb, internals) => {
      const mode = resolveLabelMode(internals.settings.nodeLabelEvents, verb);
      if (mode === false) return null;
      if (mode === "extend") return { kind: "node", key: hit.key };
      return hit;
    },
  },
  edgeLabel: {
    parent: "edge",
    eventSuffix: "EdgeLabel",
    payloadKey: "edge",
    isEnabled: (internals) => hasAnySeparate(internals.settings.edgeLabelEvents),
    writesPickingThisFrame: (internals) => hasAnyEnabled(internals.settings.edgeLabelEvents),
    setHover: (internals, k, on) => internals.setEdgeState(k, { isLabelHovered: on } as Partial<BaseEdgeState>),
    getCursor: (internals, k) => internals.edgeDataCache[k]?.labelCursor,
    resolveForVerb: (hit, verb, internals) => {
      const mode = resolveLabelMode(internals.settings.edgeLabelEvents, verb);
      if (mode === false) return null;
      if (mode === "extend") return { kind: "edge", key: hit.key };
      return hit;
    },
  },
};

/** Kind names in allocation order. Parents come before their children. */
export const KIND_NAMES: KindName[] = ["node", "edge", "nodeLabel", "edgeLabel"];

// ============================================================================
// Picking state - sole authority on picking-ID encoding
// ============================================================================

/**
 * Picking state, rebuilt incrementally during each render cycle. Owns the
 * full picking-ID layout; programs query `pickingIdOf` to know what to write,
 * and `lookup[id]` resolves a framebuffer pixel back to a hit.
 */
export interface PickingState {
  /** lookup[id] = hit at picking ID `id`, or null. Index 0 reserved. */
  lookup: (Hit | null)[];
  /** Per-kind id maps. */
  idsByKind: Record<KindName, Map<string, number>>;
  /** Internal allocation counter; advanced by `registerItem`. */
  nextId: number;
}

export function createPickingState(): PickingState {
  return {
    lookup: [null],
    idsByKind: { node: new Map(), edge: new Map(), nodeLabel: new Map(), edgeLabel: new Map() },
    nextId: 1,
  };
}

/** The picking ID for `(kind, key)`, or 0 if unallocated. */
export function pickingIdOf(state: PickingState, kind: KindName, key: string): number {
  return state.idsByKind[kind].get(key) ?? 0;
}

/**
 * Clear `kind`'s allocations and any descendant (label-style) kind, and reset
 * the allocation counter to where `kind`'s range begins (= total size of all
 * kinds that come before it). Call before iterating items to (re)assign IDs.
 */
export function resetKind(state: PickingState, kind: KindName): void {
  for (const k of KIND_NAMES) {
    if (k === kind || KIND_REGISTRY[k].parent === kind) {
      for (const id of state.idsByKind[k].values()) state.lookup[id] = null;
      state.idsByKind[k] = new Map();
    }
  }
  let start = 1;
  for (const k of KIND_NAMES) {
    if (k === kind) break;
    start += state.idsByKind[k].size;
  }
  state.nextId = start;
}

/** Assign the next available picking ID to `(kind, key)`. Returns the ID. */
export function registerItem(state: PickingState, kind: KindName, key: string): number {
  const id = state.nextId++;
  state.idsByKind[kind].set(key, id);
  state.lookup[id] = { kind, key };
  return id;
}

/**
 * After node + edge IDs are assigned, give each enabled parent-linked kind
 * its own contiguous range right after the existing allocation. Label kinds
 * borrow their parent's keys in the parent's iteration order.
 */
export function allocateLabelIds(state: PickingState, i: AnyInternals): void {
  // Clear any prior label allocations.
  for (const name of KIND_NAMES) {
    if (KIND_REGISTRY[name].parent === null) continue;
    for (const id of state.idsByKind[name].values()) state.lookup[id] = null;
    state.idsByKind[name] = new Map();
  }

  // `nextId` is stale after a partial process: restart after the highest parent ID
  state.nextId = 1;
  for (const name of KIND_NAMES) {
    if (KIND_REGISTRY[name].parent !== null) continue;
    for (const id of state.idsByKind[name].values()) if (id >= state.nextId) state.nextId = id + 1;
  }

  for (const name of KIND_NAMES) {
    const entry = KIND_REGISTRY[name];
    if (entry.parent === null || !entry.isEnabled(i)) continue;
    for (const parentKey of state.idsByKind[entry.parent].keys()) {
      state.idsByKind[name].set(parentKey, state.nextId);
      state.lookup[state.nextId] = { kind: name, key: parentKey };
      state.nextId++;
    }
  }
}

/** Do two allocations map every (kind, key) to the same picking ID? */
export function samePickingAllocation(
  a: Record<KindName, Map<string, number>>,
  b: Record<KindName, Map<string, number>>,
): boolean {
  for (const kind of KIND_NAMES) {
    const mapA = a[kind];
    const mapB = b[kind];
    if (mapA === mapB) continue;
    if (mapA.size !== mapB.size) return false;
    for (const [key, id] of mapA) if (mapB.get(key) !== id) return false;
  }
  return true;
}

// ============================================================================
// Dispatch helpers - called by event-handlers and sigma
// ============================================================================

export function setHover(i: AnyInternals, hit: Hit, on: boolean): void {
  KIND_REGISTRY[hit.kind].setHover(i, hit.key, on);
}

export function getCursor(i: AnyInternals, hit: Hit): string | undefined {
  return KIND_REGISTRY[hit.kind].getCursor(i, hit.key);
}

export function eventName(kind: KindName, verb: MouseInteraction): string {
  return `${verb}${KIND_REGISTRY[kind].eventSuffix}`;
}

export function eventPayload(hit: Hit, base: SigmaEventPayload): Record<string, unknown> {
  return { ...base, [KIND_REGISTRY[hit.kind].payloadKey]: hit.key };
}

export function resolveForVerb(i: AnyInternals, hit: Hit, verb: MouseInteraction): Hit | null {
  const resolver = KIND_REGISTRY[hit.kind].resolveForVerb;
  return resolver ? resolver(hit, verb, i) : hit;
}

export function isHitValid(i: AnyInternals, hit: Hit): boolean {
  const check = KIND_REGISTRY[hit.kind].isHitValid;
  return check ? check(i, hit.key) : true;
}

/** Kinds whose hover state must clear when an item of `target` is removed. */
export function kindsDependingOn(target: KindName): KindName[] {
  return KIND_NAMES.filter((n) => n === target || KIND_REGISTRY[n].parent === target);
}
