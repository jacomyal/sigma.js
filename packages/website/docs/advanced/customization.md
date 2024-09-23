---
title: Customizing appearance
sidebar_position: 2
---

# Customizing graph appearance

Sigma.js offers a range of options to tailor the appearance of graphs. Depending on your needs and familiarity with the library, you can choose from simple tweaks to more advanced customizations. Here's a breakdown of the available methods:

## Sizes and colors

A fundamental way to influence the look of your graph is by specifying sizes and colors for nodes and edges. As detailed in the data section of sigma.js documentation, it's essential to provide these attributes for each node and edge.

### Dynamic appearance with reducers

Reducers offer a dynamic approach to adjust the appearance. They are particularly useful when you want to emphasize specific parts of the graph or highlight the neighborhood of a particular node. For hands-on examples of how to employ reducers for dynamic appearance adjustments, refer to the [`use-reducers`](https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/use-reducers) and [`events`](https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/events) examples.

## Labels and hovered nodes

Labels play a crucial role in making the graph informative. Sigma.js provides settings to fine-tune label rendering, including:

- **labelFont**: Adjusts the font used for labels.
- **labelSize**: Modifies the size of the label text.
- **labelWeight**: Sets the weight (or thickness) of the label text.
- **labelColor**: Changes the color of the label text.

### Custom canvas rendering

Beyond these settings, sigma.js allows for more advanced customization of labels and hovered nodes through canvas context manipulation. By overriding the default methods that handle label and node hovering rendering, you can achieve a unique visual style that deviates from the standard sigma.js appearance. This approach is less complex than working directly with WebGL renderers and offers a way to give your application a distinct feel.

For most common cases (ie. straight edges and round nodes), you can directly override the `defaultDrawEdgeLabel`, `defaultDrawNodeLabel` and `defaultDrawNodeHover` settings. When you start having various shapes of nodes and/or edges (square nodes, curved edges...), you need to specify labels and hovered items renderers for each program. Each node program can have optional `drawLabel` and `drawHover` methods, and each edge program can have an optional `drawLabel` method.

For a practical demonstration of this method, check out the website's demo, specifically the [`canvas-utils.ts` section](https://github.com/jacomyal/sigma.js/blob/main/packages/demo/src/canvas-utils.ts).

## Custom renderers

For those seeking a deeper level of customization, sigma.js allows the creation of custom renderers. This option is ideal for those who want nodes and edges rendered in non-standard ways, such as nodes with borders or unique shapes.

The [`custom-rendering`](https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/custom-rendering) example provides a detailed guide on how to craft bordered nodes, serving as a starting point for those interested in exploring this advanced customization avenue.
