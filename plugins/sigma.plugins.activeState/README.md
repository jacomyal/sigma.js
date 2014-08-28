sigma.plugins.activeState
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides a new state called `active` to nodes and edges. Graphical elements in user interfaces have usually multiple states like `hover`, `focus`, and `active`. They are keys to enable great user interaction. For instance, one might create a plugin that drag all active nodes, which are eventually considered as "selected" elements. Sigma.js provides the `hover` state only.

See the following [example code](../../examples/active-state.html) and [unit tests](../../test/unit.plugins.activeState.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var activeState = sigma.plugins.activeState(sigInst.graph);
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killActiveState();
````

## Public methods

**nodes()** : *array*
 * The method returns the active nodes.

**edges()** : *array*
 * The method returns the active edges.

**addNodes()** : *sigma.plugins.activeState*
**addNodes( *string* )** : *sigma.plugins.activeState*
**addNodes( *array* )** : *sigma.plugins.activeState*
 * This method set one or several nodes as 'active', depending on how it is called. To activate the array of nodes, call it without argument. To activate a specific node, call it with the id of the node. To activate multiple nodes, call it with an array of ids.
 * The method returns the plugin instance.

**addEdges()** : *sigma.plugins.activeState*
**addEdges( *string* )** : *sigma.plugins.activeState*
**addEdges( *array* )** : *sigma.plugins.activeState*
 * This method set one or several edges as 'active', depending on how it is called. To activate the array of edges, call it without argument. To activate a specific edge, call it with the id of the edge. To activate multiple edges, call it with an array of ids.
 * The method returns the plugin instance.

**dropNodes()** : *sigma.plugins.activeState*
**dropNodes( *string* )** : *sigma.plugins.activeState*
**dropNodes( *array* )** : *sigma.plugins.activeState*
 * This method set one or several nodes as 'inactive', depending on how it is called. To deactivate the array of nodes, call it without argument. To deactivate a specific node, call it with the id of the node. To deactivate multiple nodes, call it with an array of ids.
 * The method returns the plugin instance.

**dropEdges()** : *sigma.plugins.activeState*
**dropEdges( *string* )** : *sigma.plugins.activeState*
**dropEdges( *array* )** : *sigma.plugins.activeState*
 * This method set one or several edges as 'inactive', depending on how it is called. To deactivate the array of edges, call it without argument. To deactivate a specific edge, call it with the id of the edge. To deactivate multiple edges, call it with an array of ids.
 * The method returns the plugin instance.

Don't forget to call `sigInst.refresh()` after calling these methods to update the visualization.

## Events

The plugin instance may dispatch the following events:
- `activeNodes`: fired when the list of active nodes is modified.
- `activeEdges`: fired when the list of active edges is modified.

These events have no data and may be fired a lot in short amounts of time. You should listen to these events with debounced callbacks to avoid performance issues, e.g.:

````javascript
// LoDash.js or Underscore.js provide a debounce function.
var activeNodesCallback = _.debounce(function(event) {
  console.log('active nodes:', activeState.nodes());
}, 250);
activeState.bind('activeNodes', activeNodesCallback);
````

## Settings

We extend Sigma.js settings in a transparent way to render active nodes and edges, see [settings.js](settings.js):

 * **activeFont**
   * The active node's label font. If not specified, will heritate the `font` value.
   * type: *string*
   * default value: ``

 * **activeFontStyle**
   * Example: `bold`
   * type: *string*
   * default value: ``

 * **nodeActiveColor**
   * Indicates how to choose the active nodes color.
   * type: *string*
   * default value: `node`
   * available values: `node`, `default`

 * **defaultNodeActiveColor**
   * type: *string*
   * default value: `rgb(236, 81, 72)`

 * **edgeActiveColor**
   * Indicates how to choose the active nodes color.
   * type: *string*
   * default value: `edge`
   * available values: `edge`, `default`

 * **defaultEdgeActiveColor**
   * type: *string*
   * default value: `rgb(236, 81, 72)`

 * **nodeBorderColor**
   * Indicates how to choose the nodes border color.
   * type: *string*
   * default value: `node`
   * available values: `node`, `default`

 * **nodeOuterBorderColor**
   * Indicates how to choose the nodes outer border color.
   * type: *string*
   * default value: `node`
   * available values: `node`, `default`

 * **outerBorderSize**
   * The size of the outer border of hovered and active nodes.
   * type: *number*
   * default value: `0`

 * **defaultNodeOuterBorderColor**
   * The default hovered and active node outer border's color.
   * type: *string*
   * default value: `#000`

The default values provided by the plugin may be overriden when instantiating Sigma, e.g.:

````javascript
var sigInst = new sigma({
  graph: g,
  container: 'graph-container',
  settings: {
    activeFontStyle: 'bold'
  }
});
````

## Renderers

This plugin overrides default renderers to change their colors on active state. Nodes and edges may have the following attributes:
- `active`: *boolean*
- `active_color`: *string*

Notice in the settings that we improve the support of node borders (i.e. stroke). Borders are used in both hover and active node renderers.

Finally, the node renderers take the borders sizes into account in the distance between node circles and labels.

#### Limitations

WebGL renderers ignore borders like in vanilla renderers.
