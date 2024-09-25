# Sigma.js - Node pie-chart renderer

This package contains a node pie-chart renderer for [sigma.js](https://sigmajs.org). Its API is inspired by [@sigma/node-border](https://www.npmjs.com/package/@sigma/node-border).

Because sigma render nodes [using WebGL](https://www.sigmajs.org/docs/advanced/renderers#brief-overview-of-webgl), the program cannot handle a dynamic number of pie slices. For this reason, instead of a program, this package exposes **`createNodePiechartProgram`**, a factory that creates a program to render nodes as pie-charts, with the description of what slices must represent given as input.

## How to use

Within your application that uses sigma.js, you can use [`@sigma/node-piechart`](https://www.npmjs.com/package/@sigma/node-piechart) as following:

```typescript
import { createNodePiechartProgram } from "@sigma/node-piechart";

const graph = new Graph();
graph.addNode("some-node", {
  x: 0,
  y: 0,
  size: 10,
  type: "piechart",
  label: "Some node",
  positive: 10,
  neutral: 17,
  negative: 14,
});

const NodePiechartProgram = createNodePiechartProgram({
  defaultColor: "#BCB7C4",
  slices: [
    { color: { value: "#F05454" }, value: { attribute: "negative" } },
    { color: { value: "#7798FA" }, value: { attribute: "neutral" } },
    { color: { value: "#6DDB55" }, value: { attribute: "positive" } },
  ],
});

const sigma = new Sigma(graph, container, {
  nodeProgramClasses: {
    piechart: NodePiechartProgram,
  },
});
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/node-piechart) for more advanced examples.
