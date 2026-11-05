---
title: Lifecycle
description: How a sigma instance is created, renders, and is destroyed.
---

This page explains what happens from the moment you create a sigma instance to the moment you destroy it, and how the rendering pipeline works.

## Instantiation

A sigma instance requires three things:

- **A graphology graph**, the data source. Sigma listens to graphology events and re-renders when the graph changes.
- **A DOM container**, that must have non-zero dimensions (width and height). Sigma creates its WebGL canvas and interaction layer inside it.
- **Options (overriding sigma's defaults)**: `primitives`, `styles`, `settings`, `nodeReducer`, `edgeReducer`.

The graph can be replaced later with `setGraph()`.

## The rendering pipeline

Rendering happens in two phases:

1. **Process**: Sigma evaluates style rules against graph attributes and element state, runs reducers, computes display data for every node and edge, and uploads the results to the GPU via data textures.
2. **Render**: Sigma issues WebGL draw calls for each depth layer. Labels, backdrops, and extremities are all drawn in the same pass.

Processing is expensive (it is CPU side, touches every element). Rendering is cheap (it reuses the GPU buffers from the last process). Sigma only re-processes when graph data changes. For state-only changes, sigma takes a lighter path: it re-evaluates styles in-place without rebuilding program arrays, then renders. Camera movements only trigger a render.

:::note
There are various optimizations within sigma that need to be further documented yet, but basically, as a rule of thumb, data updates that only change some items effective styles should cost **much less** than full graph updates.
:::

## Automatic triggers

Sigma re-renders automatically when:

- **The graph changes**: graphology emits events for node/edge additions, removals, and attribute changes.
- **State changes**: `setNodeState`, `setEdgeState`, or `setGraphState` schedule a style re-evaluation and render.
- **Settings change**: `setSetting` or `setSettings` schedule a full refresh.
- **Camera updates**: mouse and touch events update the camera, which triggers a render.
- **The window resizes**: sigma schedules a full refresh. Sigma does not watch the container itself: if only the
  container resizes, sigma notices on its next render. Call `refresh()` yourself to apply the new size right away.

## Manual triggers

Three methods let you trigger rendering manually:

| Method              | What it does                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `refresh()`         | Process + render immediately. Accepts `{ skipIndexation }` to skip spatial index recomputation, and `{ partialGraph }` to process only specific nodes/edges. |
| `scheduleRefresh()` | Debounced: schedules a `refresh()` for the next animation frame. Multiple calls in the same frame are coalesced.                                             |
| `scheduleRender()`  | Debounced: schedules a render-only (no re-processing) for the next frame.                                                                                    |

:::note
Sigma handles most triggers automatically. You can call `scheduleRefresh()` when something changed that sigma cannot observe (for example when a reducer's behavior changes due to external state). You can use `refresh({ skipIndexation: true })` when you know positions are unchanged, to skip the spatial index rebuild. Finally, you can use `scheduleRender()` to force a redraw without reprocessing, for example after updating a custom rendering layer.
:::

## Termination

Call `kill()` to destroy the instance. This releases all WebGL resources, removes event listeners, and cleans up DOM elements. After `kill()`, the instance cannot be reused.
