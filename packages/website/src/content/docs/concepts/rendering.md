---
title: Rendering
description: How sigma uses WebGL to render nodes and edges.
---

Sigma.js uses WebGL to render graphs efficiently, achieving smooth performance with tens of thousands of nodes and edges. This page explains the core rendering architecture.

## WebGL rendering

At its core, WebGL operates using two types of shaders:

- **Vertex shaders** process each vertex and determine its position on the screen.
- **Fragment shaders** determine the color of each pixel in the area bounded by vertices.

Sigma generates its shaders from the [primitives declaration](/concepts/styles-and-primitives/). When you declare shapes, layers, paths, and extremities, sigma compiles them into optimized WebGL programs. A single program can handle multiple shapes (circle, square, triangle, diamond) and multiple layers (fill, border, image, piechart), and styles properties will determine which shape or layers will each node have.

## Node rendering

Each node is rendered as a quad (two triangles forming a rectangle) positioned at the node's coordinates and scaled to its size. The fragment shader uses **[Signed Distance Fields](https://en.wikipedia.org/wiki/Signed_distance_function)** (SDFs) to draw the node's shape with pixel-perfect anti-aliasing. The SDF approach means shapes scale cleanly at any zoom level without jagged edges.

Layers are composited within the fragment shader itself. For example, a node with a fill layer, a border layer, and an image layer runs all three fragment computations for every pixel, compositing them from back to front. Layers that have no data for a given node (for example, an image layer on a node without an `image` attribute) output transparent pixels automatically.

## Label rendering

Labels are rendered on the GPU using an **SDF-based text atlas**. Sigma pre-rasterizes glyph bitmaps into a texture atlas, then renders each label character as a textured quad. The SDF approach allows labels to scale smoothly and stay crisp at any zoom level.

## DOM layers

Sigma creates two DOM elements stacked inside the container:

- **`stage`** (WebGL canvas): The main rendering surface. All nodes, edges, labels, backdrops, and extremities are drawn
  here.
- **`mouse`** (div): A transparent layer on top that captures all mouse and touch interactions.

You can insert additional DOM elements (HTML overlays, custom canvases) between (only for other WebGL renderings), below
or above these layers using `createCanvas()` or `createLayer()`. See the
[custom HTML/SVG elements](/how-to/layers/sync-html-svg/) and [WebGL layers](/how-to/layers/webgl-layers/) how-tos for
practical examples.

## Depth layers

Within the single WebGL canvas, rendering order is controlled through **depth layers** declared in
`primitives.depthLayers`. Elements assigned to later depth layers are drawn on top of earlier ones.

For each named bucket in `depthLayers`, sigma paints in a fixed order: custom WebGL layer (if any), edges, edge labels,
backdrops, nodes, label attachments, node labels. The `depth` and `labelDepth` style properties choose which bucket
each element and each label go into. For example, setting `depth: "topNodes"` on a hovered node renders it on top of all
regular nodes.

Within a bucket, items are further sub-ordered by the `zIndex` style property (an integer clamped to
`[0, maxDepthLevels - 1]`). `depth` is the coarse, categorical axis; `zIndex` is the fine, continuous axis. Moving an
item between buckets or between `zIndex` levels re-buckets a single item. It does not re-process the rest of the graph,
which is the main performance reason v4 uses this two-axis model instead of v3's single continuous `zIndex`.

You can define custom depth layers for your own use cases (e.g., a `"selectedNodes"` layer between `nodes` and
`topNodes`). See [Depth and z-order](/concepts/depth-and-z-order/) for the full model and common recipes.

## Picking

To detect which node or edge is under the mouse cursor, sigma uses **[GPU picking](https://webglfundamentals.org/webgl/lessons/webgl-picking.html)**. It draws a hidden framebuffer where each element is rendered with a unique color encoding its identity. When the user moves the mouse, sigma reads the pixel at the cursor position from this framebuffer to identify which element is there.

This approach is efficient because it reuses the same vertex positions as the visible render. Only the fragment shader changes to output ID colors instead of visual colors. The picking framebuffer is rendered at a lower resolution (controlled by the `pickingDownSizingRatio` setting) to save memory.

Edge and label events use the same picking mechanism but are disabled by default for performance. Enable them with the `enableEdgeEvents`, `nodeLabelEvents` and `edgeLabelEvents` settings.

## Data textures

Node and edge attributes are uploaded to the GPU via **data textures**, i.e. large textures where each pixel stores attribute values for one element. This allows the vertex and fragment shaders to look up any node's or edge's data by index, which is essential for features like edge clamping (adjusting edge endpoints to the boundary of non-circular shapes).
