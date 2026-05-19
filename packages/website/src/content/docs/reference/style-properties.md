---
title: Style properties
sidebar:
  label: Style properties
---

Every node and edge has a set of built-in style properties that control its visual appearance. These properties are set
through the [styles system](/concepts/styles-and-primitives/) using any
[style value type](/reference/style-value-types/).

Custom properties can be added via [primitives variables](/reference/primitives-schema/).

## Node style properties

These are the built-in style properties available for nodes:

### Position and geometry

| Property | Type     | Description                                                                                                          |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `x`      | `number` | X coordinate in graph space                                                                                          |
| `y`      | `number` | Y coordinate in graph space                                                                                          |
| `size`   | `number` | Node size (actual pixel size depends on `autoRescale`, `itemSizesReference`, and `zoomToSizeRatioFunction` settings) |
| `shape`  | `string` | Shape name (e.g. `"circle"`, `"square"`). Must match a shape declared in `primitives.nodes.shapes`                   |

### Appearance

| Property     | Type                    | Description                                |
| ------------ | ----------------------- | ------------------------------------------ |
| `color`      | `string`                | Node fill color                            |
| `opacity`    | `number`                | Opacity from 0 (transparent) to 1 (opaque) |
| `visibility` | `"visible" \| "hidden"` | Whether the node is visible                |

### Interaction

| Property | Type     | Description                                         |
| -------- | -------- | --------------------------------------------------- |
| `cursor` | `string` | CSS cursor to show when hovering (e.g. `"pointer"`) |

### Ordering

| Property | Type     | Description                                                                       |
| -------- | -------- | --------------------------------------------------------------------------------- |
| `depth`  | `string` | Depth bucket for render ordering (must match a layer in `primitives.depthLayers`) |
| `zIndex` | `number` | Sub-order within the bucket, clamped to `[0, maxDepthLevels - 1]`                 |

`depth` and `zIndex` work together as a two-axis sort. See [Depth and z-order](/concepts/depth-and-z-order/) for the
full model and recipes.

### Label properties

