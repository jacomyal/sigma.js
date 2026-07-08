# Sigma.js - GPU ForceAtlas2 layout

This package provides a GPU-computed [ForceAtlas2](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098679) layout that runs **directly in a sigma renderer's WebGL context**, on sigma's own data textures.

Unlike graphology-based layouts, iterations never round-trip through the CPU: the simulation lives in ping-pong float textures, and the resulting positions are copied straight into sigma's node data texture every frame, with a single GPU draw call. The graphology instance stays the source of truth for the graph structure, and positions are synced back to it periodically (and always when the layout stops).

## How to use

```typescript
import { ForceAtlas2GPULayout } from "@sigma/layout-fa2-gpu";
import Sigma from "sigma";

const renderer = new Sigma(graph, container);
const layout = new ForceAtlas2GPULayout(renderer);

layout.start(); // live run, until stop()
// layout.start(500); // or a fixed number of iterations
// layout.start({ duration: 5000 }); // or a time budget
// ...
layout.stop(); // final positions are written back to the graph
```

### Headless runs

`layout.run({ iterations?, duration? })` computes without rendering: no per-frame syncs — just iterations, as fast as the GPU allows. When the budget is exhausted (or `stop()` is called), positions are synced to graphology at once, sigma refreshes, and the returned promise resolves. Typical use, behind a loading overlay:

```typescript
overlay.hidden = false;
await layout.run({ duration: 5000 });
overlay.hidden = true;
```

## Behavior during a run

- **The layout owns positions.** Sigma renders from the simulation's positions every frame; CPU-side consumers (labels, `graphToViewport`...) are refreshed at each backport (every `backportInterval` ms, 200 by default).
- **External x/y writes are inputs.** Setting a node's `x`/`y` in graphology while the layout runs moves that node in the simulation, which is what makes dragging nodes during a run work.
- **Structural changes stop the run.** Adding or dropping nodes or edges stops the layout (after a final backport of the surviving nodes' positions), and emits `stopped` with reason `"structure"`. Restart it when your changes are done.

## Fixed nodes

`layout.setNodeFixed(node, true | false)` fixes or releases a node, at any time (including mid-run): a fixed node does not move under the layout's forces, but still repulses and attracts the other nodes. `layout.isNodeFixed(node)` reads the flag back.

To keep a dragged node under the pointer instead of fighting the simulation, fix it while it is dragged, from sigma's drag events:

```typescript
renderer.on("nodeDragStart", ({ allDraggedNodes }) =>
  allDraggedNodes.forEach((node) => layout.setNodeFixed(node, true)),
);
renderer.on("nodeDragEnd", ({ allDraggedNodes }) =>
  allDraggedNodes.forEach((node) => layout.setNodeFixed(node, false)),
);
```

## Settings

Standard ForceAtlas2 settings: `linLogMode`, `strongGravityMode`, `outboundAttractionDistribution`, `edgeWeightInfluence`, `scalingRatio`, `gravity`, `slowDown`, `maxForce`.

GPU-specific settings:

- `quadTreeDepth` (default `"auto"`) and `quadTreeTheta` (default `1`): repulsion is approximated with a Barnes-Hut-like quad-tree, fully computed on GPU. `quadTreeDepth` is the number of grid levels (`"auto"` picks a depth giving roughly one cell per node at the finest level); `quadTreeTheta` (between 0.25 and 1) is the precision parameter — lower thetas are more precise, with a cost growing as 1/theta².
- `iterationsPerFrame` (default `"auto"`): iterations issued per rendered frame. GPU work only, never blocks the main thread. `"auto"` adapts the count to what the GPU actually sustains (grows while batches complete in time, shrinks when the GPU falls behind); a number pins it. `maxIterationsPerFrame` (default `100`) caps both modes.
- `backportInterval` (default `200`): minimum delay in ms between two syncs of the positions back to graphology during a live run. `0` syncs on every frame — fine for small-ish graphs, and keeps labels, dragging and coordinate conversions perfectly fresh. `Infinity` disables periodic syncs. A final sync always happens when a run stops.

## Events

The layout emits `started` and `stopped` (`{ reason: "stop" | "iterations" | "duration" | "structure" | "kill" }`).

## Requirements

The layout needs WebGL2 with the `EXT_color_buffer_float` and `EXT_float_blend` extensions (available basically everywhere WebGL2 is); the constructor throws when they are missing.
