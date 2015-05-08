sigma.plugins.lasso
==================

Plugin developed by [Florent Schildknecht](https://github.com/Flo-Schield-Bobby) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

---
## General
This plugin allows you to select several nodes with a lasso-tool:
- Enable the lasso mode
- Draw the lasso path
- All the nodes with a center inside the path will then be available as an array, dispatched by an event
- Hidden nodes will not be selected
- It currently works with a canvas renderer [not compatible with WebGL renderer]
- Touch events are supported (it works on a mobile browser)

![Lasso](https://github.com/Linkurious/linkurious.js/wiki/media/lasso.gif)

![Lasso LK](https://github.com/Linkurious/linkurious.js/wiki/media/lasso-lk.gif)

See the following [example code](../../examples/lasso.html) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var lasso = new sigma.plugins.lasso(sigmaInstance, renderer, settings);

lasso.activate();

lasso.bind('selectedNodes', function (event) {
  var nodes = event.data;

  // Do whatever you want with those nodes

  // Eventually unactivate the lasso-tool mode
  lasso.deactivate();
});

lasso.isActive; // true
````

## Settings

*Lasso settings*

* **strokeStyle** *string* `black`: The stroke-color of the lasso-tool
* **lineWidth** *integer* `5`: The stroke-width of the lasso-tool
* **fillWhileDrawing** *boolean* `false`: Should the lasso-tool fill itself while drawing with the <fillStyle> color ?
* **fillStyle**: *string* `rgba(200, 200, 200, 0.25)`: The fill-color of the lasso-tool, only works when <fillWhileDrawing> is set up to `true`
* **cursor**: *string* `crosshair`: The mouse cursor.


## Notes
1. The lasso mode has to be both activated and unactivated manually
2. The lasso mode does not work with a WebGL renderer
