sigma.exporters.xlsx
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [GNU GPLv3](LICENSE) license.

Contact: seb@linkurio.us

---

The aim of this plugin is to enable users to retrieve an Excel 2007+ workbook file of the graph. The workbook may contain a spreadsheet of nodes, a spreadsheet of edges, or both.

See the following [example code](../../examples/plugin-exporters-xlsx.html) for full usage.

To use, include all .js files under this folder. Then call the exporter method as follows:

````javascript
// Download the XSLX file
s.toXLSX();
````

### Advanced usage

Download the XSLX file with nodes and edges attributes:

````javascript
s.toXLSX({
  nodesAttributes: 'data',
  edgesAttributes: 'data.properties',
  filename: 'myGraph.xlsx'
});
````

Download the XSLX file with 2 specified nodes and their attributes:

````javascript
s.toXLSX({
  what: 'nodes',
  which: ['n0', 'n1'],
  nodesAttributes: 'data',
  filename: 'myNodes.xlsx'
});
````

#### Options

 * **what** (optional)
   * Both nodes and edges sheets are filled, unless the option is set to fill one of them only.
   * type: *string*
   * available values: `nodes` | `edges`
 * **which** (optional)
   * The ids of nodes or edges.
   * type: *array*
 * **nodesAttributes** (optional)
   * The accessor to the dictionnary of nodes attributes (e.g. "attributes" or "data.properties"). If provided, write the attributes in the spreadsheet.
   * type: *string*
 * **edgesAttributes** (optional)
   * The accessor to the dictionnary of edges attributes (e.g. "attributes" or "data.properties"). If provided, write the attributes in the spreadsheet.
   * type: *string*
 * **filename** (optional)
   * The full filename for the file to download.
   * type: *string*

### Requirements

The HTML5 [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) API is required to download the file. You may use [Blob.js](https://github.com/eligrey/Blob.js/) for browsers that do not natively support it.

### Dependencies

This plugin requires the [xlsx](https://www.npmjs.com/package/xlsx) v0.7.12+ package.
