---
title: Graph data
sidebar_position: 1
---

# Graph data

Sigma.js utilizes a specific data model to represent and display graphs. This section provides an overview of the core attributes and functionalities related to nodes and edges in sigma.js.

## Graph model: Graphology

Sigma.js uses [graphology](https://graphology.github.io/) as its underlying graph model. Graphology offers a very large [standard library](https://graphology.github.io/standard-library/) of graph algorithms and data structures. It also provides a powerful API for developers to interact with graphs.

## Node attributes

Nodes in sigma.js have several recognized attributes that determine their appearance and behavior:

- **`x`, `y`**: These attributes determine the position of the node on the canvas. They are typically set using layout algorithms but can also be manually specified.

- **`type`**: This attribute defines the visual representation of the node, such as `'circle'`, `'square'`, etc. If not specified, the `defaultNodeType` setting will be used instead. The type value must match a key in the `nodeProgramClasses` collection from the settings. Please check the [`custom-rendering`](https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/1-core-features/5-custom-rendering/index.ts) story to see an actual example.

- **`size`**: Represents the radius of the node. A larger value will render a bigger node.

- **`color`**: Represents the color of the node, as a string. It handles hexadecimal values (`"#e22653"` for instance) and [CSS named colors](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color) (`"deeppink"` for instance).

- **`label`**: The text displayed near the node, typically representing its name or identifier.

### Additional node attributes

- **`hidden`**: A boolean attribute. If set to `true`, the node will not be displayed.

- **`forceLabel`**: When set to `true`, the node's label will always be displayed, regardless of zoom level or other conditions.

- **`zIndex`**: Determines the display order of nodes. Nodes with higher zIndex values will be drawn on top of nodes with lower zIndex values. Note: The `zIndex` attribute only works when the setting `zIndex` is set to `true`.

## Edge attributes

Edges have their own set of attributes:

- **`size`**: Represents the thickness of the edge. A larger value will render a thicker edge.

- **`color`**: Represents the color of the node, as a string.

- **`label`**: The text displayed near the edge, typically representing its weight or type.

- **`type`**: This attribute defines the visual representation of the edge, such as `'line'`, `'arrow'`, `'curve''`, etc. If not specified, the `defaultEdgeType` setting will be used instead. The type value must match a key in the `edgeProgramClasses` collection from the settings. Please check the [`parallel-edges`](https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/3-additional-packages/edge-curve/parallel-edges.ts) story to see an actual example.

### Additional edge attributes

- **`hidden`**: A boolean attribute. If set to `true`, the edge will not be displayed.

- **`forceLabel`**: When set to `true`, the edge's label will always be displayed, regardless of zoom level or other conditions.

- **`zIndex`**: Determines the display order of edges. Edges with higher zIndex values will be drawn on top of edges with lower zIndex values. Note: The `zIndex` attribute only works when the setting `zIndex` is set to `true`, and also edges can never be drawn on top of nodes, regardless of their `zIndex` values.

## Dynamic attribute transformation: reducers

Sigma.js offers a powerful feature that allows developers to dynamically transform node and edge attributes right before rendering. This is achieved using `nodeReducer` and `edgeReducer`.

These are functions provided in the settings. They take a node or edge as input and return a new set of attributes for that node or edge. This allows for dynamic visual transformations without modifying the underlying graphology instance.

For instance, if developers want to highlight a specific part of the graph, they can use reducers to change the size or color of specific nodes and edges without altering the original graph data.

```typescript
sigma.setSetting("nodeReducer", (node) => {
  if (node.id === "specialNode") {
    return {
      ...node,
      size: 10,
      color: "#ff0000",
    };
  }
  return node;
});
```

In the example above, the `nodeReducer` checks if a node has an id of 'specialNode'. If it does, it changes its size and color. This transformation will be applied right before rendering, ensuring that the 'specialNode' stands out in the visualization.
