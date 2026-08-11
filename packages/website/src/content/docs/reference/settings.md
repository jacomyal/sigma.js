---
title: Settings
sidebar:
  label: Settings
---

Settings control camera behavior, interaction, and rendering performance. They are separate from
[styles](/reference/style-properties/), which handle visual appearance.

Pass settings when creating a sigma instance:

```typescript
const renderer = new Sigma(graph, container, {
  settings: {
    renderEdgeLabels: true,
    enableEdgeEvents: true,
    hideEdgesOnMove: true,
  },
});
```

Update settings at runtime with `renderer.setSettings()`:

```typescript
renderer.setSettings({ hideEdgesOnMove: true });
```

## Rendering

| Setting                  | Type      | Default | Description                                                           |
| ------------------------ | --------- | ------- | --------------------------------------------------------------------- |
| `renderLabels`           | `boolean` | `true`  | Whether to render node labels                                         |
| `renderEdgeLabels`       | `boolean` | `false` | Whether to render edge labels                                         |
| `enableEdgeEvents`       | `boolean` | `false` | Enable mouse events on edges (has a performance cost)                 |
| `nodeLabelEvents`        | see below | `false` | Enable node label events.                                             |
| `edgeLabelEvents`        | see below | `false` | Enable edge label events.                                             |
| `stagePadding`           | `number`  | `30`    | Padding around the graph in pixels                                    |
| `minEdgeThickness`       | `number`  | `1.7`   | Minimum edge thickness in pixels                                      |
| `antiAliasingFeather`    | `number`  | `1`     | Anti-aliasing feather amount for WebGL rendering                      |
| `pickingDownSizingRatio` | `number`  | `2`     | Down-sizing ratio for the picking framebuffer                         |
| `nodePickingPadding`     | `number`  | `0`     | Extra pixel padding added around nodes when picking under the cursor  |
| `edgePickingPadding`     | `number`  | `4`     | Extra pixel padding added around edges when picking under the cursor  |
| `labelPickingPadding`    | `number`  | `10`    | Extra pixel padding added around labels when picking under the cursor |

### Label events

`nodeLabelEvents` and `edgeLabelEvents` accept:

```typescript
false | "extend" | "separate" | (Partial<Record<Interaction, false | "extend" | "separate">> & { default?: false | "extend" | "separate" })
```

- `"extend"` routes label hits to the parent node/edge event.
- `"separate"` makes labels standalone targets that fire their own events.
- The `Record` form lets each interaction (click, hover, …) pick its own mode, with an optional `default` fallback.

