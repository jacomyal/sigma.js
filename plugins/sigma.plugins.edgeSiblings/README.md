sigma.plugins.edgeSiblings
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the license [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
Parallel edges are multiple edges between the same source and the same target nodes. I'm not aware of any optimal solution for node-link diagrams to display more than 2 parallel edges. This is why this plugin prevents parallel edges in Sigma.js by introducing the concept of **edge sibling**.

See the following [example code](../../examples/edge-siblings.html) and [unit tests](../../test/unit.plugins.edgeSiblings.js) for full usage.

To use, include all .js files under this folder.

## Implementation of edge siblings

Edge siblings are similar to parallel edges, except that they are not registered in the graph structure of sigma.js. Instead, existing edges store them in a specific property called `siblings`. Edge siblings are therefore not used by Sigma.js but are still accessible from plugins and third-party code.

The type of edges which contain siblings is `parallel`. They are true containers: they contain a copy of themselves as siblings because they have a size of 1, they do not have color or label anymore, and one should not rely on the other attributes. Containers take the `id` of the first edge between the extremities that is added in the graph.

## Graph methods

The following graph methods should be used instead of regular graph methods to enforce the use of siblings. They have the same signature of the methods they should replace. You may mix regular methods with the plugin methods if you know what you do.

* Use `graph.readWithSiblings` instead of `graph.read`.
* Use `graph.edgeSiblings` instead of `graph.edges`.
* Use `graph.addEdgeSibling` instead of `graph.addEdge`.
* Use `graph.dropEdgeSibling` instead of `graph.dropEdge`.

**edgeSiblings()** : *array*
**edgeSiblings( *string* )** : *object*
**edgeSiblings( *array* )** : *array*
 * This methods is used to retrieve edges from the graph. If no argument is given, then an array containing references to every edge will be returned. The method can also be called with the ID of an edge to only retrieve the related edge, or an array of IDs to obtain an array of the specified edges. If some edges are siblings, their containers are returned instead.

```javascript
var myGraph = new sigma.classes.graph();
var e0 = myGraph.edgeSiblings('e0');
```

**addEdgeSibling( *object* )** : *graph*
 * This method adds an edge to the graph. The edge must be an object, with a string under the key `id`, and strings under the keys `source` and `target` that are existing node IDs. Except for this, it is possible to add any other attribute that will be preserved along all manipulations. If the graph option `clone` has the value 'true', the edge will be cloned when added to the graph. Also, if the graph option `immutable` has the value 'true', its `id`, `source` and `target` will be defined as immutable.
 * If an edge already exists between the source and target nodes, it will add the edge as a sibling of the existing edge. It will copy the existing edge as a sibling, set its type as "parallel", remove its label and color, and reset its size. If parallel edges already exist, it will add the edge as a sibling to one of these edges (in this case the operation is not deterministic). It may happen when graph.addEdge or graph.read is used.
 * The method returns the graph instance.

```javascript
myGraph.addNode({id:'n0'});
myGraph.addNode({id:'n1'});

myGraph.addEdgeSibling({
  id: 'e0',
  source: 'n0',
  target: 'n1',
  attrX: 'x'
});
myGraph.addEdgeSibling({
  id: 'e1',
  source: 'n0',
  target: 'n1',
  attrY: 'y'
});

console.log(
  myGraph.edges().length,
  myGraph.edges()[0].siblings
); // outputs:
// 1, { 'e0':{object}, 'e1':{object} }
```

**dropEdgeSibling( *string* )** : *graph*
 * This method takes an existing edge `id` as argument and drops the related edge from the graph. An error is thrown if the edge does not exist. If the edge is a sibling, it will drop the sibling. If a single sibling remains after the removal, it will transform the edge used as a container into a regular edge. If parallel edges exist, i.e. multiple edges may contain the sibling, it will drop the first sibling found in a parallel edge.
 * The method returns the graph instance.

```javascript
myGraph.dropEdgeSibling('e0');

console.log(
  myGraph.edges()
); // outputs:
//  [{
//    'e1': {
//      id: 'e1',
//      source: 'n0',
//      target: 'n1',
//      attrY: 'y'
//    }
//  }]
```

**readWithSiblings( *object* )** : *graph*
 * This method reads an object and adds the nodes and edges, through the proper methods `addNode` and `addEdgeSibling`. It then returns the graph.
 * Here is an example:

```javascript
var myGraph = new sigma.classes.graph();
myGraph.readWithSiblings({
  nodes: [
    { id: 'n0' },
    { id: 'n1' }
  ],
  edges: [
    {
      id: 'e0',
      source: 'n0',
      target: 'n1'
    },
    {
      id: 'e1',
      source: 'n0',
      target: 'n1'
    }
  ]
});

console.log(
  myGraph.nodes().length,
  myGraph.edges().length
); // outputs 2 1

console.log(
  myGraph.edges('e0')
); // outputs:
//  {
//    id: 'e0',
//    ...
//    type: 'parallel',
//    siblings: {
//      {
//        'e0': {
//          id: 'e0',
//          source: 'n0',
//          target: 'n1'
//        },
//        'e1': {
//          id: 'e1',
//          source: 'n0',
//          target: 'n1'
//        }
//      }
//  }
```

## Graph indexes

This plugin adds a new index called `siblingEdgesIndex` to reference all edge siblings by their id.

## Compatibility

This plugin is compatible with [sigma.renderers.customEdgeShapes](../../plugins/sigma.renderers.customEdgeShapes). Combine them to use the *parallel* edge renderer: two solid parallel lines representing the aggregation of multiple edges.

This plugin is compatible with [events.edges](https://github.com/jacomyal/sigma.js/pull/316) (currently under review). Combine them to clic on parallel edges and display the list of edge siblings in the user interface of your application.
