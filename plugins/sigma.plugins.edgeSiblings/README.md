sigma.plugins.edgeSiblings
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious).

---
## General
Parallel edges are multiple edges between the same source and the same target nodes. I'm not aware of any optimal solution for node-link diagrams to display more than 2 parallel edges. This is why this plugin prevents parallel edges in Sigma.js by introducing the concept of **edge sibling**.

See the following [example code](../../examples/edge-siblings.html) and [unit tests](../../test/unit.plugins.edgeSiblings.js) for full usage.

To use, include all .js files under this folder.

## Implementation of edge siblings

Edge siblings are similar to parallel edges, except that they are not registered in the graph structure of sigma.js. Instead, existing edges store them in a specific property called `siblings`. Edge siblings are therefore not used by Sigma.js but are still accessible from plugins and third-party code.

The type of edges which contain siblings is `parallel`. They are true containers: they contain a copy of themselves as siblings because they have a size of 1, they do not have color or label anymore, and one should not rely on the other attributes.

## Graph methods

Read a graph by preventing parallel edges:

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

Use `graph.addEdgeSibling` to add any edge:

```javascript
var myGraph = new sigma.classes.graph();

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

Use `graph.dropEdgeSibling` to drop any edge:

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

## Graph indexes

This plugin adds a new index called `siblingEdgesIndex` to reference all edge siblings by their id.

## Compatibility

This plugin is compatible with [sigma.renderers.customEdgeShapes](../../plugins/sigma.renderers.customEdgeShapes). Combine them to use the *parallel* edge renderer: two solid parallel lines representing the aggregation of multiple edges.

This plugin is compatible with [events.edges](https://github.com/jacomyal/sigma.js/pull/316) (currently under review). Combine them to clic on parallel edges and display the list of edge siblings in the user interface of your application.
