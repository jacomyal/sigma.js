sigma.renderers.edgeDots
========================

Plugin developed by [Joakim af Sandeberg](https://github.com/jotunacorn).

Contact: joakim.afs+github@gmail.com

---
## General
This plugin adds the option to show colored dots near the source and target of an edge when using the canvas renderer.

See the following [example](../../examples/plugin-edgeDots.html) for full usage.

To use it, include all .js files under this folder.

## Edges

This plugin extends Sigma.js canvas edges:
 * **sourceDotColor**
   * The value to use as color for the source dot. If left undefined there will be no dot at the source.
   * type: *string*
   * default value: undefined
 * **targetDotColor**
   * The value to use as color for the target dot. If left undefined there will be no dot at the target.
   * type: *string*
   * default value: undefined
 * **dotOffset**
   * The value which define the distance between the dots and the nodes, relative to the node size.
   * type: *number*
   * default value: 3
 * **dotSize**
   * The value which define the size of the dot relative to the edge.
   * type: *number*
   * default value: 1
## Renderers

This plugin modifies the sigma.canvas.edges.curve and sigma.canvas.edges.curvedArrow

