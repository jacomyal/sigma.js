---
title: Depth and z-order
description: How sigma decides what is painted on top of what.
---

Sigma v4 controls rendering order through two style properties that work together:

- **`depth`**: a _named bucket_ from `primitives.depthLayers`. Coarse, categorical.
- **`zIndex`**: a numeric sub-order _within_ a bucket. Fine, continuous.

Everything renders into the same WebGL canvas. There is no separate node-layer and edge-layer pass: each named bucket
is painted in turn, and within a bucket sigma paints sub-elements (edges, labels, nodes) in a fixed order.

## The stack

The default `depthLayers` declaration is `["edges", "nodes", "topEdges", "topNodes"]`, painted back-to-front:

```
top of the stack  ┌─ topNodes ── hovered nodes + their labels
                  │  topEdges ── hovered / highlighted edges + their labels
                  │  nodes    ── regular nodes + their labels
bottom of stack   └─ edges    ── regular edges + their labels
```

You can declare any number of buckets, in any order, with any names:

```typescript
primitives: {
  depthLayers: ["edges", "nodes", "activeEdges", "activeNodes", "topNodes"],
}
```

A node or edge is placed into a bucket with the `depth` style property, which must reference a name from `depthLayers`:

```typescript
styles: {
  nodes: [{ whenState: "isActive", then: { depth: "activeNodes" } }],
}
```

## Sub-order within a bucket: `zIndex`

`zIndex` orders items _inside_ a single bucket. Items in a later bucket always paint above items in an earlier one,
regardless of `zIndex`. Inside one bucket, higher `zIndex` paints on top.

The combined sort key is, conceptually:

```
sortKey = depthLayerIndex * maxDepthLevels + zIndex
```

`zIndex` is floored and clamped to `[0, maxDepthLevels - 1]` (default `maxDepthLevels = 20`, see
[`maxDepthLevels`](/reference/settings/)). If you need more than 20 distinct sub-orders within one bucket, raise the
setting.

Use `zIndex` when you want a _continuous_ ordering (e.g. "sort nodes by degree"). Use `depth` when you want a
_categorical_ bucket that interactions can promote items into.

## Paint order within a bucket

For each bucket, sigma paints in this fixed order:

1. Custom WebGL layer bound to this bucket (see [WebGL layers](/how-to/layers/webgl-layers/))
2. Edges in this bucket
3. Edge label backgrounds, then edge labels (`labelDepth === bucket`)
4. Backdrops for nodes whose `depth === bucket`
5. Nodes in this bucket
6. Label attachments (`labelDepth === bucket`)
7. Node label backgrounds, then node labels (`labelDepth === bucket`)

Two consequences worth highlighting:

- **Edge labels render below nodes of the same bucket.** If you want a label on top of unrelated nodes, route the label
  into a higher bucket with `labelDepth`.
- **Nodes always render above edges of the same bucket.** To put an edge above a node, the edge needs to live in a
  higher bucket (this is the main reason `topEdges` sits above `nodes` in the default declaration).

## Labels in a different bucket: `labelDepth`

Each item has two depth properties: `depth` for the geometry, `labelDepth` for the label. By default `labelDepth`
mirrors `depth`, so if a rule sets `depth` without `labelDepth`, the label follows.

Override `labelDepth` to detach the label from its parent:

```typescript
styles: {
  nodes: [
    // Nodes geometry stays in "nodes", but node labels paint above everything else:
    { labelDepth: "topNodes" },
  ],
}
```

This is the v4 answer to the recurring v3 issue of "labels hidden under unrelated nodes".

## What sigma sets by default

The built-in `DEFAULT_STYLES` already does the most common interaction:

| State                       | Effect                                    |
| --------------------------- | ----------------------------------------- |
| Hovered node                | `depth: "topNodes"`, `zIndex: 1`          |
| Hovered or highlighted edge | `depth: "topEdges"`, `zIndex: 1`          |
| Otherwise                   | `depth: "nodes"` / `"edges"`, `zIndex: 0` |

If you spread `DEFAULT_STYLES.nodes` into your rules, you keep this behavior for free. Add further rules to promote
items into your own buckets.

## Cost model

- Each named bucket costs **one node draw call and one edge draw call** (skipped when the bucket is empty; occasionally
  split into a few contiguous fragments when items have recently moved between buckets). Inside a bucket, `zIndex`
  changes are reorganized on the CPU side only. No extra GPU cost.
- Moving an item between buckets or `zIndex` levels updates a single bucket; it does not re-process the rest of the
  graph.
- Adding buckets is cheap. Adding hundreds of buckets is not. Keep `depthLayers` to a handful of named values, and use
  `zIndex` for the fine-grained order.

## Choosing between `depth` and `zIndex`

| Question                                                    | Answer                      |
| ----------------------------------------------------------- | --------------------------- |
| "Bring some items on top during an interaction"             | `depth`                     |
| "Render some edges above some nodes"                        | `depth` (separate buckets)  |
| "Render labels above nodes from other clusters"             | `labelDepth`                |
| "Sort nodes by a numeric attribute (e.g. degree)"           | `zIndex`                    |
| "Render type-A nodes always above type-B nodes"             | `depth` (a bucket per type) |
| "I have one item I always want on top, regardless of state" | `depth: "topNodes"`         |

## Common recipes

### Pin selected items on top

```typescript
primitives: {
  depthLayers: ["edges", "nodes", "topEdges", "topNodes"],
},
styles: {
  nodes: [
    DEFAULT_STYLES.nodes,
    { whenState: "isSelected", then: { depth: "topNodes" } },
  ],
}
```

### Sort nodes by degree

```typescript
styles: {
  nodes: [
    {
      zIndex: { attribute: "degree", min: 0, max: 19, minValue: 0, maxValue: 100 },
    },
  ],
}
```

`zIndex` is clamped to `[0, maxDepthLevels - 1]`, so bind the numeric range explicitly to keep within bounds (or raise
`maxDepthLevels`).

### Labels above unrelated nodes

```typescript
primitives: {
  depthLayers: ["edges", "nodes", "topNodes"],
},
styles: {
  nodes: [
    // Nodes geometry stays in "nodes" so other nodes can still overlap:
    { depth: "nodes", labelDepth: "topNodes" },
  ],
}
```
