sigma.exporters.spreadsheet
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [GNU GPLv3](LICENSE) license.

Contact: seb@linkurio.us

---

The aim of this plugin is to enable users to retrieve a spreadsheet of the graph.

See the following [example code](../../examples/plugin-exporters-spreadsheet.html) for full usage.

To use, include all .js files under this folder. Then call the exporter method as follows:

````javascript
// Retreive the spreadsheet strings
var stringNodes = s.toSpreadsheet({what: 'nodes'});
var stringEdges = s.toSpreadsheet({what: 'edges'});

// Download the spreadsheet files
s.toSpreadsheet({what: 'nodes', download: true});
s.toSpreadsheet({what: 'edges', download: true});
````

### Advanced usage

````javascript
s.toSpreadsheet({
  what: 'nodes',
  which: ['n0', 'n1'],
  attributes: 'data',
  download: true,
  filename: 'myNodes.csv',
  separator: ',',
  textSeparator: '"'
});
````

#### Options

 * **what**
   * What you get, either nodes or edges.
   * type: *string*
   * available values: `nodes` | `edges`
 * **which** (optional)
   * The ids of nodes or edges.
   * type: *array*
 * **attributes** (optional)
   * The accessor to the dictionnary of nodes or edges attributes (e.g. "attributes" or "data.properties"). If provided, write the attributes in the spreadsheet.
   * type: *string*
 * **download** (optional)
   * Whether you want the graph image to be downloaded by the browser.
   * type: *boolean*
   * default value: `false`
 * **filename** (optional)
   * The full filename for the file to download.
   * type: *string*
 * **separator** (optional)
   * The column separator character.
   * type: *string*
   * default value: `,`
 * **textSeparator** (optional)
   * The text separator character.
   * type: *string*
   * available values: `"` | `'` (simple or double quote)
