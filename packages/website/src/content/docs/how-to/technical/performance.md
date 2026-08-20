---
title: Improve rendering performances
sidebar:
  label: "Performances"
description: Practical advice to render very large graphs faster with sigma.js.
---

## Debugging

Sigma ships dedicated debug settings, all prefixed with `DEBUG_`. Except for `DEBUG_logShaders`, they are read on every
frame, so they can be toggled at runtime with `renderer.setSetting(...)`.

### `DEBUG_gpuTimerQueries`

Wraps each frame's WebGL calls in a GPU timer query, and logs the result in the console:

```
[sigma] DEBUG_gpuTimerQueries: frame #12 GPU time = 34.56ms
```

This is the number to watch when optimizing rendering: WebGL calls are asynchronous, so CPU-side timings miss most of
the actual GPU cost. Results arrive a few frames late, and the `EXT_disjoint_timer_query_webgl2` extension is required
(sigma warns in the console when it is not supported).

### `DEBUG_logRenderStats`

Logs a `console.table` on every frame: one row per rendering program (nodes, edges, labels, etc.), with draw calls,
vertices drawn, and bytes uploaded to GPU buffers. Frame numbers match the `DEBUG_gpuTimerQueries` logs. Use it to check
what a change does to geometry, or to spot unexpected buffer uploads while interacting with the graph.

### `DEBUG_logShaders`

Logs each program's generated vertex and fragment shader sources (both normal and picking variants), once, when the
program first renders. Mostly useful when developing custom primitives or layers.

### `DEBUG_displayPickingLayer`

Sigma detects what is under the mouse by drawing items into an offscreen "picking" framebuffer, using colors as
identifiers. This setting renders that framebuffer instead of the normal image: it is the quickest way to understand why
hover or click events do not land where expected.

## Findings

Sigma handles large graphs well out of the box. But with hundreds of thousands of edges, some choices start to matter a
lot. These findings come from profiling real datasets with the debug settings above and the
[FA2-GPU example](/embed/core/fa2-gpu-datasets).

### Edge antialiasing is expensive

Antialiasing is the most expensive part of the edge fragment shader. Using the `antialiasEdges: false` setting replaces
the smooth alpha gradient with a hard edge, for up to **x5 performances gain** on the whole GPU rendering process.
Aliased borders are only really noticeable when edge colors contrast strongly with the background, so this trade-off
works best with low-contrast edges. The same exists for nodes with `antialiasNodes`.

### Semi-transparency is expensive

The GPU blends fully opaque fragments much faster than semi-transparent ones. To de-emphasize edges, prefer a solid
color close to the background over an `opacity` lower than 1 or a translucent color: it reads the same and renders
faster.

### Unused paths still cost vertices

Every edge pays the vertex cost of the _heaviest_ registered path. The defaults register `pathLine` (4 vertices) and
`pathLoop` (66 vertices), so by default every straight edge is drawn with 66 vertices. If your graph has no self-loops,
register only what you need:

```ts
import { pathLine } from "sigma/rendering";

const renderer = new Sigma(graph, container, {
  primitives: {
    edges: { paths: [pathLine()] },
  },
});
```

### Curves precision can be lowered

Curved paths are tessellated: `pathLoop` uses 32 segments by default, `pathCurved` uses 16. On very large graphs, curves
are small on screen and fewer segments look just as good:

```ts
paths: [pathLine(), pathCurved({ segments: 12 }), pathLoop({ segments: 12 })];
```

Since every edge pays for the heaviest path (see above), this also lowers the cost of _straight_ edges.

### Edge events are costly

Edge picking requires drawing all edges a second time, into the picking buffer. The `enableEdgeEvents` setting is
`false` by default. Enable it only if you actually listen to edge events. Similarly, the `pickingDownSizingRatio`
setting (default `2`) renders the picking buffer at a lower resolution: raising it makes picking cheaper but less
precise.

### Fragments cost more than vertices

On big graphs, frames are usually _fragment-bound_: the GPU spends its time shading and blending pixels, not processing
vertices. In our benchmark, halving the vertex count only shaved ~6% off the frame time, while opacity and antialiasing
changes moved it far more, up to ~80% shaved in some case. Look first at what touches pixels (overdraw, blending,
antialiasing, edge thickness), then at geometry.
