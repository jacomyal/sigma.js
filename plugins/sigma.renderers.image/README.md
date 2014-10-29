sigma.plugins.fullScreen
=====================

Plugin developed by [Martin de la Taille](https://github.com/martindelataille) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

---

This plugin provides a method to capture graph rendered with canvas or webgl.

See the following [example code](../../examples/plugin-image.html) for full usage.

To use, include all .js files under this folder.

*Basic usage*

```js
// Instantiate image instance
myRenderer.image();

// Download the rendered graph as an image
myRenderer.generateImage();
```

*Complex usage*

```js
myRenderer.snapshot({
  size: 400,
  format: 'jpg',
  background: 'white',
  labels: false
});
```

*Parameters*

* **size** [`600`]: size of the image.
* **zoom** [`true`]: boolean to retrieve zoom or take entire graph rendered .
* **format** [`png`]: file format of the image. Supported: `png`, `jpg`, `gif`, `tiff`.
* **background** : whether you want to specify a background color for the snapshot. Transparent if none specified.
* **labels** [`true`] : do we want the labels on screen to be displayed on the snapshot?
* **download** [`false`] : whether you want the graph image to be downloaded by the browser.
* **filename** [`graph.png`] : full filename for the file to download.
