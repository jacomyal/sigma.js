# Sigma coordinate sytems

## 1. The graph space: `graph`

The graph contains nodes having arbitrary `(x, y)` positions.

<img alt="graph-space" src="./img/graph-space.svg" width="300">

## 2. Normalized graph space: `framedGraph`

First we compute the extend (min & max values) for `x` and `y` coordinates in graph space.

<img alt="graph-space-extent" src="./img/graph-space-extent.svg" width="300">

Then we normalize this space into a square such that graphspace `min` becomes `0` and graphspace max `1`.
