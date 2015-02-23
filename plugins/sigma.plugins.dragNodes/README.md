sigma.plugins.dragNodes
=====================

Plugin developed by [José M. Camacho](https://github.com/josemazo), events by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious), multiple selection by events by [Martin de la Taille](https://github.com/martindelataille) for [Linkurious](https://github.com/Linkurious).

---

This plugin provides a method to drag & drop nodes. At the moment, this plugin is not compatible with the WebGL renderer.

Combined with a lasso selection like in the following example, it provides an intuitive experience to the users:

![Drag](https://github.com/Linkurious/linkurious.js/wiki/media/drag-multiple-nodes.gif)

Check the sigma.plugins.dragNodes function doc or the [example code](../../examples/drag-nodes.html) to know more.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var activeState = sigma.plugins.activeState(sigmaInstance);
var renderer = sigmaInstance.renderers[0]; // or another renderer

var dragListener = new sigma.plugins.dragNodes(sigmaInstance, renderer, activeState);
````

Kill the plugin as follows:

````javascript
sigma.plugins.killDragNodes(sigmaInstance);
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