See [Label events](/reference/events/#label-events) for the full description and an example.

## Camera

| Setting                          | Type                            | Default                                 | Description                                                                        |
| -------------------------------- | ------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| `enableCameraZooming`            | `boolean`                       | `true`                                  | Allow zooming with the mouse wheel                                                 |
| `enableCameraPanning`            | `boolean`                       | `true`                                  | Allow panning by dragging the background                                           |
| `enableCameraRotation`           | `boolean`                       | `true`                                  | Allow camera rotation                                                              |
| `enableCameraMouseRotation`      | `boolean`                       | `true`                                  | Allow mouse-based camera rotation                                                  |
| `minCameraRatio`                 | `number \| null`                | `null`                                  | Minimum zoom level (smaller = more zoomed in). `null` means no limit               |
| `maxCameraRatio`                 | `number \| null`                | `null`                                  | Maximum zoom level (larger = more zoomed out). `null` means no limit               |
| `cameraPanBoundaries`            | see below                       | `null`                                  | Constrain the camera panning area                                                  |
| `gestureTarget`                  | `"graph" \| "shared" \| "page"` | `"graph"`                               | Where wheel and touch gestures are routed (see below)                              |
| `sharedGestureWheelMessage`      | `string`                        | `"Use Ctrl + scroll to zoom the graph"` | Hint shown on plain wheel when `gestureTarget` is `"shared"`. `""` disables it     |
| `sharedGestureAppleWheelMessage` | `string`                        | `"Use ⌘ + scroll to zoom the graph"`    | Same, on Apple devices                                                             |
| `sharedGestureTouchMessage`      | `string`                        | `"Use two fingers to move the graph"`   | Hint shown on one-finger drag when `gestureTarget` is `"shared"`. `""` disables it |

### Gesture target

The `gestureTarget` setting solves the conflict between interacting with the graph and scrolling the page:

- `"graph"` (default): all gestures go to the graph. The page never scrolls over the stage.
- `"shared"`: plain gestures go to the page (wheel scrolls, one-finger touch pans). The graph is reached with Ctrl/⌘ + wheel (trackpad pinches work too) and two-finger touch. A hint overlay tells users how.
- `"page"`: wheel and touch gestures all go to the page. Clicks, taps and mouse drag-panning still reach the graph.

In `"shared"` mode, the hint overlay is a single `<div class="sigma-gesture-hint">` appended to the sigma container,
shown while plain gestures hit the stage. Its texts come from the `sharedGestureWheelMessage` (or
`sharedGestureAppleWheelMessage` on Apple devices, where the modifier is `⌘`) and `sharedGestureTouchMessage`
settings. Its default look comes from a small `<style>` element injected in the container,
scoped (CSS `@scope`) so its rules cannot affect anything outside of it, and layered (CSS `@layer`) so any unlayered
CSS rule of yours overrides it, no `!important` needed. Each at-rule is only used when the browser supports it; on
older browsers the bare rules are injected instead, and custom CSS competes on normal specificity. For instance:

```css
.sigma-gesture-hint {
  background: rgba(255, 255, 255, 0.7);
  color: #333;
  font-style: italic;
}
```

### Camera pan boundaries

The `cameraPanBoundaries` setting accepts:

- `null`: no boundaries (default)
- `true`: automatically constrain to the graph extent
- An object with `tolerance` and/or `boundaries`:

```typescript
{
  tolerance: 0.1,
  boundaries: { x: [-100, 100], y: [-100, 100] }
}
```

## Sizing and scaling

| Setting                   | Type                                 | Default       | Description                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `itemSizesReference`      | `"screen" \| "positions"`            | `"positions"` | Reference space for node/edge sizes. `"positions"`: sizes live in graph space and scale with zoom. `"screen"`: sizes stay constant in screen pixels regardless of zoom. In both modes `zoomToSizeRatioFunction` still applies                                                                                                         |
| `zoomToSizeRatioFunction` | `(ratio: number) => number`          | `Math.sqrt`   | Maps camera zoom ratio to a size scaling factor. Applied in both `"screen"` and `"positions"` modes                                                                                                                                                                                                                                   |
| `autoRescale`             | `boolean \| "once"`                  | `true`        | Automatically rescale the graph to fit the viewport. `"once"` captures the initial extent and freezes it, useful for drag-and-drop scenarios                                                                                                                                                                                          |
| `autoRescaleContent`      | `"positions" \| "nodes" \| "labels"` | `"positions"` | What the auto-rescale fit encloses. `"positions"`: node centers only (default). `"nodes"`: centers and node sizes. `"labels"`: centers, sizes, and labels. Each level contains the previous one. Ignored when `autoRescale` is `false` or a custom bounding box is set. `"labels"` is **expensive** (only use it on small-ish graphs) |

## Label optimization

| Setting                      | Type      | Default | Description                                                                           |
| ---------------------------- | --------- | ------- | ------------------------------------------------------------------------------------- |
| `labelRenderedSizeThreshold` | `number`  | `6`     | Minimum rendered node size (in pixels) for its label to be displayed                  |
| `labelDensity`               | `number`  | `1`     | Controls how many labels are shown. Higher values show more labels (must be positive) |
| `labelGridCellSize`          | `number`  | `100`   | Size of the label grid cells used for density-based culling                           |
| `labelPixelSnapping`         | `boolean` | `true`  | Snap label positions to whole pixels for sharper text rendering                       |

## Node drag

| Setting                    | Type                                               | Default  | Description                                                                                                                        |
| -------------------------- | -------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `enableNodeDrag`           | `boolean`                                          | `false`  | Allow users to drag nodes. See the [drag and drop guide](/how-to/interactivity/drag-drop/)                                         |
| `getDraggedNodes`          | `(node: string) => string[]`                       | `[node]` | Returns the list of nodes to move when a drag starts. Override to implement multi-node drag                                        |
| `dragPositionToAttributes` | `((pos, node) => Record<string, unknown>) \| null` | `null`   | Transforms the drag position before writing it to the graph. Use for snapping or mapping to non-`x`/`y` attributes. `null` = no-op |

## Performance

| Setting            | Type      | Default | Description                                              |
| ------------------ | --------- | ------- | -------------------------------------------------------- |
| `hideEdgesOnMove`  | `boolean` | `false` | Hide edges while the camera is moving (panning, zooming) |
| `hideLabelsOnMove` | `boolean` | `false` | Hide labels while the camera is moving                   |

## Mouse and touch interaction

| Setting                      | Type     | Default | Description                                                         |
| ---------------------------- | -------- | ------- | ------------------------------------------------------------------- |
| `zoomingRatio`               | `number` | `1.7`   | Zoom factor per mouse wheel step                                    |
| `zoomDuration`               | `number` | `250`   | Zoom animation duration in milliseconds                             |
| `doubleClickZoomingRatio`    | `number` | `2.2`   | Zoom factor on double click                                         |
| `doubleClickZoomingDuration` | `number` | `200`   | Double-click zoom animation duration in milliseconds                |
| `doubleClickTimeout`         | `number` | `300`   | Maximum delay between two clicks to register as a double click (ms) |
| `inertiaDuration`            | `number` | `200`   | Inertia duration after a pan gesture (ms)                           |
| `inertiaRatio`               | `number` | `3`     | Inertia strength multiplier                                         |
| `dragTimeout`                | `number` | `100`   | Delay before a mouse-down is considered a drag (ms)                 |
| `draggedEventsTolerance`     | `number` | `3`     | Pixel tolerance before a click becomes a drag                       |
| `tapMoveTolerance`           | `number` | `10`    | Pixel tolerance for touch tap detection                             |

## Lifecycle

| Setting                 | Type      | Default | Description                                                                |
| ----------------------- | --------- | ------- | -------------------------------------------------------------------------- |
| `allowInvalidContainer` | `boolean` | `false` | Allow creating a sigma instance with an invalid (e.g. zero-size) container |

## Debug

| Setting                     | Type      | Default | Description                                                     |
| --------------------------- | --------- | ------- | --------------------------------------------------------------- |
| `DEBUG_displayPickingLayer` | `boolean` | `false` | Display the picking layer for debugging node/edge hit detection |
