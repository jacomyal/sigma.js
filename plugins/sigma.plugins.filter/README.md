sigma.plugins.filter
==================

Plugin developed by [Sébastien Heymann](sheymann) for [Linkurious](https://github.com/Linkurious).

---
## General
This plugin filters nodes and edges in a fancy manner:
- Define your own filters on nodes and edges using the `nodesBy` and `edgesBy` methods, or execute more complex filters using the `neighborsOf` method.
- Register multiple filters before applying them anytime at once.
- Undo any filter while preserving the execution order. 
- Chain all methods for concise style.

See the following [example code](../../examples/filters.html) and [unit tests](../../test/unit.plugins.filter.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var filter = new sigma.plugins.filter(sigInst);
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
  return this.degree(n.id) > 0;
}, 'non-isolates');
````

For each edge of the graph, the `edgesBy` processor sets the attribute `hidden` to false if the predicate is true for the edge. For instance:

````javascript
// Only edges of size above one should be visible:
filter.edgesBy(function(e) {
  return e.size > 1;
}, 'edge-size-above-one');
````

For each neighbor node of a specified node, the `neighborsOf` processor sets the attribute `hidden` to true if it is not directly connected to the node. It also sets the `hidden` attribute of edges to true if one of the edge's extremities is hidden. For instance:

````javascript
// Only neighbors of the node 'n0' should be visible:
filter.neighborsOf('n0');
````

Processors instanciated with a predicate are called filters. **Filters are not applied until the `apply` method is called.**

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
      return this.degree(n.id) > 0;
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

Warning: you can't declare two filters with the same key, or it will throw an exception.

## Export the chain
The exported chain is an array of objects. Each object represents a filter by a triplet *(?key, processor, predicate)*. The processor value is the internal name of the processor: `filter.processors.nodes`, `filter.processors.edges`, `filter.processors.neighbors`. The predicate value is a copy of the predicate function. Dump the `chain` using the `export` method as follows:

````javascript
var chain = filter.export();
// chain == [
//  {
//     key: '...', 
//     processor: '...', 
//     predicate: function() {...}
//   }, ...
// ]
````

## Import a chain
You can load a filters chain using the `import` method:

````javascript
var chain = [
  {
    key: 'my-filter',
    predicate: function(n) { return this.degree(n.id) > 0; },
    processor: 'filter.processors.nodes'
  }
];
filter
  .import(chain)
  .apply();
````
