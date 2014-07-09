sigma.renderers.customEdgeShapes
==================

Plugin developed by [Linkurious](https://github.com/Linkurious), greatly inspired by [Ron Peleg](https://github.com/rpeleg1970).

---
## General
This plugin registers custom edge shape renderers. See the following [example code](../../examples/plugin-customEdgeShapes.html) for full usage.

To use, include all .js files under this folder.

## Shapes
The plugin implements the following shapes. To set a shape renderer, you simply set `edge.type='shape-name'` e.g. `edge.type='dotted'`. The default renderer implemented by sigma.js is named `def` - see also [generic custom edge renderer example](../../examples/custom-edge-renderer.html)
  * `solid`: similar to the `def` renderer
  * `dotted`
  * `dashed`
  * `tapered` (see Danny Holten, Petra Isenberg, Jean-Daniel Fekete, and J. Van Wijk (2010) Performance Evaluation of Tapered, Curved, and Animated Directed-Edge Representations in Node-Link Graphs. Research Report, Sep 2010.)
  * `parallel`: two solid parallel lines representing an edge aggregating multiple edges in the original graph.

The list of available renderer types can be obtained by calling `EdgeShapeLibrary.enumerate()`
