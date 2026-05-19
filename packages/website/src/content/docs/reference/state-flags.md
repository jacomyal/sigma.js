---
title: State flags
sidebar:
  label: State flags
---

Sigma maintains state for every node, every edge, and the graph as a whole. State flags drive
[conditional styles](/reference/style-value-types/) and can be read or updated at any time.

## Node state

```typescript
interface BaseNodeState {
  isHovered: boolean; // Mouse is over this node (or its label when hover is resolved to "extend" via nodeLabelEvents)
  isLabelHovered: boolean; // Mouse is over this node's label (set when hover is resolved to "separate" via nodeLabelEvents)
  isHidden: boolean; // Node is hidden from rendering
  isHighlighted: boolean; // Node is highlighted (e.g., search result)
  isDragged: boolean; // Node is being dragged
}
```

Default: all `false`.

## Edge state

```typescript
interface BaseEdgeState {
  isHovered: boolean; // Mouse is over this edge (requires enableEdgeEvents, or hover resolved to "extend" via edgeLabelEvents)
  isLabelHovered: boolean; // Mouse is over this edge's label (set when hover is resolved to "separate" via edgeLabelEvents)
  isHidden: boolean; // Edge is hidden from rendering
  isHighlighted: boolean; // Edge is highlighted
}
```

Default: all `false`.

## Graph state

```typescript
interface BaseGraphState {
  isIdle: boolean; // No user interaction in progress
  isPanning: boolean; // User is panning
  isZooming: boolean; // User is zooming
  isDragging: boolean; // User is dragging a node
  hasHovered: boolean; // At least one node or edge is hovered
  hasHighlighted: boolean; // At least one node is highlighted
}
```

Default: `isIdle: true`, all others `false`.

## Reading and writing state

```typescript
// Nodes
renderer.getNodeState("node-1");
renderer.setNodeState("node-1", { isHighlighted: true }); // partial merge
renderer.setNodesState(["n1", "n2"], { isHidden: true }); // batch

// Edges
renderer.getEdgeState("edge-1");
renderer.setEdgeState("edge-1", { isHighlighted: true });
renderer.setEdgesState(["e1", "e2"], { isHidden: true });

// Graph
renderer.getGraphState();
renderer.setGraphState({ hasActiveSubgraph: true });
```

State updates automatically schedule a render. Call `refresh({ skipIndexation: true })` if you need the update to take
effect immediately.

## Custom state via TypeScript generics

Extend the base interfaces to add your own state flags:

```typescript
const renderer = new Sigma(graph, container, {
  customNodeState: {
    isActive: false,
  },
  customGraphState: {
    hasActiveSubgraph: false,
  },
  styles: {
    nodes: [
      { color: { attribute: "color" } },
      {
        when: (_attrs, state, graphState) => graphState.hasActiveSubgraph && !state.isActive,
        then: { color: "#f6f6f6" },
      },
    ],
  },
});

// TypeScript now knows about your custom flags:
renderer.setNodeState("node-1", { isActive: true });
renderer.setGraphState({ hasActiveSubgraph: true });
```

Custom state flags can be used in [style predicates](/reference/style-value-types/) just like built-in ones.
