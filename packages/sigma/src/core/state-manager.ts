/**
 * Sigma.js State Manager
 * ======================
 *
 * Owns all per-item and graph-level state: node states, edge states,
 * graph state, hover tracking, and the dirty sets that drive selective
 * style refresh. Sigma calls into StateManager to read/mutate state;
 * StateManager calls back into Sigma only via the scheduleRefresh callback.
 *
 * @module
 */
import {
  BaseEdgeState,
  BaseGraphState,
  BaseNodeState,
  FullEdgeState,
  FullGraphState,
  FullNodeState,
  createEdgeState,
  createGraphState,
  createNodeState,
} from "../types/styles";
import { hasNewPartialProps } from "../utils";
import { Hit, KindName, kindsDependingOn } from "./interactive-kinds";

export class StateManager<NS = {}, ES = {}, GS = {}> {
  // Per-item state maps (lazily populated on first access).
  private nodeStates: Map<string, FullNodeState<NS>> = new Map();
  private edgeStates: Map<string, FullEdgeState<ES>> = new Map();

  // Graph-level state, kept up to date by updateGraphStateFrom* methods.
  graphState: FullGraphState<GS>;

  // At most one item is hovered at a time, of any kind.
  hovered: Hit | null = null;

  // Dirty sets consumed by sigma's refreshState / render cycle.
  dirtyNodes: Set<string> = new Set();
  dirtyEdges: Set<string> = new Set();
  graphStateChanged = false;
  // True when any item state changed and graph-level flags (hasHovered, etc.)
  // need to be recomputed before the next flush.
  private graphStateFlagsDirty = false;

  constructor(
    private scheduleRefresh: () => void,
    private customNodeStateDefaults?: NS,
    private customEdgeStateDefaults?: ES,
    private customGraphStateDefaults?: GS,
  ) {
    this.graphState = createGraphState<GS>(customGraphStateDefaults);
  }

  // State accessors
  getNodeState(key: string): FullNodeState<NS> {
    let state = this.nodeStates.get(key);
    if (!state) {
      state = createNodeState<NS>(this.customNodeStateDefaults);
      this.nodeStates.set(key, state);
    }
    return state;
  }
  getEdgeState(key: string): FullEdgeState<ES> {
    let state = this.edgeStates.get(key);
    if (!state) {
      state = createEdgeState<ES>(this.customEdgeStateDefaults);
      this.edgeStates.set(key, state);
    }
    return state;
  }
  getGraphState(): FullGraphState<GS> {
    this.flushGraphStateFlags();
    return this.graphState;
  }

  // State mutations (public API, exposed on Sigma)
  setNodeState(key: string, state: Partial<BaseNodeState> | Partial<FullNodeState<NS>>): void {
    const currentState = this.getNodeState(key);
    if (!hasNewPartialProps(currentState as Record<string, unknown>, state as Record<string, unknown>)) return;

    const newState = { ...currentState, ...state };
    this.nodeStates.set(key, newState);
    this.dirtyNodes.add(key);
    this.updateHoveredNodeTracking(key, currentState, newState);
    this.graphStateFlagsDirty = true;
    this.scheduleRefresh();
  }
  setEdgeState(key: string, state: Partial<BaseEdgeState> | Partial<FullEdgeState<ES>>): void {
    const currentState = this.getEdgeState(key);
    if (!hasNewPartialProps(currentState as Record<string, unknown>, state as Record<string, unknown>)) return;

    const newState = { ...currentState, ...state };
    this.edgeStates.set(key, newState);
    this.dirtyEdges.add(key);
    this.updateHoveredEdgeTracking(key, currentState, newState);
    this.graphStateFlagsDirty = true;
    this.scheduleRefresh();
  }
  setGraphState(state: Partial<BaseGraphState> | Partial<FullGraphState<GS>>): void {
    if (!hasNewPartialProps(this.graphState as Record<string, unknown>, state as Record<string, unknown>)) return;

    const merged = { ...this.graphState, ...state } as FullGraphState<GS>;
    merged.isIdle = !merged.isPanning && !merged.isZooming && !merged.isDragging;
    this.graphState = merged;
    this.graphStateChanged = true;
    this.scheduleRefresh();
  }
  setNodesState(keys: string[], state: Partial<BaseNodeState> | Partial<FullNodeState<NS>>): void {
    let changed = false;
    for (const key of keys) {
      const currentState = this.getNodeState(key);
      if (!hasNewPartialProps(currentState as Record<string, unknown>, state as Record<string, unknown>)) continue;
      const newState = { ...currentState, ...state };
      this.nodeStates.set(key, newState);
      this.dirtyNodes.add(key);
      this.updateHoveredNodeTracking(key, currentState, newState);
      changed = true;
    }
    if (changed) {
      this.graphStateFlagsDirty = true;
      this.scheduleRefresh();
    }
  }
  setEdgesState(keys: string[], state: Partial<BaseEdgeState> | Partial<FullEdgeState<ES>>): void {
    let changed = false;
    for (const key of keys) {
      const currentState = this.getEdgeState(key);
      if (!hasNewPartialProps(currentState as Record<string, unknown>, state as Record<string, unknown>)) continue;
      const newState = { ...currentState, ...state };
      this.edgeStates.set(key, newState);
      this.dirtyEdges.add(key);
      this.updateHoveredEdgeTracking(key, currentState, newState);
      changed = true;
    }
    if (changed) {
      this.graphStateFlagsDirty = true;
      this.scheduleRefresh();
    }
  }

