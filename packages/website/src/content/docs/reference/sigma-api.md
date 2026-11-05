---
title: Sigma API
sidebar:
  label: Sigma API
---

The `Sigma` class is the main entry point. It takes a graphology graph, a DOM container, and an options object.

## Constructor

```typescript
new Sigma(graph, container, options?)
```

| Parameter   | Type          | Description                                |
| ----------- | ------------- | ------------------------------------------ |
| `graph`     | `Graph`       | A graphology graph instance                |
| `container` | `HTMLElement` | DOM element with explicit width and height |
| `options`   | `object`      | Optional configuration (see below)         |

### Options

| Property           | Type                | Description                                                                                                       |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `primitives`       | `P`                 | Shapes, layers, paths, extremities, depth layers. See [Primitives schema](/reference/primitives-schema/)          |
| `styles`           | `StylesDeclaration` | Style rules for nodes and edges. See [Styles and primitives](/concepts/styles-and-primitives/)                    |
| `settings`         | `Partial<Settings>` | Behavior and performance settings. See [Settings](/reference/settings/)                                           |
| `nodeReducer`      | `function`          | Escape hatch for complex node styling. `(key, data, attrs, state, graphState, graph) => Partial<NodeDisplayData>` |
| `edgeReducer`      | `function`          | Same shape as `nodeReducer`, for edges. Returns `Partial<EdgeDisplayData>`.                                       |
| `customNodeState`  | `NS`                | Runtime default values for custom node state fields                                                               |
| `customEdgeState`  | `ES`                | Runtime default values for custom edge state fields                                                               |
| `customGraphState` | `GS`                | Runtime default values for custom graph state fields                                                              |

### Generic type parameters

```typescript
Sigma<N, E, G, NS, ES, GS, P>;
```

| Parameter | Extends                 | Default                 | Description             |
| --------- | ----------------------- | ----------------------- | ----------------------- |
| `N`       | `Attributes`            | `Attributes`            | Node attributes type    |
| `E`       | `Attributes`            | `Attributes`            | Edge attributes type    |
| `G`       | `Attributes`            | `Attributes`            | Graph attributes type   |
| `NS`      | `{}`                    | `{}`                    | Custom node state type  |
| `ES`      | `{}`                    | `{}`                    | Custom edge state type  |
| `GS`      | `{}`                    | `{}`                    | Custom graph state type |
| `P`       | `PrimitivesDeclaration` | `PrimitivesDeclaration` | Primitives type         |

:::note
Most of the time, these generics will be inferred from Sigma's constructor arguments:

- `N`, `E` and `G` are inferred from the given `graph: Graph<N, E, G>`
- `NS`, `ES` and `GS` are inferred from the given `customNodeState`, `customEdgeState` and `customGraphState`
- `P` is inferred from the given `primitives` object

:::

## Lifecycle

| Method           | Returns | Description                                                         |
| ---------------- | ------- | ------------------------------------------------------------------- |
| `kill()`         | `void`  | Destroy the instance: release WebGL, remove listeners, clean up DOM |
| `resize(force?)` | `this`  | Resize to container dimensions. `force` bypasses size check         |
| `clear()`        | `this`  | Clear all canvases (emits `beforeClear`/`afterClear`)               |

## Rendering

| Method                   | Returns | Description                                                                                                  |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------ |
| `refresh(opts?)`         | `this`  | Re-process data and render. Options: `{ partialGraph?, skipIndexation?, schedule? }`                         |
| `scheduleRefresh(opts?)` | `this`  | Debounced version of `refresh` (always sets `schedule: true`). Options: `{ partialGraph?, skipIndexation? }` |
| `scheduleRender()`       | `this`  | Debounced: schedule a render-only pass for the next animation frame (no re-processing)                       |

## Node state

| Method                       | Returns | Description                                               |
| ---------------------------- | ------- | --------------------------------------------------------- |
| `getNodeState(key)`          | `NS`    | Get a node's current state                                |
| `setNodeState(key, state)`   | `this`  | Update a node's state (partial merge) and schedule render |
| `setNodesState(keys, state)` | `this`  | Update multiple nodes' state at once                      |

## Edge state

| Method                       | Returns | Description                                                |
| ---------------------------- | ------- | ---------------------------------------------------------- |
| `getEdgeState(key)`          | `ES`    | Get an edge's current state                                |
| `setEdgeState(key, state)`   | `this`  | Update an edge's state (partial merge) and schedule render |
| `setEdgesState(keys, state)` | `this`  | Update multiple edges' state at once                       |

