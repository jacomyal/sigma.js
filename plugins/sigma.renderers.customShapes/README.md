sigma.renderers.customShapes
==================

Plugin developed by [Ron Peleg](https://github.com/rpeleg1970).

---
## General
This plugin registers custom node shape renderers, and allows adding scaled images on top of them. See the following [example code](../../examples/plugin-customShapes.html) for full usage.

To use, include all .js files under this folder.

The plugin implements the `node.borderColor` property to allow control of the (surprise) border color.

## Shapes
The plugin implements the following shapes. To set a shape renderer, you simply set `node.type='shape-name'` e.g. `node.type='star'`. The default renderer implemented by sigma.js is named `def` - see also [generic custom node renderer example](../../examples/custom-node-renderer.html)
  * `circle`: similar to the `def` renderer, but also allows images
  * `square`
  * `diamond`
  * `equilateral`: equilateral polygon. you can control additional properties in this polygon by setting more values as follows:
````javascript
  node.equilateral = {
    rotate: /* rotate right, value in deg */,
    numPoints: /* default 5, integer */ 
  }
````
  * `star`:  you can control additional properties in this star by setting more as follows:
````javascript
  node.star = {
    numPoints: /* default 5, integer */,
    innerRatio: /* ratio of inner radius in star, compared to node.size */
  }
````
  * `cross`: plus shape. you can control additional properties in this polygon by setting more values as follows:
````javascript
  node.cross = {
    lineWeight: /* width of cross arms */,
  }
````
  * `pacman`: an example of a more exotic renderer

The list of available renderer types can be obtained by calling `ShapeLibrary.enumerate()`

## Images
You can add an image to any node, simply by adding `node.image` property, with the following content:
````javascript
node.image = {
  url: /* mandatory image URL */,
  clip: /* Ratio of image clipping disk compared to node size (def 1.0) - see example to how we adapt this to differenmt shapes */,
  scale: /* Ratio of how to scale the image, compared to node size, default 1.0 */,
  w: /* numeric width - important for correct scaling if w/h ratio is not 1.0 */,
  h: /* numeric height - important for correct scaling if w/h ratio is not 1.0 */
}
````
Because the plug-in calls the sigma instance `refresh()` method on image loading, you MUST init as follows or you will not see rendered images:
````javascript
  s = new sigma({
   ...
  });
  CustomShapes.init(s);
  s.refresh();
````
