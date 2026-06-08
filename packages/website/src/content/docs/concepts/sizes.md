---
title: Node and edge sizes
description: How sigma handles node and edge sizing, and how to customize it.
---

## Default behavior

### Design motivation

The default behavior of Sigma is designed to ensure:

- The **entire graph is visible** and uses the available viewport space efficiently.
- Like how road thickness on map applications isn't true-to-scale (for better readability), nodes and edges **adjust to the zoom level**, preventing them from becoming too large or too small.
- It is easy for developers to adjust the node and edge sizes to the viewport.

This approach allows developers to use a variety of graph layouts, ensuring the graph is visible and readable without requiring additional customization.

### Implementation details

By default, sigma applies the following rules for rendering nodes and edges relative to data sizes:

1. Node and edge sizes **scale with the square root** of the zoom ratio.
2. Sizes from data are treated as **pixel values**, for the default zoom level.
3. Node and edge positions are adjusted so that the **graph is rescaled and centered**, fitting optimally in the viewport at the default camera zoom.

### Limitations

These opinionated choices bring some limitations:

- Graph appearance can be **inconsistent across different viewports**.
- Node and edge sizes can be **difficult to predict**, especially in relation to positions, which can lead to overlap on smaller viewports.

## Customization options

### `zoomToSizeRatioFunction` setting

To modify rule #1, adjust the `zoomToSizeRatioFunction` setting. This setting takes a transformation function `(ratio: number) => number`. By default, Sigma uses `Math.sqrt`, which keeps nodes and edges reasonably sized when zooming in or out.

For instance, using `(ratio) => ratio` will make node and edge sizes scale directly with the zoom, similar to most other graph visualization tools.

### `itemSizesReference` setting

To change rule #2, set `itemSizesReference` to **`"positions"`**. This makes sigma interpret node and edge sizes in the same coordinate system as the node positions at the default zoom level.

If you want sizes to scale with the node positions at **all zoom levels**, combine this setting with `zoomToSizeRatioFunction: (ratio) => ratio`.

### `autoRescale` setting

To disable rule #3, use the `autoRescale` setting. Setting `autoRescale` as `false` prevents Sigma from automatically resizing the graph. Then, node positions are interpreted in pixels, for the default zoom level. The graph remains centered in the viewport, though.

### `autoRescaleContent` setting

When `autoRescale` is enabled, sigma fits the graph to the viewport based on **node positions only**. This means nodes
sitting near the edge of the graph can still get clipped, because their shape and labels extends beyond the fitted area.

The `autoRescaleContent` setting controls what that fit encloses:

- **`"positions"`** _(default)_: only node centers are considered. This is the historical behavior, and the cheapest to
  compute.
- **`"nodes"`**: node centers **and sizes**. The fit grows so each node's full disc stays inside the viewport.
- **`"labels"`**: node centers, sizes, **and labels**. The fit grows so labels stay inside the viewport too.

Each level contains the previous one. The setting is ignored when `autoRescale` is `false`, or when a custom bounding
box is provided (the bounding box wins).

:::caution
`autoRescaleContent: "labels"` is **expensive to compute**: sigma measures each node's label box on the CPU and iterates
until the framing stabilizes. Use it only on small-ish graphs; on large graphs, prefer `"nodes"` or add extra stage
padding instead.
:::

### `stagePadding` setting

Whatever `autoRescaleContent` encloses, sigma leaves a margin between it and the viewport edges, controlled by the
`stagePadding` setting (in pixels, default `30`). Increasing it is the cheapest way to keep node shapes and labels from
touching the edges, without paying the cost of fitting them precisely.

### Example

You can try these options in the [Custom size handling](/how-to/technical/custom-sizes/) how-to guide.
