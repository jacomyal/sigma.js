sigma.renderers.snapshot
========================

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

---

This plugin makes downloading an image version of the graph rendered with canvas or webgl as easy as a stroll in a park.

*Basic usage*

```js
myRenderer.snapshot();
```

*Parameters*

* **format** [`png`]: file format of the image. Supported: `png`, `jpg`, `gif`, `tiff`.
* **filename** [`graph.png`] : full filename for the file to download.
* **background** : whether you want to specify a background color for the snapshot. Transparent if none specified.
* **labels** : do we want the labels on screen to be displayed on the snapshot?
