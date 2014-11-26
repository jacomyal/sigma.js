sigma.plugins.lasso
==================

Plugin developed by [Florent Schildknecht](Flo-Schield-Bobby) for [Linkurious](https://github.com/Linkurious).

---
## General
This plugin allows you to select several nodes with a lasso-tool:
- Enable the lasso mode
- Draw the lasso path
- All the nodes with a center inside the path will then be available as an array, dispatched by an event.
- It currently works with a canvas renderer [not compatible with WebGL renderer]

See the following [example code](../../examples/lasso.html) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var lasso = new sigma.plugins.lasso(sigmaInstance, renderer, settings);

lasso.activate();

lasso.bind('sigma:lasso:selectedNodes', function (event) {
  var nodes = event.data;

  // Do whatever you want with those nodes

  // Eventually unactivate the lasso-tool mode
  lasso.unactivate();
});
````

## Settings

*Lasso settings*

'fillStyle': 'rgb(200, 200, 200)',
'strokeStyle': 'black',
'lineWidth': 5,
'fillWhileDrawing': false,
'displayFeedback': true,
'displayFeedbackColor': 'rgb(42, 187, 155)'

* **fillStyle**: *string* `rgb(200, 200, 200)`: The fill-color of the lasso-tool, only works when <fillWhileDrawing> is set up to `true`
* **strokeStyle** *string* `black`: The stroke-color of the lasso-tool
* **lineWidth** *integer* `5`: The stroke-width of the lasso-tool
* **fillWhileDrawing** *boolean* `false`: Should the lasso-tool fill itself while drawing with the <fillStyle> color ?
* **displayFeedback** *boolean* `true`: Should the selected nodes be displayed in a different color <displayFeedbackColor> after the selection ?
* **displayFeedbackColor** *string* `rgb(42, 187, 155)`: The selected nodes color, only works when <displayFeedback> is set up to `true`

## Notes
1. The lasso mode has to be both activated and unactivated manually
2. The lasso mode does not work with a WebGL renderer
