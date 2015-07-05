sigma.plugins.tooltips
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the license [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---

This plugin provides a method to display a tooltip manually or when a sigma event is fired either on stage, node, or edge. The tooltip is an HTML DOM element. Only one tooltip is displayed on screen. 

#### Example 1: display on node hover event
![Tooltips](https://github.com/Linkurious/linkurious.js/wiki/media/tooltips.png)

#### Example 2: display on right-click event
![Tooltips LK](https://github.com/Linkurious/linkurious.js/wiki/media/tooltips-lk.gif)

Check the `sigma.plugins.tooltips` function doc or the example code [here](../../examples/plugin-tooltips.html) and [there](../../examples/plugin-tooltips-multiples.html) to know more.

To use, include all .js files under this folder. Then initialize it as follows, where the first parameter is the Sigma instance, the second is the renderer on which to display the tooltip, and the third parameter is the options object:

````javascript
var tooltipInstance = sigma.plugins.tooltips(
  sigmaInstance,
  sigmaInstance.renderers[0],
  {
    node: {
      template: 'Hello node!'
    },
    edge: {
      template: 'Hello edge!'
    },
    stage: {
      template: 'Hello stage!'
    }
  }
);
````

Kill the tooltips as follows:

````javascript
sigma.plugins.killTooltips(sigmaInstance);
````

Manually open a tooltip on a node:

````javascript
var n = sigmaInstance.graph.nodes('n0');
var prefix = sigmaInstance.renderers[0].camera.prefix;

tooltipInstance.open(
  n, 
  settings.node, 
  n[prefix + 'x'], 
  n[prefix + 'y']
);
````

Manually close a tooltip:

````javascript
tooltipInstance.close();
````

## Configuration

A configuration object must be passed to the plugin at the initialization:

````javascript
var config = {...};
sigma.plugins.tooltips(sigmaInstance, sigmaInstance.renderers[0], config);
````

The plugin provides three configuration keys called `stage`, `node`, `edge`. Bound to the relevant Sigma events, the content and style of the tooltip varies if you trigger it for a node, an edge, or the stage.

For instance, the following configuration enables a tooltip on node click:
````javascript
sigma.plugins.tooltips(sigmaInstance, sigmaInstance.renderers[0], {
  node: {
    show: 'clickNode',
    template: 'Hello node!'
  }
});
````

The `node`, `edge` or `stage` keys are mandatory to enable the related tooltips. The above code will thus trigger the node tooltip only. Each key is associated to a set of options, see the following options below.

### Configuration options

 * **show**
   * The Sigma event that displays the tooltip.
   * type: *string*
   * node default value: `clickNode`
   * edge default value: `clickEdge`
   * stage default value: `rightClickStage`
   * suggested values: `overNode`, `doubleClickNode`, `rightClickNode`,`overEdge`, `doubleClickEdge`, `rightClickEdge`
 * **hide**
   * The Sigma event that hides the tooltip.
   * type: *string*
   * node default value: `clickStage`
   * edge default value: `clickStage`
   * stage default value: `clickStage`
   * suggested values: `outNode`, `outEdge`
 * **cssClass**
   * The CSS class attached to the top div element.
   * type: *string*
   * default value: `sigma-tooltip`
 * **position**
   * Relative position of the tooltip regarding to the mouse position. If it is not specified, the tooltip top-left corner is positionned at the mouse position. If set as `css`, the tooltip position is not set and must be set by external CSS.
   * type: *string*
   * available values: `top` | `bottom` | `left` | `right` | `css`
 * **delay**
   * The delay in miliseconds before displaying the tooltip after the `show` event is triggered.
   * type: *number*
   * default value: `0`
 * **autoadjust**
   * [EXPERIMENTAL] If true, tries to adjust the tooltip position to be fully included in the body area. Doesn't work on Firefox 30. Better work on elements with fixed width and height.
   * type: *boolean*
   * default value: `false`
 * **template**
   * The HTML template. It is directly inserted inside a div element unless a renderer is specified.
   * type: *string*
   * default value: `""`
 * **renderer**
   * This function may process the template or be used independently. It should return an HTML string or a DOM element. It is executed at runtime. Its context is sigma.graph. For instance, you can parse Mustach syntax (see the [example code](../../examples/plugin-tooltips.html)) or use Angular.js $compile.
   * type: *function*
   * default value: `null`


## Events

This plugins provides the following events:
* `shown`: fired when the tooltip is shown
* `hidden`: fired when the tooltip is hidden

## Changelog

### v0.4

  * Handle multiple sigma instances
  * The renderer is passed as argument
  * Make public methods `.open()`, `.close()`, `.kill()`

### v0.3

  * Add function `killTooltips`
  * 'new becomes unnecessary to instanciate the plugin
  * Better compatibility with Angular.js $compile in renderer

### v0.2

  * Add function `close`
  * tooltips is now a singleton to avoid bugs at multiple instanciations

### v0.1

  * First version
