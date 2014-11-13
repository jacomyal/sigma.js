sigma.exporters.svg
========================

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

---

This plugin aims at providing an easy way to export a graph as a SVG file.

*Basic usage*

```js
// Retrieving the svg file as a string
var svgString = sigInst.toSVG();

// Dowload the svg file
sigInst.toSVG({download: true, filename: 'my-fancy-graph.svg'});
```

*Complex usage*

```js
sigInst.toSVG({
  labels: true,
  classes: false,
  data: true,
  download: true,
  filename: 'hello.svg'
});
```

*Parameters*

* **size** *?integer* [`1000`]: size of the svg canvas in pixels.
* **height** *?integer* [`1000`]: height of the svg canvas in pixels (useful only if you want a height different from the width).
* **width** *?integer* [`1000`]: width of the svg canvas in pixels (useful only if you want a width different from the height).
* **classes** *?boolean* [`true`]: should the exporter try to optimize the svg document by creating classes?
* **labels** *?boolean* [`false`]: should the labels be included in the svg file?
* **data** *?boolean* [`false`]: should additional data (node ids for instance) be included in the svg file?
* **download** *?boolean* [`false`]: should the exporter make the browser download the svg file?
* **filename** *?string* [`'graph.svg'`]: filename of the file to download.
