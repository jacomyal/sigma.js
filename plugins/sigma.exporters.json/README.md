sigma.exporters.json
========================

Plugin by [Ingun Jon](https://github.com/ingun37).

---

This plugin exports current graph states in json.

`renderer...` and `read_...` keys are filtered out when exporting.

Originally made to be used combined with `dragNodes` plugin for repositioning nodes by dragging. It's demonstrated in the example `json-export`.

*Basic usage*

```js
// Retrieving the json file as a string
var jsonString = sigInst.toJSON();

// Dowload the json file
sigInst.toJSON({download: true, filename: 'my-fancy-graph.json'});
```

*Parameters*

* **download** *?boolean* [`false`]: download json file instead returning the json string.
* **filename** *?string* [`'graph.json'`]: filename of the file to download.
