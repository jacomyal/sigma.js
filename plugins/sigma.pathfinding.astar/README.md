sigma.pathfinding.astar.js — v1.0.0
===================================

Plugin developed by [A----](https://github.com/A----) and published under the licence [Public Domain](LICENSE).

Main repository for this plugin is here: <https://github.com/A----/sigma-pathfinding-astar>. Please report issues and make pull requests there.

---
## General

This plugin computes paths in a graph using a naive implementation of the [A*](http://en.wikipedia.org/wiki/A*_search_algorithm) algorithm.

![Astar](https://github.com/Linkurious/sigma.js/wiki/media/astar.gif)

See the following [example code](../../examples/plugin-pathfinding-astar.html)  for full usage.

To use, include all .js files under this folder.

## Usage

This plugin adds the static method `.astar(srcId, destId, ?options)` to `sigma.classes.graph` with the following signature:

**astar( *string|number*, *string|number*, ?*object* )** : *array*
   - **srcId**: *string|number*, identifier of the source node.
   - **destId**: *string|number*, identifier of the target node.
   - **options**: ?*object*, an object of optional settings.

The method returns an ordered array of nodes if a path is found, including the source node and the target node, or `undefined` otherwise.

### Options

* **undirected**: *boolean* (default: `false`)
   - If set to `true`, consider the graph as non-oriented (will explore all edges, including the inbound ones).
* **pathLengthFunction**: *function(node1, node2, previousLength)* (default: the geometrical distance)
   - A function that should return the new path length between the start node and `node2`, knowing that the path length between the start node and `node1` is contained in `previousLength`.
* **heuristicLengthFunction**: *function(node1, node2)* (default: `pathLengthFunction`)
   - A function that guesses the path length between `node1` and `node2` (`node2` actually is the target node). If undefined, takes the `pathLengthFunction` option (third parameter will be left undefined).

### Example

````javascript
var path = sigInst.graph.astar('n0', 'n5', {
  undirected: true
});
// path = ['n0', …, 'n5']
````