  // Lifecycle: when an item is removed, clear hover for that item and any
  // dependent kind (e.g. a node's removal clears both `node` and `nodeLabel`).
  removeNode(key: string): void {
    this.nodeStates.delete(key);
    this.dirtyNodes.delete(key);
    this.clearHoveredFor("node", key);
  }
  removeEdge(key: string): void {
    this.edgeStates.delete(key);
    this.dirtyEdges.delete(key);
    this.clearHoveredFor("edge", key);
  }

  pruneNodes(keep: (key: string) => boolean): void {
    for (const key of this.nodeStates.keys()) if (!keep(key)) this.removeNode(key);
  }
  pruneEdges(keep: (key: string) => boolean): void {
    for (const key of this.edgeStates.keys()) if (!keep(key)) this.removeEdge(key);
  }

  clearNodes(): void {
    this.nodeStates.clear();
    this.dirtyNodes.clear();
    this.clearHoveredForKinds(kindsDependingOn("node"));
  }
  clearEdges(): void {
    this.edgeStates.clear();
    this.dirtyEdges.clear();
    this.clearHoveredForKinds(kindsDependingOn("edge"));
  }
  resetGraphState(): void {
    this.graphState = createGraphState<GS>(this.customGraphStateDefaults);
    this.graphStateChanged = false;
    this.graphStateFlagsDirty = false;
  }
  clearDirtyTracking(): void {
    this.dirtyNodes.clear();
    this.dirtyEdges.clear();
    this.graphStateChanged = false;
  }

  setHovered(hit: Hit | null): void {
    this.hovered = hit;
  }

  private clearHoveredFor(target: KindName, key: string): void {
    if (this.hovered && this.hovered.key === key && kindsDependingOn(target).includes(this.hovered.kind)) {
      this.hovered = null;
    }
  }
  private clearHoveredForKinds(kinds: KindName[]): void {
    if (this.hovered && kinds.includes(this.hovered.kind)) this.hovered = null;
  }

  // Graph flag computation
  updateGraphStateFromNodes(): void {
    let hasHovered = false;
    let hasHighlighted = false;
    let isDragging = false;

    for (const [, state] of this.nodeStates) {
      if (state.isHovered) hasHovered = true;
      if (state.isHighlighted) hasHighlighted = true;
      if (state.isDragged) isDragging = true;
      if (hasHovered && hasHighlighted && isDragging) break;
    }

    // Also check edges for hover
    if (!hasHovered && this.hovered?.kind === "edge") hasHovered = true;

    const isIdle = !this.graphState.isPanning && !this.graphState.isZooming && !isDragging;

    if (
      this.graphState.hasHovered !== hasHovered ||
      this.graphState.hasHighlighted !== hasHighlighted ||
      this.graphState.isDragging !== isDragging ||
      this.graphState.isIdle !== isIdle
    ) {
      this.graphStateChanged = true;
    }

    this.graphState = { ...this.graphState, hasHovered, hasHighlighted, isDragging, isIdle };
  }
  updateGraphStateFromEdges(): void {
    let hasHovered = this.hovered?.kind === "node";

    if (!hasHovered) {
      for (const [, state] of this.edgeStates) {
        if (state.isHovered) {
          hasHovered = true;
          break;
        }
      }
    }

    if (this.graphState.hasHovered !== hasHovered) {
      this.graphStateChanged = true;
    }

    this.graphState = { ...this.graphState, hasHovered };
  }
  flushGraphStateFlags(): void {
    if (!this.graphStateFlagsDirty) return;
    this.updateGraphStateFromNodes();
    this.updateGraphStateFromEdges();
    this.graphStateFlagsDirty = false;
  }

  // When `isHovered` flips on a node/edge, keep the top-level `hovered` slot
  // consistent (one body-hovered item at a time).
  private updateHoveredNodeTracking(key: string, oldState: FullNodeState<NS>, newState: FullNodeState<NS>): void {
    if (oldState.isHovered === newState.isHovered) return;

    if (newState.isHovered) {
      if (this.hovered?.kind === "node" && this.hovered.key !== key) {
        const prevKey = this.hovered.key;
        const prevState = this.getNodeState(prevKey);
        this.nodeStates.set(prevKey, { ...prevState, isHovered: false });
        this.dirtyNodes.add(prevKey);
      }
      this.hovered = { kind: "node", key };
    } else if (this.hovered?.kind === "node" && this.hovered.key === key) {
      this.hovered = null;
    }
  }
  private updateHoveredEdgeTracking(key: string, oldState: FullEdgeState<ES>, newState: FullEdgeState<ES>): void {
    if (oldState.isHovered === newState.isHovered) return;

    if (newState.isHovered) {
      if (this.hovered?.kind === "edge" && this.hovered.key !== key) {
        const prevKey = this.hovered.key;
        const prevState = this.getEdgeState(prevKey);
        this.edgeStates.set(prevKey, { ...prevState, isHovered: false });
        this.dirtyEdges.add(prevKey);
      }
      this.hovered = { kind: "edge", key };
    } else if (this.hovered?.kind === "edge" && this.hovered.key === key) {
      this.hovered = null;
    }
  }
}
