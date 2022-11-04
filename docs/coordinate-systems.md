# Sigma coordinate sytems

## 1. The graph space: `graph`

The graph contains nodes having arbitrary `(x, y)` positions.

![graph-space](./img/graph-space.svg)

## 2. Normalized graph space: `framedGraph`

First we compute the extend (min & max values) for `x` and `y` coordinates in graph space.

![graph-space-extent](./img/graph-space-extent.svg)

Then we normalize this space into a square such that graphspace `min` becomes `0` and graphspace max `1`.
