sigma.plugins.dragNodes
=====================

Plugin developed by [José M. Camacho](https://github.com/josemazo), events by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious).

---

This plugin provides a method to drag & drop nodes. At the moment, this plugin is not compatible with the WebGL renderer. Check the sigma.plugins.dragNodes function doc or the [example code](../../examples/drag-nodes.html) to know more.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var dragListener = new sigma.plugins.dragNodes(sigInst, renderer);
````

Kill the plugin as follows:

````javascript
sigma.plugins.killDragNodes();
````

## Events

This plugin provides the following events fired by the instance of the plugin:
* `startdrag`: fired at the beginning of the drag
* `drag`: fired while the node is dragged
* `drop`: fired at the end of the drag if the node has been dragged
* `dragend`: fired at the end of the drag

Exemple of event binding:

````javascript
dragListener.bind('startdrag', function(event) {
  console.log(event);
});
````
