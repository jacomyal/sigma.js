sigma.plugins.select
==================

Plugin developed by [Sébastien Heymann](sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin enables the activation of nodes and edges by clicking on them. Multiple nodes or edges may be activated by holding the Ctrl or Meta key while clicking on them. Both nodes and edges cannot be selected at the same time.

See the following [example code](../../examples/plugin-select.html) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var activeState = sigma.plugins.activeState(sigInst.graph);
sigma.plugins.select(sigInst, activeState);
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killSelect();
````

## Status

Beta

## Dependencies

- `sigma.plugins.activeState`

## Compatibility

The plugin is compatible with `sigma.plugins.dragNodes`: dragged nodes won't be selected.
