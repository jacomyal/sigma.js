# Sigma.js - Node border renderer

This package contains a node border renderer for [sigma.js](https://sigmajs.org).

It handles various aspects, such as:

- Variable or fixed border thickness
- Relative (ie percentage of the nodes radius) or "pixels" border thickness
- Variable or fixed colors
- Multiple borders

The shaders are generated according to these varying options, so the main export is **`createNodeBorderProgram`**, a factory that creates a renderer class.

It also exports one core class, built with the default settings, to help using it in an easier way: `NodeBorderProgram` is configured to render nodes with a 10% border of color `borderColor` (read in the nodes data), and filled with the nodes `color`.

## How to use

Within your application that uses sigma.js, you can use [`@sigma/node-border`](https://www.npmjs.com/package/@sigma/node-border) as following:

```typescript
import { NodeBorderProgram } from "@sigma/node-border";

const graph = new Graph();
graph.addNode("some-node", {
  x: 0,
  y: 0,
  size: 10,
  type: "border",
  label: "Some node",
  color: "blue",
  borderColor: "red",
});

const sigma = new Sigma(graph, container, {
  nodeProgramClasses: {
    border: NodeBorderProgram,
  },
});
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/node-border) for more advanced examples.
