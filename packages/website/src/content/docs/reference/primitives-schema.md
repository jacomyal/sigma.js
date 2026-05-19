---
title: Primitives schema
sidebar:
  label: Primitives schema
---

Primitives declare the rendering pipeline: what shapes, layers, paths, and extremities sigma compiles into WebGL
programs. Pass them in the `primitives` option when creating a Sigma instance.

For a conceptual overview, see [Styles and primitives](/concepts/styles-and-primitives/).

## Top-level structure

```typescript
{
  primitives: {
    nodes?: NodePrimitives,
    edges?: EdgePrimitives,
    depthLayers?: string[],
  },
}
```

## Node primitives

```typescript
{
  nodes: {
    shapes?: NodeShapeSpec[],
    layers?: NodeLayerSpec[],
    label?: LabelOptions,
    backdrop?: BackdropOptions,
    labelAttachments?: Record<string, LabelAttachmentRenderer>,
    rotateWithCamera?: boolean,
    variables?: VariablesDefinition,
  },
}
```

The `rotateWithCamera` primitive specifies if nodes should keep their vertical orientations when the camera angle
changes or not.

### shapes

Array of [SDF](https://en.wikipedia.org/wiki/Signed_distance_function) shape factories. The first is the default. Each
node selects its shape via the `shape` style property.

Built-in factories (from `sigma/rendering`):

| Factory            | Name         | Options                      |
| ------------------ | ------------ | ---------------------------- |
| `sdfCircle()`      | `"circle"`   | -                            |
| `sdfSquare(opts?)` | `"square"`   | `cornerRadius?`, `rotation?` |
| `sdfTriangle()`    | `"triangle"` | -                            |
| `sdfDiamond()`     | `"diamond"`  | -                            |

### layers

Array of layer factories composited from back to front. Layers auto-disable when they have no data for a node.

Built-in:

| Factory                | Package                | Description        |
| ---------------------- | ---------------------- | ------------------ |
| `layerFill(opts?)`     | `sigma/rendering`      | Solid color fill   |
| `layerBorder(opts?)`   | `@sigma/node-border`   | Concentric borders |
| `layerImage(opts?)`    | `@sigma/node-image`    | Image or pictogram |
| `layerPiechart(opts?)` | `@sigma/node-piechart` | Pie chart slices   |

### label

Node label rendering options.

| Field                          | Type                                  | Description                                                                                                                      |
| ------------------------------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `font`                         | `{ family?, weight?, style?, size? }` | Default font settings                                                                                                            |
| `color`                        | `string`                              | Default label color                                                                                                              |
| `position`                     | `LabelPosition`                       | Default label position                                                                                                           |
| `margin`                       | `number`                              | Gap between node edge and label                                                                                                  |
| `zoomToLabelSizeRatioFunction` | `(ratio: number) => number`           | Maps camera ratio to a label size factor. Returning a value `< 1` makes labels bigger. Defaults to `() => 1` (fixed pixel size). |

### backdrop

Backdrop shape configuration, used for hover highlights around nodes and their labels. Each field accepts either a
constant value (baked into the shader) or an attribute reference `{ attribute, default? }` to read it from per-node
storage.

| Field         | Type                                                | Description                 |
| ------------- | --------------------------------------------------- | --------------------------- |
| `color`       | `string \| { attribute: string, default?: string }` | Backdrop fill color         |
| `shadowColor` | `string \| { attribute: string, default?: string }` | Shadow color                |
| `shadowBlur`  | `number \| { attribute: string, default?: number }` | Shadow blur radius (pixels) |
| `padding`     | `number \| { attribute: string, default?: number }` | Padding around node + label |

### labelAttachments

A dictionary of named renderers for label attachments. A renderer returns a `LabelAttachmentContent` object or `null` to
skip. See the [attachments how-to](/how-to/labels/attachments/).

Three content shapes are supported:

- `{ type: "canvas", canvas: HTMLCanvasElement }`: pre-rendered canvas (dimensions taken from `canvas.width/height`).
- `{ type: "svg", svg: string | SVGElement }`: SVG markup (dimensions parsed from `width`/`height` or `viewBox`).
- `{ type: "html", html: string | HTMLElement, css?: string, width?: number, height?: number }`: HTML fragment rendered via an SVG `foreignObject`.

```typescript
labelAttachments: {
  hoverInfo: (ctx: LabelAttachmentContext) => ({
    type: "svg",
    html: "<svg>...</svg>",
  }),
}
```

:::note
The `"html"` label attachments use SVG with `<foreignObject>` under the hood, which is blocked by Chromium and Safari at
the moment.
:::

### variables

Custom typed attributes that layers can consume and that become available as style properties.

```typescript
variables: {
  borderSize: { type: "number", default: 0 },
  borderColor: { type: "color", default: "transparent" },
}
```

| Field     | Values                                         | Description                             |
| --------- | ---------------------------------------------- | --------------------------------------- |
| `type`    | `"number"`, `"color"`, `"string"`, `"boolean"` | Variable type                           |
| `default` | matches type                                   | Default value when attribute is missing |

## Edge primitives

```typescript
{
  edges: {
    paths?: EdgePathSpec[],
    extremities?: EdgeExtremitySpec[],
    layers?: EdgeLayerSpec[],
    variables?: VariablesDefinition,
    defaultHead?: string,
    defaultTail?: string,
    label?: EdgeLabelOptions,
  },
}
```

### paths

Array of path factories. The first is the default. By default, edges use `[pathLine(), pathLoop()]`, with `pathLoop`
handling self-loops, and selected automatically through `selfLoopPath`.

Built-in factories (from `sigma/rendering`):

| Factory                 | Name            | Options                                                              |
| ----------------------- | --------------- | -------------------------------------------------------------------- |
| `pathLine()`            | `"straight"`    | -                                                                    |
| `pathCurved(opts?)`     | `"curved"`      | `segments?`, `curvature?` (accepts a `ValueSource<number>`)          |
| `pathStep(opts?)`       | `"step"`        | `orientation?`, `rotateWithCamera?`, `offset?`, `cornerRadius?`, ... |
| `pathStepCurved(opts?)` | `"step-curved"` | `orientation?`, `rotateWithCamera?`, `offset?`, ...                  |
| `pathCurvedS(opts?)`    | `"curved-s"`    | curve control points / segments                                      |
| `pathLoop(opts?)`       | `"loop"`        | self-loop geometry options                                           |

### extremities

Array of extremity factories for arrowheads and other endpoint shapes. See [How to: Edge extremities](/how-to/edges/extremities/) for usage recipes.

All built-in extremities share the same option shape. `lengthRatio` and `widthRatio` are expressed as multiples of the edge thickness; `margin` shifts the shape away from the node along the edge direction (in pixels).

Built-in factories (from `sigma/rendering`):

| Factory                   | Name        | Options                                  | Default `lengthRatio` | Default `widthRatio` |
| ------------------------- | ----------- | ---------------------------------------- | --------------------- | -------------------- |
| `extremityArrow(opts?)`   | `"arrow"`   | `lengthRatio?`, `widthRatio?`, `margin?` | `5`                   | `4`                  |
| `extremityBar(opts?)`     | `"bar"`     | `lengthRatio?`, `widthRatio?`, `margin?` | `0.75`                | `4`                  |
| `extremityCircle(opts?)`  | `"circle"`  | `lengthRatio?`, `widthRatio?`, `margin?` | `4`                   | `lengthRatio + 1`    |
| `extremityDiamond(opts?)` | `"diamond"` | `lengthRatio?`, `widthRatio?`, `margin?` | `5`                   | `4`                  |
| `extremitySquare(opts?)`  | `"square"`  | `lengthRatio?`, `widthRatio?`, `margin?` | `4`                   | `4`                  |

Each edge picks an extremity via the `head` and `tail` style properties, using the `name` in the table above (or `"none"` to skip).

### layers

Edge layer factories composited together.

| Factory              | Package           | Description                                                                                   |
| -------------------- | ----------------- | --------------------------------------------------------------------------------------------- |
| `layerPlain()`       | `sigma/rendering` | Solid edge body                                                                               |
| `layerDashed(opts?)` | `sigma/rendering` | Dashed overlay. Options: `dashSize`, `gapSize`, `dashColor`, `dashOffset`, `solidExtremities` |

### label

Edge label rendering options.

| Field                     | Type                                                    | Description                                                                                                  |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `color`                   | `EdgeLabelColorSpecification`                           | Label color. Accepts a CSS string or `{ attribute, color? }` to read from an edge attribute.                 |
| `position`                | `"over" \| "above" \| "below" \| "auto"`                | Default edge label placement                                                                                 |
| `margin`                  | `number`                                                | Distance between label and edge path (in pixels) for `"above"`/`"below"`/`"auto"`                            |
| `fontSizeMode`            | `"fixed" \| "scaled"`                                   | Whether labels scale with zoom                                                                               |
| `textBorder`              | `{ width: number, color: EdgeLabelColorSpecification }` | Outline around label characters for readability                                                              |
| `minVisibilityThreshold`  | `number`                                                | Minimum label visibility ratio (`0–1`). Labels less visible than this are hidden. Default: `0.5`.            |
| `fullVisibilityThreshold` | `number`                                                | Visibility ratio at which labels reach full opacity. Labels fade between the two thresholds. Default: `0.6`. |

## Depth layers

An array of strings defining the rendering order. Elements assigned to later layers render on top.

Default:

```typescript
["edges", "nodes", "topEdges", "topNodes"];
```

Nodes and edges are assigned to depth layers via the `depth` and `labelDepth` style properties; the `zIndex` style
property sub-orders items _within_ a bucket. See [Depth and z-order](/concepts/depth-and-z-order/) for the full model
and recipes, and the [Hover and search](/how-to/interactivity/hover-search/) page for a typical interactive use-case.
