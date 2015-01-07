sigma.plugins.activeState
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides a new state called `active` to nodes and edges. Graphical elements in user interfaces have usually multiple states like `hidden`, `hover`, `focus`, and `active`. They are keys to enable great user interaction. For instance, one might create a plugin that drag all active nodes, which are eventually considered as "selected" elements. Sigma.js provides the `hidden` and `hover` states only.

See the following [unit tests](../../test/unit.plugins.activeState.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var activeState = sigma.plugins.activeState(sigInst);
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
 * This method will set one or several visible nodes as `active`, depending on how it is called. To activate all visible nodes, call it without argument. To activate a specific visible node, call it with the id of the node. To activate multiple visible nodes, call it with an array of ids.
 * The method returns the plugin instance.

**addEdges()** : *sigma.plugins.activeState*
**addEdges( *string* )** : *sigma.plugins.activeState*
**addEdges( *array* )** : *sigma.plugins.activeState*
 * This method will set one or several visible edges as `active`, depending on how it is called. To activate all visible edges, call it without argument. To activate a specific visible edge, call it with the id of the edge. To activate multiple visible edges, call it with an array of ids.
 * The method returns the plugin instance.

**dropNodes()** : *sigma.plugins.activeState*
**dropNodes( *string* )** : *sigma.plugins.activeState*
**dropNodes( *array* )** : *sigma.plugins.activeState*
 * This method will set one or several nodes as `inactive`, depending on how it is called. To deactivate all nodes, call it without argument. To deactivate a specific node, call it with the id of the node. To deactivate multiple nodes, call it with an array of ids.
 * The method returns the plugin instance.

**dropEdges()** : *sigma.plugins.activeState*
**dropEdges( *string* )** : *sigma.plugins.activeState*
**dropEdges( *array* )** : *sigma.plugins.activeState*
 * This method will set one or several edges as `inactive`, depending on how it is called. To deactivate all edges, call it without argument. To deactivate a specific edge, call it with the id of the edge. To deactivate multiple edges, call it with an array of ids.
 * The method returns the plugin instance.

**addNeighbors()** : *sigma.plugins.activeState*
 * The method will set the neighbors of all active visible nodes as `active`.
 * The method returns the plugin instance.

**setNodesBy( *function* )** : *sigma.plugins.activeState*
 * The method will set the visible nodes that pass a specified truth test (i.e. predicate) as `active`, or as `inactive` otherwise. The method must be called with the predicate, which is a function that takes a node as argument and returns a boolean. The context of the predicate is ``sigma.graph``.
 * The method returns the plugin instance.

Example:

````javascript
// graph = {
//   nodes: [{id:'n0'}, {id:'n1'}, {id:'n2'}], 
//   edges: [
//     {id:'e0', source:'n0', target:'n1'}]
// }
// Activate isolated nodes:
activeState.setNodesBy(function(n) {
  return this.degree(n.id) === 0;
});
// n0.active == false
// n1.active == false
// n2.active == true
````

**setEdgesBy( *function* )** : *sigma.plugins.activeState*
 * The method will set the visible edges that pass a specified truth test (i.e. predicate) as `active`, or as `inactive` otherwise. The method must be called with the predicate, which is a function that takes a node as argument and returns a boolean. The context of the predicate is ``sigma.graph``.
 * The method returns the plugin instance.

**invertNodes()** : *sigma.plugins.activeState*
 * The method will set the active nodes as `inactive` and the other visible nodes as `active`.
 * The method returns the plugin instance.

**invertEdges()** : *sigma.plugins.activeState*
 * The method will set the active edges as `inactive` and the other visible edges as `active`.
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

## Compatibility

The plugin is compatible with [sigma.renderers.linkurious](../sigma.renderers.linkurious) which provides renderers to display the active state of nodes and edges.
