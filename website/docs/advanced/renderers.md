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

## Existing programs

Sigma.js comes with a set of predefined programs:

### For edges:

- **`edge.line`**: This is the most efficient method, rendering edges using the `gl.LINES` method. However, it always draws edges as 1px thick lines, regardless of zoom levels.

- **`edge.rectangle`**: This is the default edge renderer. It portrays edges as thick rectangles connecting node pairs, with each rectangle being represented by two triangles.

- **`edge.arrow`**: This is a composite renderer that uses `edge.clamped` (for drawing the arrow body) and `edge.arrowHead` (for drawing the arrow head).

### For nodes:

- **`node.point`**: This method displays nodes as squares using the `gl.POINTS` method. A circle is then "carved" into this square in the fragment shader. It's highly efficient in terms of both RAM and execution speed. However, due to the limitations of the `gl.POINTS` method, nodes can't be drawn with a radius exceeding 100px.

- **`node.circle`**: This method displays nodes as squares, represented by two triangles (similar to `edge.rectangle`). A circle is then "carved" into this square in the fragment shader.

- **`node.image`**: This method operates similarly to `node.point`, but it fills the circles with images using a texture atlas.

For a deeper understanding and practical examples, developers are encouraged to explore the existing sigma.js sources and examples. This hands-on approach will provide a clearer picture of how to effectively use and customize renderers in sigma.js.
