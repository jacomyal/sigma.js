sigma.plugins.halo
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: seb@linkurio.us

---

This plugin provides a method to render a halo behind nodes and edges.

See the following [example code](../../examples/plugin-halo.html) for full usage.

To use, include all .js files under this folder. Then call the renderer method as follows:

````javascript
// Render the halo behind all nodes:
myRenderer.halo({ nodes: s.graph.nodes() });
````

````javascript
// Render the halo behind all edges:
myRenderer.halo({ edges: s.graph.edges() });
````

## Automatic rendering

Regenerate the halo at each rendering as follows:

````javascript
myRenderer.bind('render', function(e) {
  myRenderer.halo({
    nodes: s.graph.nodes()
  });
});
````

## Configuration

This plugin adds new settings to sigma. Initialize sigma as follows:

````javascript
s = new sigma({
  graph: g,
  container: 'graph-container',
  settings: {
    nodeHaloColor: '#ecf0f1',
    edgeHaloColor: '#ecf0f1',
    nodeHaloSize: 50,
    edgeHaloSize: 10
  }
});
````

Override these settings anytime `halo` is called:

````javascript
// Render a grey halo of size 100 behind all nodes:
myRenderer.halo({
  nodeHaloColor: '#333',
  nodeHaloSize: 100,
  nodes: s.graph.nodes()
});
````


#### Options

 * **nodeHaloColor**
   * The node halo color.
   * type: *string*
   * default value: `#fff`
 * **nodeHaloSize**
   * The node halo size.
   * type: *number*
   * default value: `50`
 * **edgeHaloColor**
   * The edge halo color.
   * type: *string*
   * default value: `#fff`
 * **edgeHaloSize**
   * The edge halo size.
   * type: *number*
   * default value: `10`

## Advanced usage

Render the halo behind a subset of nodes as follows:

````javascript
myRenderer.halo({
  nodes: s.graph.nodes().filter(function(node) { return node.size > 0.5; })
});
````

Render the halo behind hovered nodes and their adjacent nodes as follows:

````javascript
s.bind('overNodes', function(e) {
  var adjacentNodes = [];

  // Get adjacent nodes:
  e.data.nodes.forEach(function(node) {
    s.graph.adjacentNodes(node.id).forEach(function(n) {
      adjacentNodes.push(n);
    })
  });

  // Add hovered nodes to the array and remove duplicates:
  adjacentNodes = arrayUnique(adjacentNodes.concat(e.data.nodes));

  // Render halo:
  myRenderer.halo({
    nodes: adjacentNodes
  });
});
````