| Property                   | Type                                                | Description                                                             |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| `label`                    | `string`                                            | Label text content                                                      |
| `labelColor`               | `string`                                            | Label text color                                                        |
| `labelSize`                | `number`                                            | Label font size in pixels                                               |
| `labelFont`                | `string`                                            | Label font family (e.g. `"Georgia, serif"`)                             |
| `labelVisibility`          | `"auto" \| "visible" \| "hidden"`                   | `"auto"` uses density-based culling, `"visible"` forces display         |
| `labelPosition`            | `"right" \| "left" \| "above" \| "below" \| "over"` | Label position relative to node                                         |
| `labelAngle`               | `number`                                            | Label rotation angle in radians                                         |
| `labelDepth`               | `string`                                            | Depth layer for label rendering (defaults to related node's `depth`)    |
| `labelAttachment`          | `string \| null`                                    | Label attachment name (references `primitives.nodes.labelAttachments`)  |
| `labelAttachmentPlacement` | `"below" \| "above" \| "left" \| "right"`           | Attachment position relative to label                                   |
| `labelBackgroundColor`     | `string`                                            | Label background fill color (transparent = no background)               |
| `labelBackgroundPadding`   | `number`                                            | Padding around the label background in pixels                           |
| `labelCursor`              | `string`                                            | CSS cursor to show when hovering the label (requires `nodeLabelEvents`) |

### Backdrop properties

Backdrops render a styled GPU shape (fill, border, shadow, corner radius) behind nodes and/or their labels. They are
expensive compared to other node properties and meant for a handful of elements at a time, typically hovered or
highlighted. For a cheap, always-on flat rectangle behind a label only (which also serves as the hit area for label
events), use `labelBackgroundColor` / `labelBackgroundPadding` above instead.

| Property               | Type                          | Description                                                   |
| ---------------------- | ----------------------------- | ------------------------------------------------------------- |
| `backdropVisibility`   | `"visible" \| "hidden"`       | Whether the backdrop is shown                                 |
| `backdropColor`        | `string`                      | Backdrop fill color                                           |
| `backdropShadowColor`  | `string`                      | Shadow color                                                  |
| `backdropShadowBlur`   | `number`                      | Shadow blur radius in pixels                                  |
| `backdropPadding`      | `number`                      | Padding around the node and label in pixels                   |
| `backdropBorderColor`  | `string`                      | Border color                                                  |
| `backdropBorderWidth`  | `number`                      | Border width in pixels                                        |
| `backdropCornerRadius` | `number`                      | Corner radius in pixels                                       |
| `backdropLabelPadding` | `number`                      | Label-specific padding (`-1` falls back to `backdropPadding`) |
| `backdropArea`         | `"both" \| "node" \| "label"` | Which area the backdrop covers                                |

## Edge style properties

### Appearance

| Property         | Type                    | Description                                                                              |
| ---------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `size`           | `number`                | Edge thickness in pixels                                                                 |
| `color`          | `string`                | Edge color                                                                               |
| `opacity`        | `number`                | Opacity from 0 to 1                                                                      |
| `visibility`     | `"visible" \| "hidden"` | Whether the edge is visible                                                              |
| `path`           | `string`                | Path type (e.g. `"straight"`, `"curved"`). Must match a path in `primitives.edges.paths` |
| `head`           | `string`                | Head (target) extremity type (e.g. `"arrow"`, `"none"`)                                  |
| `tail`           | `string`                | Tail (source) extremity type                                                             |
| `selfLoopPath`   | `string`                | Path type override for self-loop edges                                                   |
| `parallelPath`   | `string`                | Path type override for parallel edges                                                    |
| `parallelSpread` | `number`                | Spread factor for parallel edge separation (default: `0.25`)                             |

### Interaction

| Property | Type     | Description                                         |
| -------- | -------- | --------------------------------------------------- |
| `cursor` | `string` | CSS cursor to show when hovering (e.g. `"pointer"`) |

### Ordering

| Property | Type     | Description                                                       |
| -------- | -------- | ----------------------------------------------------------------- |
| `depth`  | `string` | Depth bucket for render ordering                                  |
| `zIndex` | `number` | Sub-order within the bucket, clamped to `[0, maxDepthLevels - 1]` |

See [Depth and z-order](/concepts/depth-and-z-order/) for the full model.

### Label properties

| Property                 | Type                                               | Description                                                                           |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `label`                  | `string`                                           | Label text content                                                                    |
| `labelColor`             | `string`                                           | Label text color                                                                      |
| `labelSize`              | `number`                                           | Label font size in pixels                                                             |
| `labelFont`              | `string`                                           | Label font family                                                                     |
| `labelVisibility`        | `"auto" \| "visible" \| "hidden"`                  | Label visibility mode                                                                 |
| `labelPosition`          | `number \| "over" \| "above" \| "below" \| "auto"` | Position mode, or a ratio along the edge (`0` = source, `0.5` = middle, `1` = target) |
| `labelDepth`             | `string`                                           | Depth layer for label rendering (defaults to related edge's `depth` value)            |
| `labelBackgroundColor`   | `string`                                           | Label background fill color (transparent = no background)                             |
| `labelBackgroundPadding` | `number`                                           | Padding around the label background in pixels                                         |
| `labelCursor`            | `string`                                           | CSS cursor to show when hovering the label (requires `edgeLabelEvents`)               |

## Stage style properties

Stage styles apply to the sigma container itself. Unlike node and edge styles, stage styles only support
[graph state](/reference/style-value-types/) conditionals (not attribute bindings).

| Property     | Type     | Description                                             |
| ------------ | -------- | ------------------------------------------------------- |
| `cursor`     | `string` | CSS cursor on the stage (fallback when nothing hovered) |
| `background` | `string` | Stage background color                                  |

Stage styles support the same rule-level conditionals as nodes/edges, but predicates match against **graph state** flags
(e.g. `isDragging`, `hasHovered`):

```typescript
const renderer = new Sigma(graph, container, {
  styles: {
    nodes: { cursor: "grab" },
    stage: {
      whenState: "isDragging",
      then: { cursor: "grabbing" },
    },
  },
});
```

## Custom variables

Additional style properties can be declared via `primitives.nodes.variables` and `primitives.edges.variables`. These are
used by custom rendering layers.

```typescript
import { layerBorder } from "@sigma/node-border";
import { layerFill } from "sigma/rendering";

const renderer = new Sigma(graph, container, {
  primitives: {
    nodes: {
      variables: {
        borderSize: { type: "number", default: 2 },
        borderColor: { type: "color", default: "#ffffff" },
      },
      layers: [
        layerFill(),
        layerBorder({ borders: [{ size: { attribute: "borderSize" }, color: { attribute: "borderColor" } }] }),
      ],
    },
  },
  styles: {
    nodes: {
      borderSize: 3,
      borderColor: { attribute: "borderColor", defaultValue: "#000" },
    },
  },
});
```

Once declared, custom variables can be styled exactly like built-in properties, with any
[style value type](/reference/style-value-types/).
