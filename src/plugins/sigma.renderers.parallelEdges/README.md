sigma.renderers.edgeLabels
==================

Plugin developed by [Jack Miner](https://github.com/3ch01c).

Contact: 3ch01c@gmail.com

---
## General
This plugin allows visualizing multiple parallel edges.

See the following [example](../../examples/parallel-edges.html) for full usage.

To use it, include all .js files under this folder.

## Edges

This plugin extends Sigma.js edges:

 * **count**
   * Represents the index of the edge in the set of parallel edges. Inversely proportional to the amplitude of the vertex of the edge curve.
   * type: *number*
   * default value: `0`

## Renderers

This plugin modifies

## Utils

This plugin modifies functions `sigma.utils.getQuadraticControlPoint` and `sigma.utils.getSelfLoopControlPoints` with an optional amplitude modifier parameters.
