sigma.helpers.graph
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

---
## General
This plugin extends the [Graph API](https://github.com/jacomyal/sigma.js/wiki/Graph-API) with new public methods:

**dropNodes( *array* )** : *graph*
 * This methods is used to drop a set of nodes from the graph. The method must be called with an array of node IDs.

**dropEdges( *array* )** : *graph*
 * This methods is used to drop a set of edges from the graph. The method must be called with an array of edge IDs.

**adjacentNodes( *string* )** : *array*
 * This methods is used to retrieve the adjacent nodes of a specified node from the graph. The method must be called with the ID of a node.

**adjacentEdges( *string* )** : *array*
 * This methods is used to retrieve the adjacent edges of a specified node from the graph. The method must be called with the ID of a node.

**hoverNode( *string, ?boolean* )** : *graph*
 * This methods is used to set the `hover` attribute of a node. The method must be called with the ID of a node, and optionally a boolean value of the `hover` attribute. To hover the node, call `hoverNode(id)`. To un-hover the node, call `hoverNode(id, false)`.
 * The method returns the graph instance.

**hoverEdge( *string, ?boolean* )** : *graph*
 * This methods is used to set the `hover` attribute of an edge. The method must be called with the ID of an edge, and optionally a boolean value of the `hover` attribute. To hover the edge, call `hoverEdge(id)`. To un-hover the edge, call `hoverEdge(id, false)`.
 * The method returns the graph instance.

See the following [unit tests](../../test/unit.helpers.graph.js) for full usage.

To use, include all .js files under this folder.
