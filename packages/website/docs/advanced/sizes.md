---
title: Node and Edge Sizes
sidebar_position: 5
---

# Node and Edge Sizes

## Default Behavior

### Design Motivation

The default behavior of Sigma is designed to ensure:

- The **entire graph is visible** and uses the available viewport space efficiently.
- Like how road thickness on map applications isn't true-to-scale (for better readability), nodes and edges **adjust to the zoom level**, preventing them from becoming too large or too small.
- It is easy for developers to adjust the node and edge sizes to the viewport.

This approach allows developers to use a variety of graph layouts, ensuring the graph is visible and readable without requiring additional customization.

### Implementation Details

Sigma applies the following rules for rendering nodes and edges relative to data sizes:

1. Node and edge sizes **scale with the square root** of the zoom ratio.
2. Sizes from data are treated as **pixel values**, for the default zoom level.
3. Node and edge positions are adjusted so that the **graph is rescaled and centered**, fitting optimally in the viewport at the default camera zoom.

### Limitations

These opinionated choices bring some limitations, though:

- Graph appearance can be **inconsistent across different viewports**.
- Node and edge sizes can be **difficult to predict**, especially in relation to positions, which can lead to overlap on smaller viewports.

## Customization Options

To allow adapting these behaviours, sigma offers various settings to change the way it handles positions and sizes.

### `zoomToSizeRatioFunction` Setting

To modify rule #1, adjust the `zoomToSizeRatioFunction` setting. This setting takes a transformation function `(ratio: number) => number`. By default, Sigma uses `Math.sqrt`, which keeps nodes and edges reasonably sized when zooming in or out.

For instance, using `(ratio) => ratio` will make node and edge sizes scale directly with the zoom, similar to most graph visualization tools.

### `itemSizesReference` Setting

To change rule #2, set `itemSizesReference` to **`"positions"`**. This makes sigma interpret node and edge sizes in the same coordinate system as the node positions at the default zoom level.

If you want sizes to scale with the node positions at **all zoom levels**, combine this setting with `zoomToSizeRatioFunction: (ratio) => ratio`.

### `autoRescale` Setting

To disable rule #3, use the `autoRescale` setting. Setting `autoRescale` as `false` prevents Sigma from automatically resizing the graph. Then, node positions are interpreted in pixels, for the default zoom level. The graph remains centered in the viewport, though.

Also, note that when disabling `autoRescale`, the `itemSizesReference` setting becomes irrelevant, since node and edge sizes become

### Example

You can play with these three options, in the **["Customize how sigma handles sizes and positions"](https://www.sigmajs.org/storybook/?path=/story/fit-sizes-to-positions--story)** story in the [StoryBook](https://www.sigmajs.org/storybook).
