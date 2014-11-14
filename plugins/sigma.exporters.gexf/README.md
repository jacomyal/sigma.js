sigma.exporters.gexf
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: seb@linkurio.us

---

The aim of this plugin is to enable users to retrieve a [GEXF file](http://gexf.net/) of the graph. GEXF is an XML dialect to encode graph data.

See the following [example code](../../examples/plugin-exporters-gexf.html) for full usage.

To use, include all .js files under this folder. Then call the exporter method as follows:

````javascript
// Retreive the GEXF string
var gexfString = s.toGEXF();

// Download the GEXF file
s.toGEXF({download: true});
````

### Advanced usage

````javascript
s.toGEXF({
  download: true,
  filename: 'myGraph.gexf',
  nodeAttributes: 'data',
  edgeAttributes: 'data.properties',
  renderer: s.renderers[0],
  creator: 'Sigma.js',
  description: 'This is an awesome graph!'
});
````

#### Options

 * **download**
   * Whether you want the graph image to be downloaded by the browser.
   * type: *boolean*
   * default value: `false`
 * **filename**
   * The full filename for the file to download.
   * type: *string*
 * **nodeAttributes**
   * The accessor to the dictionnary of node attributes dictionnary (e.g. "attributes" or "data.properties"). If provided, write the attributes in the GEXF.
   * type: *string*
 * **edgeAttributes**
   * The accessor to the dictionnary of edge attributes (e.g. "attributes" or "data.properties"). If provided, write the attributes in the GEXF.
   * type: *string*
 * **renderer**
   * The Sigma renderer. If provided, write the visualization attributes (position, size, color) of nodes and edges in the GEXF.
   * type: *sigma.renderers*
 * **creator**
   * If provided, write the file creator in the META element of the GEXF.
   * type: *string*
 * **description**
   * If provided, write the file description in the META element of the GEXF.
   * type: *string*

### Limitations

* Array attributes are of type `string` instead of `list-string` for compatibility with Gephi.
* Dictionnary attributes are of type `string`.
* `viz:position` X and Y values are read from the renderer and thus do not rely on `node.x` and `node.y`.
* The Y axis is reversed for compatiblity with Gephi.
* Z axis is ignored.
* Colors should be of type hexadecimal, RGB or RGBA.
* `viz:shape` is ignored.
