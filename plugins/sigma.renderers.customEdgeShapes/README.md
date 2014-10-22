sigma.renderers.customEdgeShapes
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious).

Contact: seb@linkurio.us

---
## General
This plugin registers custom edge shape renderers. See the following [example code](../../examples/plugin-customEdgeShapes.html) for full usage.

To use, include all .js files under this folder.

## Shapes
The plugin implements the following shapes:
  * `dashed`
  * `dotted`
  * `parallel`: two solid parallel lines representing an edge aggregating multiple edges in the original graph.
  * `tapered` (see Danny Holten, Petra Isenberg, Jean-Daniel Fekete, and J. Van Wijk (2010) Performance Evaluation of Tapered, Curved, and Animated Directed-Edge Representations in Node-Link Graphs. Research Report, Sep 2010.)

To assign a shape renderer to an edge, simply set `edge.type='shape-name'` e.g. `edge.type='dotted'`. The default renderer implemented by sigma.js is named `def` (alias `line`) - see also [generic custom edge renderer example](../../examples/custom-edge-renderer.html).
