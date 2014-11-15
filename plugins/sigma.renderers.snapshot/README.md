sigma.renderers.snapshot
========================

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

---

This plugin makes the retrieval of an image version of the graph rendered with canvas or webgl as easy as a stroll in a park.

*Basic usage*

```js
// Retrieving a dataUrl of the rendered graph
var dataUrl = myRenderer.snapshot();

// Download the rendered graph as an image
myRenderer.snapshot({download: true});
```

*Complex usage*

```js
myRenderer.snapshot({
  format: 'jpg',
  background: 'white',
  labels: false
});
```

*Parameters*

* **format** *?string* [`png`]: file format of the image. Supported: `png`, `jpg`, `gif`, `tiff`.
* **background** *?string*: whether you want to specify a background color for the snapshot. Transparent if none specified.
* **labels** *?boolean* [`true`] : do we want the labels on screen to be displayed on the snapshot?
* **download** *?boolean* [`false`] : whether you want the graph image to be downloaded by the browser.
* **filename** *?string* [`graph.png`] : full filename for the file to download.
