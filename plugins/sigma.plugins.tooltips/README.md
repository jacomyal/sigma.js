sigma.plugins.tooltips
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the license [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---

This plugin provides a method to display a tooltip when a sigma event is fired either on stage, node, or edge. The tooltip is an HTML DOM element. Only one tooltip is displayed on screen. Check the `sigma.plugins.tooltips` function doc or the [example code](../../examples/plugin-tooltips.html) to know more.

To use, include all .js files under this folder. Then initialize it as follows, where the first parameter is the Sigma instance, and the second parameter is the options object:

````javascript
sigma.plugins.tooltips(s, {
  node: {
    template: 'Hello node!'
  },
  edge: {
    template: 'Hello edge!'
  },
  stage: {
    template: 'Hello stage!'
  }
});
````

Kills the tooltips as follows:

````javascript
sigma.plugins.killTooltips();
````

## Configuration

A configuration object must be passed to the plugin at the initialization:

````javascript
var config = {...};
sigma.plugins.tooltips(s, config);
````

The plugin provides three configuration keys called `stage`, `node`, `edge`. Bound to the relevant Sigma events, the content and style of the tooltip varies if you trigger it for a node, an edge, or the stage.

For instance, the following configuration enables a tooltip on node click:
````javascript
sigma.plugins.tooltips(s, {
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
   * Relative position of the tooltip regarding to the mouse position. If it is not specified, the tooltip top-left corner is positionned at the mouse position.
   * type: *string*
   * default value: `""`
   * available values: `top` | `bottom` | `left` | `right`
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

### v0.3

  * Add function `killTooltips`
  * 'new becomes unnecessary to instanciate the plugin
  * Better compatibility with Angular.js $compile in renderer

### v0.2

  * Add function `close`
  * tooltips is now a singleton to avoid bugs at multiple instanciations

### v0.1

  * First version
