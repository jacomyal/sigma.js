sigma.plugins.select
==================

Plugin developed by [Sébastien Heymann](sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin enables the activation and deactivation of nodes and edges by clicking on them. The clicked nodes or edges which are already active are deactivated. Multiple nodes or edges may be deactivated by holding the Ctrl or Meta key while clicking on them. Both nodes and edges cannot be active at the same time.

See the following [example code](../../examples/plugin-select.html) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var activeState = sigma.plugins.activeState(sigmaInstance);
var select = sigma.plugins.select(sigmaInstance, activeState);
````

Optionnaly bind keyboard events as follows:

````javascript
var kbd = sigma.plugins.keyboard(sigmaInstance, sigmaInstance.renderers[0]);
select.bindKeyboard(kbd);
````

Optionnaly bind dragNodes events as follows:

````javascript
var dragListener = sigma.plugins.dragNodes(sigmaInstance, sigmaInstance.renderers[0], activeState);
select.bindDragNodes(dragListener);
````

The plugin will be killed when Sigma is killed. Kill the plugin instance manually as follows:

````javascript
sigma.plugins.killSelect(sigmaInstance);
````

## Status

Beta

## Dependencies

- `sigma.plugins.activeState`
- `sigma.plugins.dragNodes` (optional)
- `sigma.plugins.keyboard` (optional)
- `sigma.helpers.graph` (required if `sigma.plugins.keyboard` is used)

## Compatibility

The plugin is compatible with `sigma.plugins.dragNodes`. You must bind its events to the plugin to make selection works properly (see above).

The plugin is compatible with `sigma.plugins.keyboard`: if an instance is bound to the plugin, it provides the following keyboard shortcuts:
- <kbd>spacebar</kbd> + <kbd>a</kbd>: select all nodes
- <kbd>spacebar</kbd> + <kbd>u</kbd>: deselect all nodes or edges
- <kbd>spacebar</kbd> + <kbd>Del</kbd>: drop selected nodes or edges
- <kbd>spacebar</kbd> + <kbd>e</kbd>: select neighbors of selected nodes
- <kbd>spacebar</kbd> + <kbd>i</kbd>: select isolated nodes (i.e. of degree 0)
- <kbd>spacebar</kbd> + <kbd>l</kbd>: select leaf nodes (i.e. nodes with 1 adjacent node)
