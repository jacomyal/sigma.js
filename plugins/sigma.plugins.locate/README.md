sigma.plugins.locate
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious).

---
## General
This plugin locate nodes and edges in the visualization y animating the camera to fit the specified elements on screen.

See the following [example code](../../examples/locate.html) for full usage.

To use it, include all .js files under this folder.

## Status

Unstable

## Usage

Locate a single node:

````javascript
sigma.plugins.locateNodes(sigInst, n);
````

Locate multiple nodes:

````javascript
sigma.plugins.locateNodes(sigInst, ['n0', 'n1']);
````

Locate a single edge:

````javascript
sigma.plugins.locateEdges(sigInst, e);
````

Locate multiple edges:

````javascript
sigma.plugins.locateEdges(sigInst, ['e0', 'e1']);
````

## Limitations

This plugins doesn't work when `autoRescale=false`. I'm sure there is a way to make it work but I don't understand the camera system of sigma enough. I'd appeciate any guidance on it.

Not tested with `scalingMode=outside`.
