---
title: Migrating from v2 to v3
sidebar_position: 10
---

This guide will help users migrating their applications from sigma v2.\* to v3.\*.

## Exports endpoints

Sigma v3 is built using [Preconstruct](https://preconstruct.tools/), and there are only 5 endpoints now:

- `"sigma"` exports the main `Sigma` class, and the other utility classes `Camera`, `MouseCaptor` and `TouchCaptor`;
- `"sigma/rendering"` exports everything rendering related, from the programs to the related classes and types;
- `"sigma/settings"` exports the `Settings` interface, the `DEFAULT_SETTINGS` collection and the `validateSettings` and `resolveSettings` utility functions;
- `"sigma/types"` exports all remaining sigma specific types (for TypeScript only);
- `"sigma/utils"` exports all kind of various utility functions.

Also, the `node.image` program is no more exported from sigma, but must be imported from another dedicated package: [`@sigma/node-image`](https://www.npmjs.com/package/@sigma/node-image).

## Programs

Sigma v3 has been developed to handle various limitations of sigma v2's nodes and edges **programs**. Basically:

- Programs were very hard to maintain and to develop, with _a lot_ of boilerplate
- There were various optimizations we wanted to implement, such as [_picking_](https://webglfundamentals.org/webgl/lessons/webgl-picking.html) and [_instanced rendering_](https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html), that would require breaking changes, at the time
- Coordinate systems translations where messy and poorly documented, and becoming harder and harder to maintain

So, we refined it completely from scratch, to handle all those issues.

### Existing programs

Breaking everything in the programs was the opportunity to rename existing program, to better fit what they do:

- `edge-fast` becomes `edge.line` (since it uses the `WebGLRenderingContext.LINES` drawing method)
- `edge` becomes `edge.rectangle` (as edges are rendered as rectangles, using two `WebGLRenderingContext.TRIANGLES`)
- `node-fast` becomes `node.point` (since it uses `WebGLRenderingContext.POINTS`)
- `node` becomes `node.circle` (as nodes are rendered as circles, carved inside `WebGLRenderingContext.TRIANGLES`)
- `node-image` becomes [`@sigma/node-image`](https://www.npmjs.com/package/@sigma/node-image), a new satellite package

### New API

A **node program** must extend the [**`NodeProgram`** classe](https://github.com/jacomyal/sigma.js/blob/main/packages/sigma/src/rendering/node.ts), and an **edge program** must extend the [**`EdgeProgram`** classe](https://github.com/jacomyal/sigma.js/blob/main/packages/sigma/src/rendering/edge.ts). Those two classes are designed so that only specific code remains in the programs, without all the boilerplate.

**The best to do to understand how to write programs for sigma v3 is to read the existing programs.** The simplest ones are [**`edge.line`**](https://github.com/jacomyal/sigma.js/tree/main/packages/sigma/src/rendering/programs/edge-line) and [**`node.point`**](https://github.com/jacomyal/sigma.js/tree/main/packages/sigma/src/rendering/programs/node-point).

Some insights, though:

- To help with TypeScript inference, **uniforms** are generally defined outside the program, and given as generics;
- Every programs now have a `getDefinition` method, that returns various data that help sigma properly initializing the related WebGL program;
- Programs also must have a `processVisibleItem`, that feeds the `Float32Array` with the data related to a given item;
- Finally, programs also provide a `setUniforms` method, that sets the proper uniform values.

### Picking

In sigma v3, the collision detection is no more handle with CPU-based computation. The two main issues were:

- The quad-tree index for nodes was hard to maintain, and only handled disc nodes;
- The ad-hoc code that handled edges collisions was slow, and only handled linear edges.

The picking work as following:

- In addition to the visible layers, two more layers are rendered, where each node and edge is drawn with a unique color, that represents its ID;
- To know what is at a given pixel, we look at the related picking layer, and if it is a colored pixel, then we instantly know what item it belongs to.

There are two main costs, though:

- Everything is rendered twice;
- Every program must handle rendering for **both modes** ("normal" and "picking").

To handle picking within a program, here are the things that must be taken into account:

1. In addition to the color, the ID must also be stored into the data transferred to the CPU. The `processVisibleItem` receives the ID, properly encoded as a 4 bytes value (as the color), as its first argument.
2. In the _vertex shader_, the color given to the _fragment shader_ must be the item color for the normal layer, and the ID for the picking layer. This is done using the `PICKING_MODE` macro defined constant:

```glsl
#ifdef PICKING_MODE
// For picking mode, we use the ID as the color:
v_color = a_id;
#else
// For normal mode, we use the color:
v_color = a_color;
#endif
```

3. In the _fragment shader_, in the picking layer, pixels should either remain uncolored or colored with the given color. There should be no antialiasing. Indeed, if the color is changed, it might become the ID of another item.

### Instanced rendering

In sigma v2, there were a lot of repeated data transmitted to the GPU. For instance, to render an edge as a rectangle, all the required data were written [four times](https://github.com/jacomyal/sigma.js/blob/7b3a5ead355f7c54449002e6909a9af2eecae6db/src/rendering/webgl/programs/edge.ts#L166-L193). To fixe this issue, sigma v3 uses _instanced rendering_. Basically, there are now two different buffers: one that carries data related to each item (node or edge), and another that carries data related to each vertex. Then, the program will handle those buffers to send to the _vertex shader_ both the item related data and the vertex related data.

All programs do not use instanced rendering. For instance, [**`node.point`**](https://github.com/jacomyal/sigma.js/tree/main/packages/sigma/src/rendering/programs/node-point) does need it, since there is only one vertex per node. Basically, every program that use the `WebGLRenderingContext.TRIANGLES` method should probably use instanced rendering.

So, to use instanced rendering, the `getDefinition` method of a program must provide a **`CONSTANT_ATTRIBUTES`** array, shaped as the `ATTRIBUTES` array, but with attributes that are related to each vertex, and a **`CONSTANT_DATA`** that stores an array of data for each vertex. The simplest program that uses instanced rendering might be [**`node.circle`**](https://github.com/jacomyal/sigma.js/tree/main/packages/sigma/src/rendering/programs/node-circle). **It is certainly a good program to read to better understand how to write a program using instanced rendering**.

### Canvas labels and hovered nodes rendering

Finally, the way sigma handles canvas renderers for nodes and edges labels and hovered nodes have been updated:

- Each program class can provide its own canvas renderers (an optional `drawLabel` method, and an additional optional `drawHover` only for node renderers). This allows programs that render different shapes to have custom labels rendering (such as [`@sigma/edge-curve`](https://www.npmjs.com/package/@sigma/edge-curve) for instance).
- Programs that do not provide their own `drawLabel` or `drawHover` methods rely on the `defaultDrawEdgeLabel`, `defaultDrawNodeLabel` and `defaultDrawNodeHover` settings. This allows overriding canvas renderers for all "classic" programs (ie. circle nodes and straight edges) all at once.

## Other breaking changes

### TypeScript generics

In sigma v3, the `Sigma` class accepts the same generics as its carried `Graph` instance. This helps to have reducers or other helpers written with the proper node and/or edge attributes.

### Settings

Some settings have been updated:

- `enableEdgeClickEvents`, `enableEdgeWheelEvents` and `enableEdgeHoverEvents` disappear and are all replaced by the single **`enableEdgeEvents`** setting;
- `labelRenderer`, `hoverRenderer` and `edgeLabelRenderer` disappear and are respectively replaced by **`defaultDrawNodeLabel`**, **`defaultDrawNodeHover`** and **`defaultDrawEdgeLabel`**;
- **`zoomToSizeRatioFunction`** and **`itemSizesReference`** are added to handle cases where nodes grow linearly with the zoom and all items sizes and positions are in the same coordinates system.
