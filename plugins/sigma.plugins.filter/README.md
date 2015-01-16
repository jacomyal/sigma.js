sigma.plugins.filter
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin filters nodes and edges in a fancy manner:
- Define your own filters on nodes and edges using the `nodesBy` and `edgesBy` methods, or execute more complex filters using the `neighborsOf` method.
- Register multiple filters before applying them anytime at once.
- Undo any filter while preserving the execution order. 
- Chain all methods for concise style.

![Filters](https://github.com/Linkurious/linkurious.js/wiki/media/filters.gif)

See the following [example code](../../examples/filters.html) and [unit tests](../../test/unit.plugins.filter.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var filter = sigma.plugins.filter(sigInst);
````

The plugin will be killed when the Sigma `kill` event is sent. You can manually kill the plugin instance as follows:

````javascript
sigma.plugins.killFilter(sigInst);
````

## Predicates
Predicates are truth tests (i.e. functions which return a boolean) on a single node or a single edge. They return true if the element should be visible. For instance:

````javascript
// Only edges of size above one should be visible:
function(e) {
  return e.size > 1;
}
````

In this example, notice that if the size attribute is undefined, the edge will be hidden. If you still want to display edges with no size attribute defined, you have to modify the predicate a bit:

````javascript
// Only edges of size above one should be visible:
function(e) {
  return e.size === undefined || e.size > 1;
}
````

The scope of predicates contains the `graph` object. All Sigma `graph` methods are thus available, such as `.degree(nodeid)` by calling `this.graph.degree(nodeid)` inside the predicate. For instance:

````javascript
// Only nodes of positive degree should be visible:
function(n) {
  return this.graph.degree(n.id) > 0;
}
````

The scope of predicates also contains a `get` function to dynamically access nodes and edges attributes if their location is defined in dot notation, see the Predicates with parameters below.

Predicates are applied by predicate processors.

## Predicate processors
Predicate processors are functions which wrap one predicate and apply it to the graph. Three predicate processors are available:
- `nodesBy`
- `edgesBy`
- `neighborsOf`

For each node of the graph, the `nodesBy` processor sets the attribute `hidden` to false if the predicate is true for the node. It also sets the `hidden` attribute of edges to true if one of the edge's extremities is hidden. For instance:

````javascript
// Only connected nodes (i.e. nodes of positive degree) should be visible:
filter.nodesBy(function(n) {
  return this.graph.degree(n.id) > 0;
}, 'non-isolates');
````

For each edge of the graph, the `edgesBy` processor sets the attribute `hidden` to false if the predicate is true for the edge. For instance:

````javascript
// Only edges of size above one should be visible:
filter.edgesBy(function(e) {
  return e.size > 1;
}, 'edge-size-greater-than-one');
````

For each neighbor node of a specified node, the `neighborsOf` processor sets the attribute `hidden` to true if it is not directly connected to the node. It also sets the `hidden` attribute of edges to true if one of the edge's extremities is hidden. For instance:

````javascript
// Only neighbors of the node 'n0' should be visible:
filter.neighborsOf('n0');
````

Processors instanciated with a predicate are called filters. **Filters are not applied until the `apply` method is called.**

## Predicates with parameters

You can pass an object of parameters to the `nodes` and `edges` predicates as follows:

````javascript
// Only edges with size greater than the specified size should be visible:
filter.edgesBy(
  function(e, params) {
    return e.size > params.threshold;
  },
  { threshold: 3 },
  'edge-size-greater-than'
);
````

You may access nodes and edges properties dynamically using the special `get` method available in the scope of the predicate. For instance:

````javascript
filter.nodesBy(
  function(n, params) {
    return this.get(n, params.property) > params.threshold;
  },
  {
    property: 'path.to.my.property',
    threshold: 3
  }
);
````

## Filters chain
Combining filters is easy! Declare one filter after another, then call the `apply` method to execute them on the graph in that order. For instance:

````javascript
// graph = {
//   nodes: [{id:'n0'}, {id:'n1'}, {id:'n2'}, {id:'n3'}], 
//   edges: [
//     {id:'e0', source:'n0', target:'n1', size:1},
//     {id:'e1', source:'n1', target:'n2', size:0.5},
//     {id:'e2', source:'n1', target:'n2'}]
// }
filter
    .nodesBy(function(n) {
      return this.graph.degree(n.id) > 0;
    })
    .edgesBy(function(e) {
      return e.size >= 1;
    })
    .apply();
// n3.hidden == true
// e1.hidden == true
// e2.hidden == true
````

Combined filters work like if there was an 'AND' operator between them. Be careful not to create mutually exclusive filters, for instance:

````javascript
filter
    .nodesBy(function(n) {
      return n.attributes.animal === 'pony';
    })
    .nodesBy(function(n) {
      return n.attributes.animal !== 'pony';
    })
    .apply();
// all nodes are hidden
````

Filters are internally stored in an array called the `chain`.

## Undo filters
Undoing filters means to remove them from the `chain`. Filters can be undone easily. Choose which filter(s) to undo, or undo all of them at once.

Filters can be associated with keys at declaration, where keys are any string you give. For instance, the following filter has the key *node-animal*:

````javascript
filter.nodesBy(function(n) {
  return n.attributes.animal === 'pony';
}, 'node-animal');
````

Manually undo this filter as follows:

````javascript
filter
  .undo('node-animal')
  .apply(); // we want it applied now
````

Multiple filters can be undone at once, for instance:

````javascript
filter.undo('node-animal', 'edge-size', 'high-node-degree');
// don't forget to call `apply()` anytime!
````

Alternative syntax:

````javascript
var a = ['node-animal', 'edge-size', 'high-node-degree'];
filter.undo(a);
// don't forget to call `apply()` anytime!
````

Finally, undo all filters (with or without keys) as follows:

````javascript
filter.undo();
// don't forget to call `apply()` anytime!
````

Warning: you can't declare two filters with the same key, or it will throw an exception. Use `.has(key)` to know if the key is already used.

## Export the chain of filters
The exported chain is an array of objects. Each object represents a filter by a triplet *(?key, predicate, processor, ?options)*. The processor value is the internal name of the processor: `nodes`, `edges`, `neighbors`, and `undo`. The predicate value is a copy of the predicate function. Dump the `chain` using the `serialize` method as follows:

````javascript
var chain = filter.serialize();
// chain == [
//  {
//     key: '...', 
//     predicate: function() {...},
//     processor: '...', 
//     options: {...}
//   }, ...
// ]
````

## Import a chain
You can load a filters chain using the `load` method:

````javascript
var chain = [
  {
    key: 'my-filter',
    predicate: function(n, opt) { return this.graph.degree(n.id) > opt.val; },
    processor: 'nodes',
    options: { val: 0 }
  }
];
filter
  .load(chain)
  .apply();
````
