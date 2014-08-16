sigma.plugins.locate
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the license [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin locate nodes and edges in the visualization y animating the camera to fit the specified elements on screen.

See the following [example code](../../examples/locate.html) for full usage.

To use it, include all .js files under this folder. Then initialize it as follows:

````javascript
var locate = sigma.plugins.locate(sigInst);
````

## Configuration

The plugin can jump to a halfway point when animating the camera from its current position to the target position. The expected behavior is to zoom out to reach that point in order to help the user orientate in space (see Google Maps for instance). To enable this behavior, initialize the plugin as follows:

````javascript
var locate = sigma.plugins.locate(sigInst, {
  focusOut: true,
  zoomDef: 1
});
````

where `focusOut=true` enables the behavior discussed above, and the `zoomDef` number gives the zoom ratio of the camera above the halfway point. If `zoomDef` is missing the plugin uses the `zoomMax` value of sigma settings instead.

## Status

Beta

## Usage

Locate a single node:

````javascript
locate.nodes(n);
````

Locate multiple nodes:

````javascript
locate.nodes([n0, n1]);
````

Locate a single edge:

````javascript
locate.edges(e);
````

Locate multiple edges:

````javascript
locate.edges([e0, e1]);
````

These functions may take an optional parameter to configure the animation, e.g.:

````javascript
locate.nodes(n, {duration: 800});
````

This object is the option parameter of `sigma.misc.animation.camera`. See the doc of the function for more information. 

## Known bugs

When `autoRescale=true` the plugin may not compute the optimal zoom ratio. I'd appreciate any guidance on this issue.
