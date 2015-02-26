sigma.plugins.image
=====================

Plugin developed by [Martin de la Taille](https://github.com/martindelataille) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

---

This plugin provides a method to capture graph rendered with canvas or webgl.

See the following [example code](../../examples/plugin-image.html) for full usage.

To use, include all .js files under this folder.

*Basic usage*

```js
// Download the rendered graph as an image
sigma.plugins.image(s, s.renderers[0], {download:true});
```

*Complex usage*

```js
sigma.plugins.image(s, s.renderers[0], {
	download:true,
	size: 400,
	background: 'white',
	zoom: true
});
```

*Parameters*

* **s**: sigma instance.
* **renderer**: related renderer instance.
* **size** [`window.innerWidth`]: size of the image.
* **clip** [`false`]: boolean to retrieve the clipped view at the current zoom, or take entire graph rendered .
* **zoomRatio** [`1`]: number to define the camera zoom ratio if *clip* is false and no size is specified.
* **tmpContainer** [`image-container`]: the ID of the temporary div contained used if `zoom: false`.
* **format** [`png`]: file format of the image. Supported: `png`, `jpg`, `gif`, `tiff`.
* **background** : whether you want to specify a background color for the image. Transparent if none specified.
* **labels** [`true`] : labels on screen to be displayed on the image.
* **margin** [`0`] : external canvas margin helps display labels.
* **download** [`false`] : whether you want the graph image to be downloaded by the browser.
* **filename** [`graph.png`] : full filename for the file to download.
