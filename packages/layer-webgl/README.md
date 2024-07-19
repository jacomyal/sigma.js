# Sigma.js - WebGL layers

This package enables adding custom WebGL layers in [sigma.js](https://sigmajs.org):

- `WebGLLayerProgram` is a tweaked version of the `Program` abstract class from sigma.js, and it facilitates writing custom programs;
- `bindWebGLLayer` allows binding a `WebGLLayerProgram` to an existing sigma instance, and it returns a cleanup function.

This package also exports some preexisting layers, that render various shapes:

- `createMetaballsProgram` allows rendering metaballs as a background layer, around a set of given nodes;
- `createContourLineProgram` allows rendering a contour line as a background layer, around a set of given nodes.

## How to use

Within your application that uses sigma.js, you can use [`@sigma/layer-webgl`](https://www.npmjs.com/package/@sigma/layer-webgl) as following:

```typescript
import { createMetaballsProgram } from "@sigma/layer-webgl";

const graph = new Graph();
graph.addNode("john", {
  x: 0,
  y: 0,
  size: 4,
  label: "John",
});
graph.addNode("jack", {
  x: 10,
  y: 20,
  size: 8,
  label: "Jack",
});
graph.addEdge("jack", "john");

const renderer = new Sigma(graph, container);

// Bind a custom layer to the renderer:
bindWebGLLayer("metaballs", renderer, createMetaballsProgram(graph.nodes()));
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/layer-webgl) for more advanced examples.
