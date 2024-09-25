---
title: Coordinate systems
sidebar_position: 4
---

# Coordinate systems

## The graph space: `graph`

The graph contains nodes having arbitrary `(x, y)` positions.

<img alt="graph-space" src="/img/coordinate-systems/graph-space.svg" width="300" />

## Normalized graph space: `framedGraph`

First we compute the extent (min & max values) for `x` and `y` coordinates in graph space.

<img alt="graph-space-extent" src="/img/coordinate-systems/graph-space-extent.svg" width="300" />

Then we normalize this space into a "square" (quotation marks hereafter explained) such that graphspace `min` becomes `0` and graphspace max `1`.

But, to complicate this a bit, it is important to understand that the aspect ratio of the original graph space remains inscribed in our normalized "square".

This means either `x` or `y` dimension (the one having the smallest extent) will not be translated to `min = 0` and `max = 1` but will instead have something like `min > 0` and `max < 1`.

<img alt="framed-graph-space" src="/img/coordinate-systems/framed-graph-space.svg" width="300" />

## Viewport space: `viewport`

When dealing with 2d canvas (when drawing labels, for instance, or reacting to user mouse events), it can be useful to be able to translate to the viewport coordinates symbolized by a `width` and a `height` in pixels.

One thing to note is that the `y` dimension is then flipped, higher values of `y` meaning lower on the screen.

One other thing to note is that sigma will correct for the aspect ratio of your viewport to make sure (also considering an optional padding) your graph will occupy a maximum of available screen space.

<img alt="viewport-space" src="/img/coordinate-systems/viewport-space.svg" width="300" />

## WebGL vertex shader output space: `clipspace`

In the vertex shader, we translate from `frameGraph` to `clipspace` that has dimensions ranging from `-1` to `1`.

Doing so, we apply a correction to make sure the resulting space is a real square with both dimensions ranging from min (`-1`) to max (`1`).

<img alt="clipspace" src="/img/coordinate-systems/clipspace.svg" width="300" />

In the fragment shader, the position is then expressed in `viewport` space.

This means doing computation in rendered pixel in the vertex shader is not easy, and transferring values from the vertex shader to the fragment one is not easy either.
