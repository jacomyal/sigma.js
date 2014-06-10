sigma.plugins.dragNodes
=====================

Plugin developed by [José M. Camacho](https://github.com/josemazo).
Touch Dragging / Notes contributions by [York Prado](https://github.com/yoprado).
---

This plugin provides a method to drag & drop nodes. At the moment, this plugin is not compatible with the WebGL renderer. Check the sigma.plugins.dragNodes function doc or the examples/drag-nodes.html code sample to know more.




## Method

**sigma.plugins.dragNodes**

This method is currently the only method to use. Use this method to enable dragging of nodes for a particular sigmainstance

```js
sigma.plugins.dragNodes(sigmaInstance, sigmaRenderer, options);
```

sigmaInstance - The instance of sigma you are enabling this plugin for

sigmaRenderer - The renderer instance of sigma you are enabling this plugin for

options - (optional) The options for modifying certain parameters withing the plugin

## Configuration

* **enableTouchDrag**: *boolean* `true` - enable node dragging for touch events
* **enableMouseDrag** *boolean* `true` - enable node dragging for mouse events
* **hideEdgeDragging** *boolean* `false` - hide edges of the network graph while dragging a node. This can lead to a huge performance increase.


## Notes

1. As an update to this plug-in, an additional parameter for dragNodes was added. (6/10/14). The options parameter is optional, maintaining backwards compatability.
2. Currently on Windows 7 and 8 machines, chrome captures touch events as intended. On Mozilla Firefox, events that are captured are mouse events even when using a touch screen.