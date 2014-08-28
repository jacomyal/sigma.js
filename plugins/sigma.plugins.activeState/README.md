sigma.plugins.activeState
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides a new state called "active" to nodes and edges. Graphical elements in user interfaces have usually multiple states like hover, focus, and active. They are keys to enable great user interaction. For instance, one might create a plugin that drag all active nodes, which are eventually considered as "selected" elements. However Sigma.js supports only the hover state.

See the following [example code](../../examples/active-state.html) and [unit tests](../../test/unit.plugins.activeState.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var activeState = sigma.plugins.activeState(sigInst.graph);
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killActiveState();
````

### Settings

New settings are now available to tune the rendering of active nodes and edges, see [settings.js](settings.js):

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

## Renderers

This plugin overrides default renderers to change their colors on active state. Nodes and edges may have the following attributes:
- `active`: *boolean*
- `active_color`: *string*
