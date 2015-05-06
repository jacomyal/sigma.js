sigma.renderers.mirrorEdges
==================

Plugin developed by [Hamid Maadani](https://github.com/21stcaveman).

Contact: hamid@maadani.com

---
## General
This plugin allows changing the orientaion of edges (draw from child to parent or from parent to child) for Arrow and curvedArrow edge types.

See the following [example](../../examples/mirror-edges.html) for full usage.

To use it, include all .js files under this folder.

## Edges

This plugin extends Sigma.js edges:

 * **mirror**
   * Represents if the edge is mirrored or not. By default, an edge will be drawn from source node to target node. If mirror is set, it will be draw from target node to source node.
   * One simple solution to achieve this would be simply swapping the source and target node for the edge, but there are specific applications where you need to keep the nodes as they are
   * and only draw the edge in reverse. That is what this plugin does.
   * type: *boolean*
   * default value: false

 * **pSize**
   * represents the distance between arrow endpoint's (source or target node) center, and tip of the arrow.
