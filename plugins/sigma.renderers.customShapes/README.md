sigma.renderers.customShapes
==================

Plugin developed by [Ron Peleg](https://github.com/rpeleg1970).

---
This plugin registers custom node shape renderers, and allows adding scaled images on top of them.
To use, include all .js files under this folder.
Also, to make sure the plug-in calls the sigma instance `refresh()` method corretcly on image loading, you should init as follows:
````javascript
  s = new sigma({
   ...
  });
  CustomShapes.init(s);
  s.refresh();
````

The plugin implements the following shapes
  * `circle`
