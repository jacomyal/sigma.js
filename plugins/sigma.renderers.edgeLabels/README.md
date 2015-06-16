sigma.renderers.edgeLabels
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious).

Contact: seb@linkurio.us

---
## General
This plugin displays edge labels on **Canvas** only.

See the following [example](../../examples/edge-renderers.html) for full usage.

To use it, include all .js files under this folder.

## Settings

This plugin extends Sigma.js settings to render edge labels, see [settings.js](settings.js):

 * **defaultEdgeLabelColor**
   * type: *string*
   * default value: `#000`

 * **defaultEdgeLabelActiveColor**
   * type: *string*
   * default value: `rgb(236, 81, 72)`

 * **defaultEdgeLabelSize**
   * type: *number*
   * default value: `10`

 * **edgeLabelSize**
   * Indicates how to choose the edge labels size.
   * type: *string*
   * default value: `fixed`
   * available values: `fixed`, `proportional`

 * **edgeLabelAlignment**
   * Indicates how to position the label relative to its edge.
   * type: *string*
   * default value: `auto`
   * available values: `auto`, `horizontal`

 * **edgeLabelSizePowRatio**
   * The opposite power ratio between the font size of the label and the edge size.
   * type: *number*
   * default value: `0.8`

````javascript
// Formula:
Math.pow(size, - 1 / edgeLabelSizePowRatio) * size * defaultEdgeLabelSize
````

 * **edgeLabelThreshold**
   * The minimum size an edge must have to see its label displayed.
   * type: *number*
   * default value: `1`

 * **defaultEdgeHoverLabelBGColor**
   * type: *string*
   * default value: `#fff`

 * **edgeLabelHoverBGColor**
   * Indicates how to choose the hovered edge labels color.
   * type: *string*
   * default value: `default`
   * available values: `edge`, `default`

 * **edgeLabelHoverShadow**
   * Indicates how to choose the hovered edges shadow color.
   * type: *string*
   * default value: `default`
   * available values: `edge`, `default`

 * **edgeLabelHoverShadowColor**
   * type: *string*
   * default value: `#000`

When included, the plugin forces `drawEdgeLabels` to `true`.

The default values provided by the plugin may be overridden when instantiating Sigma, e.g.:

````javascript
var sigInst = new sigma({
  container: 'graph-container',
  settings: {
    edgeLabelSize: 'proportional'
  }
});
````

## Renderers

This plugin provides the following edge label renderers:
- `line` (default)
- `arrow` (use default)
- `curve`
- `curvedArrow`

## Compatibility

This plugin is compatible with `sigma.renderers.linkurious` (required for hovering effects) and with  `sigma.renderers.customEdgeShapes`.
This plugin is compatible with `sigma.plugins.activeState`.
