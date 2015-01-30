sigma.pathfinding.astar.js — v1.0.0
===================================

> Plugin author: [@A----](https://github.com/A----)
> Main repository for this plugin is here: https://github.com/A----/sigma-pathfinding-astar
> Please report issues, make PR, there.
> This project is released under Public Domain license (see LICENSE for more information).


*sigma.pathfinding.astar.js* is a plugin for [sigma.js](http://sigmajs.org) that computes path in a graph
using a naive implementation of the [A*](http://en.wikipedia.org/wiki/A*_search_algorithm) algorithm.

## Usage

Either download a tarball, `git clone` the repository or `npm install` it. Then it's pretty straight-forward.

It adds a method to your `sigma.graph` called `astar(srcId, destId[, options])`.
- `srcId`, identifier of the start node;
- `destId`, identification of the destination node;
- `options` (optional), an object containing one or more of those properties:
   - `undirected` (default: `false`), if set to `true`, consider the graph as non-oriented (will explore all edges, including the inbound ones);
   - `pathLengthFunction` (default is the geometrical distance), a `function(node1, node2, previousLength)` that should return the new path length between the start node and `node2`, knowing that the path length between the start node and `node1` is contained in `previousLength`.
   - `heuristicLengthFunction` (default: `undefined`), a `function(node1, node2)` guesses the path length between `node1` and `node2` (`node2` actually is the destination node). If left undefined, takes the `pathLengthFunction` option (third parameter will be left undefined).

Return value is either:
- `undefined`: no path could be found between the source node and the destination node;
- `[srcNode, …, destNode ]`: an array of nodes, including source and destination node.
