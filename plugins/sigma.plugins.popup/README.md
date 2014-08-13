sigma.plugins.popup
=====================

Plugin developed by [Sébastien Heymann](sheymann) for [Linkurious](https://github.com/Linkurious).

---

This plugin provides a method to display a popup when a sigma event is fired either on stage, node, or edge. Check the `sigma.plugins.popup` function doc or the [example code](../../examples/popup.html) to know more.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
sigma.plugins.popup(s, {
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

Kills the popup as follows:

````javascript
sigma.plugins.killPopup();
````

## Events

This plugins provides the following events:
* `shown`: fired when the popup is shown
* `hidden`: fired when the popup is hidden

## Changelog

### v0.3

  * Add function `killPopup`
  * 'new becomes unnecessary to instanciate the plugin
  * Better compatibility with Angular.js $compile in renderer

### v0.2

  * Add function `close`
  * Popup is now a singleton to avoid bugs at multiple instanciations

### v0.1

  * First version