## Graph state

| Method                 | Returns | Description                                                |
| ---------------------- | ------- | ---------------------------------------------------------- |
| `getGraphState()`      | `GS`    | Get the global graph state                                 |
| `setGraphState(state)` | `this`  | Update the graph state (partial merge) and schedule render |

## Display data

| Method                     | Returns                        | Description                                                        |
| -------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| `getNodeDisplayData(key)`  | `NodeDisplayData \| undefined` | Get computed display data for a node (position, size, color, etc.) |
| `getEdgeDisplayData(key)`  | `EdgeDisplayData \| undefined` | Get computed display data for an edge                              |
| `getNodeDisplayedLabels()` | `Set<string>`                  | Get node keys whose labels are currently visible                   |
| `getEdgeDisplayedLabels()` | `Set<string>`                  | Get edge keys whose labels are currently visible                   |

## Coordinate conversion

| Method                          | Returns       | Description                                                                    |
| ------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| `graphToViewport(coords)`       | `Coordinates` | Convert graph-space coordinates to screen pixels                               |
| `viewportToGraph(coords)`       | `Coordinates` | Convert screen pixels to graph-space coordinates                               |
| `framedGraphToViewport(coords)` | `Coordinates` | Convert normalized (0–1) graph space to screen pixels                          |
| `viewportToFramedGraph(coords)` | `Coordinates` | Convert screen pixels to normalized graph space                                |
| `getGraphToViewportRatio()`     | `number`      | Distance multiplier between graph and viewport spaces                          |
| `viewRectangle()`               | `object`      | Get the visible area in framed graph coordinates: `{ x1, y1, x2, y2, height }` |

The four conversion methods above accept an optional `override` parameter to use custom camera state, matrix, or dimensions instead of the current ones.

## Bounding box

| Method                | Returns                    | Description                                 |
| --------------------- | -------------------------- | ------------------------------------------- |
| `getBBox()`           | `{ x: Extent; y: Extent }` | Get auto-computed graph bounding box        |
| `getCustomBBox()`     | `object \| null`           | Get custom bounding box override, if set    |
| `setCustomBBox(bbox)` | `this`                     | Override the bounding box (`null` to reset) |

:::note
In sigma v3, the most common use-case of these custom bounding boxes management was to freeze the auto-computed bounding
box after the first rendering, especially for applications with nodes dragging capabilities.

Sigma v4 has a shortcut for that, using the `autoRescale: 'once'` setting.
:::

## Settings

| Method                   | Returns       | Description                                           |
| ------------------------ | ------------- | ----------------------------------------------------- |
| `getSettings()`          | `Settings`    | Get a copy of all current settings                    |
| `getSetting(key)`        | `Settings[K]` | Get a single setting value                            |
| `setSetting(key, value)` | `this`        | Set a single setting and schedule refresh             |
| `updateSetting(key, fn)` | `this`        | Update a setting with a function and schedule refresh |
| `setSettings(partial)`   | `this`        | Set multiple settings at once                         |

## Graph and container

| Method                 | Returns       | Description                                       |
| ---------------------- | ------------- | ------------------------------------------------- |
| `getGraph()`           | `Graph`       | Get the current graph instance                    |
| `setGraph(graph)`      | `this`        | Replace the graph, rebind handlers, and refresh   |
| `getContainer()`       | `HTMLElement` | Get the DOM container element                     |
| `getDimensions()`      | `Dimensions`  | Get renderer pixel dimensions `{ width, height }` |
| `getGraphDimensions()` | `Dimensions`  | Get graph extent dimensions                       |

## Camera and input

| Method              | Returns       | Description                                                       |
| ------------------- | ------------- | ----------------------------------------------------------------- |
| `getCamera()`       | `Camera`      | Get the camera instance. See [Camera API](/reference/camera-api/) |
| `setCamera(camera)` | `this`        | Replace the camera instance                                       |
| `getMouseCaptor()`  | `MouseCaptor` | Get the mouse event captor                                        |
| `getTouchCaptor()`  | `TouchCaptor` | Get the touch event captor                                        |

## Utilities

| Method                           | Returns        | Description                                                             |
| -------------------------------- | -------------- | ----------------------------------------------------------------------- |
| `scaleSize(size?, cameraRatio?)` | `number`       | Convert a size to viewport scale based on zoom and `itemSizesReference` |
| `getStagePadding()`              | `number`       | Get padding applied when `autoRescale` is enabled                       |
| `getRenderParams()`              | `RenderParams` | Get current render parameters (matrix, dimensions, ratios)              |
