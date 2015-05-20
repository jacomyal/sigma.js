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

Kill the plugin instance as follows:

````javascript
sigma.plugins.killLocate(sigInst);
````

## Configuration

Configure the plugin as follows:

````javascript
var locate = sigma.plugins.locate(sigInst, {
  // ANIMATION SETTINGS:
  // **********
  animation: {
    node: {
      duration: 300
    },
    edge: {
      duration: 300
    },
    center: {
      duration: 300
    }
  },
  // PADDING:
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  // GLOBAL SETTINGS:
  // **********
  focusOut: true,
  zoomDef: 1
});
````

 * **animation**
   * The different animation options when calling `nodes()`, `edges()`, and `center()`. See [`sigma.misc.animation.camera`](https://github.com/jacomyal/sigma.js/blob/master/src/misc/sigma.misc.animation.js#l47) for a list of accepted parameters.
   * type: *object*
   * default value: see above
 * **padding**
   * The space (in screen pixels) between the renderer border and the renderer content. The parameters are `top`, `right`, `bottom`, `left`.
   * type: *object*
   * default value: see above
 * **focusOut**
   * Make to zoom out to reach a halfway point between the current position to the target position during camera animation, to help the user orientate in space (see Google Maps for instance).
   * type: *boolean*
   * default value: `false`
 * **zoomDef**
   * The zoom ratio of the camera above the halfway point. If `zoomDef` is missing the plugin uses the `zoomMax` value of sigma settings instead.
   * type: *number*
   * default value: `null`


## Public methods

**nodes( *string, ?object* )** : *sigma.plugins.locate*
**nodes( *array, ?object* )** : *sigma.plugins.locate*
 * This method locates a node or a set of nodes in the visualization given their IDs. It will move the camera to the equidistant position from the specific nodes. It may change the zoom ratio of the camera to focus on the node or to fit the screen on the set of nodes.
 * The method returns the instance itself.

````javascript
// Locate a single node:
locate.nodes('n0');

// Locate multiple nodes:
locate.nodes(['n0', 'n1']);
````

**edges( *string, ?object* )** : *sigma.plugins.locate*
**edges( *array, ?object* )** : *sigma.plugins.locate*
 * This method locates an edge or a set of edges in the visualization given their IDs. It will move the camera to the equidistant position from the specific edge extremities. It may change the zoom ratio of the camera to to fit the screen on the edge(s).
 * The method returns the instance itself.

````javascript
// Locate a single edge:
locate.edges('e0');

// Locate multiple edges:
locate.edges(['e0', 'e1']);
````

**center( *number, ?object* )** : *sigma.plugins.locate*
 * This method moves the camera to the equidistant position from all nodes, or to the coordinates (0, 0) if the graph is empty, given a final zoom ratio.
 * The method returns the instance itself.

````javascript
locate.center(1);
````

**setPadding( *object* )** : *sigma.plugins.locate*
 * This method set the padding, i.e. the space (in screen pixels) between the renderer border and the renderer content. The parameters are `top`, `right`, `bottom`, `left`.
 * The method returns the instance itself.

````javascript
locate.setPadding({
  right:250
});
````

#### Optional argument

These functions may take an optional parameter to configure the animation, e.g.:

````javascript
locate.nodes('n0', {
duration: 800,
onComplete: function() {/* do something when it's done. */}
});
````

See [`sigma.misc.animation.camera`](https://github.com/jacomyal/sigma.js/blob/master/src/misc/sigma.misc.animation.js#l47) for a list of accepted parameters in this object.
