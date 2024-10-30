---
title: Renderers
sidebar_position: 3
---

# Renderers in Sigma.js

## Introduction

Sigma.js utilizes WebGL to render nodes and edges. WebGL is a JavaScript API designed for rendering 2D and 3D graphics in web browsers without requiring plugins. While WebGL offers detailed control over graphics rendering, its direct use can be complex because of its low-level specifications.

### Brief overview of WebGL

At its core, WebGL operates using two main components: vertex shaders and fragment shaders.

- **Vertex Shaders**: These are responsible for processing each vertex and determining its position on the screen. They take in attributes of the vertices and output a position.

- **Fragment Shaders**: Once the position of vertices is known, fragment shaders determine the color of each pixel in the area bounded by those vertices. They take the output from the vertex shader and produce the final color.

Given the austere nature of WebGL, sigma.js introduces the `NodeProgram` and `EdgeProgram` classes. These classes are designed to manage the data bindings and lifecycle, simplifying the process for developers.

## NodeProgram and EdgeProgram

When you're looking to create a custom `NodeProgram`, there are specific components you need to provide:

- **Vertex and Fragment Shaders**: These are essential for processing the graphical data. You'll need to provide both to define how your nodes or edges will be rendered.

- **Program definition**: The program definition describes how much vertices make each item (node or edge), which attributes (relative to each vertice) and uniforms (constant for all vertices and items) should be given to the shaders.

- **The program class**: A class that puts everything together, and adds:
  - A `getDefinition` method that returns the program definition.
  - A `processVisibleItem(offset: number, data: NodeDisplayData)` method that populates `this.array` with the appropriate values.
  - A `draw(params: RenderParams)` method that manages setting the correct uniform values and the final call to `gl.drawArrays`.

Additionally, sigma.js offers helpers to compose programs, making it easier to combine different functionalities.

## Picking

To detect collision between a given point (the mouse position, or where a touch event occurred for instance) and nodes and edges, we use a technic called **[picking](https://webglfundamentals.org/webgl/lessons/webgl-picking.html)**.

Basically, we draw two images: One that the users see, with proper nodes and edges colors, antialiasing etc... And another one, where each item is drawn with a unique color. To know which item is at a given position, we look at the color of the corresponding pixel in the "picking image", and if it has a color, we get which item has this unique color.

Each program must provide code to render on both the normal image and the picking image. For this, we use a "preprocessor" called `PICKING_MODE`. When the program is used to generate the normal image, `PICKING_MODE` is `false`, while it's `true` for picking. Please read the existing programs to have a better idea on how to use that.

## Core programs

Sigma.js comes with a set of predefined programs, all exported from `"sigma/rendering"`:

### For edges

- **`EdgeLineProgram`**: This is the most efficient method, rendering edges using the `gl.LINES` method. However, it always draws edges as 1px thick lines, regardless of zoom levels.

- **`EdgeRectangleProgram`**: This is the default edge renderer. It portrays edges as thick rectangles connecting node pairs, with each rectangle being represented by two triangles.

- **`EdgeArrowProgram`**: This is a composite renderer that uses `EdgeClampedProgram` (for drawing the arrow body) and `EdgeArrowHeadProgram` (for drawing the arrow head).

> **_NOTE:_** The three programs `EdgeArrowProgram`, `EdgeClampedProgram` and `EdgeArrowHeadProgram` each also exist as a factory, to allow generating a program with custom arrow head width and length (relatively to the edge thicknesses). The factory are called `createEdgeArrowProgram`, `createEdgeClampedProgram` and `createEdgeArrowHeadProgram`.

### For nodes

- **`NodePointProgram`**: This method displays nodes as squares using the `gl.POINTS` method. A circle is then "carved" into this square in the fragment shader. It's highly efficient in terms of both RAM and execution speed. However, due to the limitations of the `gl.POINTS` method, nodes can't be drawn with a radius exceeding 100px.

- **`NodeCircleProgram`**: This method displays nodes as squares, represented by two triangles (similar to `EdgeRectangleProgram`). A circle is then "carved" into this square in the fragment shader.

For a deeper understanding and practical examples, developers are encouraged to explore the existing sigma.js sources and examples. This hands-on approach will provide a clearer picture of how to effectively use and customize renderers in sigma.js.

## Additional programs

Some more programs are also exposed, but as they carry more complexity, they are published as additional packages.

- [**`@sigma/node-image`**](https://www.npmjs.com/package/@sigma/node-image): This package exposes a factory to create a program that operates similarly to `NodeCircleProgram`, but filling the circles with images using a texture atlas.
- [**`@sigma/node-border`**](https://www.npmjs.com/package/@sigma/node-border): This package exposes a factory to create a program that operates similarly to `NodeCircleProgram`, but drawing concentric discs.
- [**`@sigma/node-piechart`**](https://www.npmjs.com/package/@sigma/node-piechart): This package exposes a factory to create a program that operates similarly to `NodeCircleProgram`, but drawing nodes as pie-charts.
- [**`@sigma/node-square`**](https://www.npmjs.com/package/@sigma/node-square): This package exposes a simple program that renders nodes as squares.
- [**`@sigma/edge-curve`**](https://www.npmjs.com/package/@sigma/edge-curve): This package exposes an edge renderer that draw edges as curves.

## Additional layers

There are also some other packages, that allow rendering additional layers as backgrounds, to display more contextual information.

- [**`@sigma/layer-leaflet`**](https://www.npmjs.com/package/@sigma/layer-leaflet): This package exposes a function to bind a [Leaflet](https://leafletjs.com/) map layer to an existing sigma instance.
- [**`@sigma/layer-maplibre`**](https://www.npmjs.com/package/@sigma/layer-maplibre): Similarly, this package exposes a function to bind a [MapLibre](https://maplibre.org/) map layer to an existing sigma instance.
- [**`@sigma/layer-webgl`**](https://www.npmjs.com/package/@sigma/layer-webgl): This package exposes helpers to create WebGL custom layers and bind them to existing sigma instances. It also exposes some base layers, such as [metaballs](https://www.sigmajs.org/storybook/?path=/story/sigma-layer-webgl--metaballs) or [contour lines](https://www.sigmajs.org/storybook/?path=/story/sigma-layer-webgl--contour-line).
