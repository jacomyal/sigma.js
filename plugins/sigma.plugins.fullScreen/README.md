sigma.plugins.fullScreen
=====================

Plugin developed by [Martin de la Taille](https://github.com/martindelataille) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

---

This plugin provides a method to use fullScreen mode with or without a button

## General
This plugin provides a method to use fullScreen mode with or without a button.

See the following [example code](../../examples/fullscreen.html) for full usage.

To use, include all .js files under this folder. Then initialize it as follows with a button:

````javascript
sigma.plugins.fullScreen(s, {
  id : 'graph-btn'
});
````

or without a button :

````javascript
sigma.plugins.fullScreen(s);
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killFullscreen();
````

## Status

Beta
