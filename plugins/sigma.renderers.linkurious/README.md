sigma.renderers.linkurious
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin overrides default renderers to change their colors on active state. Nodes and edges may have the following attributes:
- `active`: *boolean*
- `active_color`: *string*

See the following [example code](../../examples/active-state.html) and [settings](settings.js) for full usage.

To use, include all .js files under this folder. The renderers will be used automatically.

## Settings

 * **defaultLabelActiveColor**
   * type: *string*
   * default value: `#000`

 * **activeFont**
   * The active node's label font. If not specified, will heritate the `font` value.
   * type: *string*
   * default value: ``

 * **activeFontStyle**
   * Example: `bold`
   * type: *string*
   * default value: ``

 * **labelActiveColor**
   * Indicates how to choose the labels color of active nodes.
   * type: *string*
   * default value: `default`
   * available values: `node`, `default`

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

The default values provided by the plugin may be overridden when instantiating Sigma, e.g.:

````javascript
var sigInst = new sigma({
  graph: g,
  container: 'graph-container',
  settings: {
    activeFontStyle: 'bold'
  }
});
````

### Compatibility

The plugin is compatible with [sigma.plugins.activeState](../sigma.plugins.activeState), which provides an API to manage the active state of nodes and edges.

### Limitations

WebGL node renderers ignore borders.
