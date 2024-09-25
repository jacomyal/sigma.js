# Sigma.js - Edge curve renderer

This package contains a curved edges renderer for [sigma.js](https://sigmajs.org).

It handles various aspects, such as:

- Varying curvatures
- Arrow heads
- Parallel curved edges

The edges are rendered as [quadratic Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B%C3%A9zier_curves). This package exports by default `EdgeCurveProgram`, the renderer for sigma. Edges can have a `curvature` value, to make them more or less curved.

It also exports:

- `EdgeCurvedArrowProgram`, a program with defaults settings adapted to render edges as curved arrows
- `createEdgeCurveProgram`, the factory to build a `CustomEdgeCurveProgram` with customized settings
- `DEFAULT_EDGE_CURVATURE`, the default curvature value for edges
- `indexParallelEdgesIndex`, a utility function to find parallel edges, and help adapt their `curvature` for display (see the [dedicated example](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/edge-curve/parallel-edges.ts) to see how it works)

## How to use

Within your application that uses sigma.js, you can use [`@sigma/edge-curve`](https://www.npmjs.com/package/@sigma/edge-curve) as following:

```typescript
import EdgeCurveProgram from "@sigma/edge-curve";

const graph = new Graph();
graph.addNode("a", { x: 0, y: 0, size: 10, label: "Alex" });
graph.addNode("b", { x: 10, y: 10, size: 10, label: "Bill" });
graph.addEdge("a", "b", { type: "curved" });

const sigma = new Sigma(graph, container, {
  edgeProgramClasses: {
    curved: EdgeCurveProgram,
  },
});
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/edge-curve) for more advanced examples.
