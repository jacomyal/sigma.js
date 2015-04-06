module('sigma.plugins.filter');

test('Custom graph methods', function() {
  var myGraph = new sigma.classes.graph();
  myGraph.read({
    nodes: [
      {
        id: 'n0',
        label: 'Node 0',
        myNodeAttr: 123
      },
      {
        id: 'n1',
        label: 'Node 1'
      },
      {
        id: 'n2',
        label: 'Node 2'
      },
      {
        id: 'n3',
        label: 'Node 3'
      }
    ],
    edges: [
      {
        id: 'e0',
        source: 'n0',
        target: 'n1',
        myEdgeAttr: 123
      },
      {
        id: 'e1',
        source: 'n1',
        target: 'n2'
      },
      {
        id: 'e2',
        source: 'n1',
        target: 'n3'
      },
      {
        id: 'e3',
        source: 'n2',
        target: 'n3'
      }
    ]
  });

  deepEqual(
    myGraph.adjacentNodes('n0'),
    [ myGraph.nodes('n1') ],
    '"adjacentNodes" returns the adjacent nodes of a specified node'
  );

  deepEqual(
    myGraph.adjacentEdges('n0'),
    [ myGraph.edges('e0') ],
    '"adjacentEdges" returns the adjacent edges of a specified node'
  );
});

test('API', function() {
  var a,
      k,
      s = new sigma(),
      filter,
      graph = {
        nodes: [
          {
            id: 'n0',
            label: 'Node 0',
            myNodeAttr: 0,
            my: {node: {attr: 5}}
          },
          {
            id: 'n1',
            label: 'Node 1',
            myNodeAttr: 1,
            my: {node: {attr: 3}}
          },
          {
            id: 'n2',
            label: 'Node 2',
            myNodeAttr: 2,
            my: {node: {attr: -10}}
          },
          {
            id: 'n3',
            label: 'Node 3',
            myNodeAttr: -1,
            my: {node: {}}
          },
          {
            id: 'n4',
            label: 'Node 4',
            my: {node: {attr: 1}}
          }
        ],
        edges: [
          {
            id: 'e0',
            source: 'n0',
            target: 'n1',
            myEdgeAttr: 0
          },
          {
            id: 'e1',
            source: 'n1',
            target: 'n2',
            myEdgeAttr: 1
          },
          {
            id: 'e2',
            source: 'n1',
            target: 'n3',
            myEdgeAttr: 2
          },
          {
            id: 'e3',
            source: 'n2',
            target: 'n3',
            myEdgeAttr: -1
          },
          {
            id: 'e4',
            source: 'n0',
            target: 'n0'
          }
        ]
      };

  // Initialize the filter:
  filter = new sigma.plugins.filter(s);

  s.graph.read(graph);

  // helper function
  function hiddenNodes() {
    return s.graph.nodes().filter(function(n) {
      return n.hidden;
    });
  };

  // helper function
  function hiddenEdges() {
    return s.graph.edges().filter(function(e) {
      return e.hidden;
    });
  };

  // Show only with degree greater than a specified value
  function degreePredicate(n, params) {
    return this.graph.degree(n.id) > params.value;
  };

  // Show edges without the myEdgeAttr attribute or with myEdgeAttr > 1
  function myEdgeAttrPredicate(e) {
    return e.myEdgeAttr === undefined || e.myEdgeAttr > 1;
  };

  function dynamicAccessorPredicate(n, params) {
    return this.get(n, params.property) < params.threshold;
  }

  // Register the filter
  filter.nodesBy(degreePredicate, { value: 0 }, 'degree');

  deepEqual(
    hiddenNodes(),
    [],
    'A "nodesBy" filter is not applied automatically'
  );

  // Apply the filter
  filter.apply();

  deepEqual(
    hiddenNodes(),
    [ s.graph.nodes('n4') ],
    '"apply" applies a nodesBy filter'
  );

  // Undo this filter
  filter.undo('degree').apply();

  deepEqual(
    hiddenNodes(),
    [],
    '"undo(a)" undoes the specified filter'
  );

  // Register another filter
  filter.neighborsOf('n0').apply();

  deepEqual(
    hiddenNodes(),
    [s.graph.nodes('n2'), s.graph.nodes('n3'), s.graph.nodes('n4') ],
    '"neighborsOf" hides all nodes which are not linked to the specified node'
  );

  // Register and apply a filter with dynamic access to nodes properties
  filter
    .undo()
    .nodesBy(dynamicAccessorPredicate, {
      property: 'my.node.attr',
      threshold: 3
    })
    .apply();

  deepEqual(
    hiddenNodes(),
    [s.graph.nodes('n0'), s.graph.nodes('n1'), s.graph.nodes('n3') ],
    '"apply" applies a nodesBy filter with a dynamic accessor'
  );


  // Undo all filters
  filter.undo().apply();

  // Register an edge filter
  filter
    .edgesBy(myEdgeAttrPredicate)
    .apply();

  deepEqual(
    hiddenEdges(),
    [s.graph.edges('e0'), s.graph.edges('e1'), s.graph.edges('e3')],
    '"apply" applies an edgesBy filter'
  );


  // Register two filters and apply them
  filter
    .nodesBy(degreePredicate, { value: 0 })
    .edgesBy(myEdgeAttrPredicate)
    .apply();

  // Undo all filters
  filter.undo().apply();

  deepEqual(
    hiddenNodes().concat(hiddenEdges()),
    [],
    'All filters are undone at once'
  );


  // Register two filters and apply them
  filter
    .nodesBy(degreePredicate, { value: 0 }, 'degree')
    .edgesBy(myEdgeAttrPredicate, 'attr')
    .apply();

  deepEqual(
    filter.serialize().map(function(o) { return o.key }),
    ['degree', 'attr'],
    'The filters chain is serialized'
  );


  // Clear the filters chain
  filter.clear();

  deepEqual(
    filter.serialize(),
    [],
    'The filters chain is cleared'
  );

  // Undo all filters
  filter.undo().apply();


  // nodesBy X > undo > nodesBy Y > apply
  filter
    .nodesBy(degreePredicate, { value: 0 }, 'degree0')
    .undo()
    .nodesBy(degreePredicate, { value: 1 }, 'degree1')
    .apply();

  deepEqual(
    hiddenNodes(),
    [s.graph.nodes('n4') ],
    '"undo" undoes the filters before it in the chain, and not the filters after it'
  );


  // Call "apply" multiple times
  filter.apply().apply();

  deepEqual(
    hiddenNodes(),
    [s.graph.nodes('n4') ],
    '"apply" is called multiple times'
  );


  // Call "undo" with multiple arguments
  filter
    .nodesBy(degreePredicate, { value: 0 }, 'degree0')
    .undo('degree0', 'degree1')
    .apply();

  deepEqual(
    hiddenNodes(),
    [],
    '"undo" is called with multiple arguments'
  );


  // Import an empty chain
  filter.load([]);

  strictEqual(
    filter.serialize().length,
    0,
    'The empty chain is loaded'
  );


  // Import a chain of filters
  var chain = [
    {
      key: 'my-filter',
      predicate: degreePredicate,
      processor: 'nodes',
      options: { value: 0 }
    }
  ];

  filter.load(chain).apply();

  deepEqual(
    filter.serialize().map(function(o) {
      return {
        key: o.key,
        predicate: o.predicate,
        processor: o.processor,
        options: o.options
      };
    }),
    [{
      key: 'my-filter',
      predicate: degreePredicate.toString().replace(/\s+/g, ' '),
      processor: 'nodes',
      options: { value: 0 }
    }],
    'The chain of filters is loaded'
  );


  // serialize > import > serialize
  var dumpedChain = filter.load(filter.serialize()).serialize();

  deepEqual(
    chain.map(function(o) {
      return {
        key: o.key,
        processor: o.processor,
        options: o.options
      };
    }),
    dumpedChain.map(function(o) {
      return {
        key: o.key,
        processor: o.processor,
        options: o.options
      };
    }),
    'The serialized chain of filters is loaded'
  );


  // check chain duplication
  filter.apply().clear();

  strictEqual(
    dumpedChain.length,
    1,
    'The serialized chain is a deep copy of the internal chain'
  );


  // check chain duplication
  filter.load(chain);
  chain.length = 0;
  degreePredicate = null;

  deepEqual(
    filter.serialize().map(function(o) {
      return {
        key: o.key,
        predicate: o.predicate,
        processor: o.processor,
        options: o.options
      };
    }),
    [
      {
        key: 'my-filter',
        predicate: function degreePredicate(n, params) {
          return this.graph.degree(n.id) > params.value;
        }.toString().replace(/\s+/g, ' '),
        processor: 'nodes',
        options: { value: 0 }
      }
    ],
    'The internal chain is a deep copy of the loaded chain'
  );

  throws(
    function() {
      filter.nodesBy(function() {}, true);
    },
    new TypeError('Invalid argument: "key" is not a number or a string, was true'),
    '"nodesBy" with a wrong key type throws an error.'
  );

  throws(
    function() {
      filter.nodesBy(function() {}, {}, true);
    },
    new TypeError('Invalid argument: "key" is not a number or a string, was true'),
    '"nodesBy" with options and a wrong key type throws an error.'
  );

  throws(
    function() {
      filter.edgesBy(function() {}, '');
    },
    new TypeError('Invalid argument: "key" is an empty string.'),
    '"edgesBy" with a wrong key type throws an error.'
  );

  throws(
    function() {
      filter.edgesBy(function() {}, {}, '');
    },
    new TypeError('Invalid argument: "key" is an empty string.'),
    '"edgesBy" with options and a wrong key type throws an error.'
  );

  throws(
    function() {
      filter.neighborsOf('');
    },
    new TypeError('Invalid argument: id is an empty string.'),
    '"neighborsOf" with a wrong node id type throws an error.'
  );

  throws(
    function() {
      filter
        .nodesBy(function() {}, "a")
        .edgesBy(function() {}, "a");
    },
    new Error('Invalid argument: the filter of key "a" already exists.'),
    'Registering two filters with the same key throws an error.'
  );

  // check plugin lifecycle
  filter.kill();
  s.kill();
  s = new sigma();
  filter = new sigma.plugins.filter(s);
  s.graph.read(graph);
  filter.nodesBy(function (n) {
    return this.graph.degree(n.id) > 0;
  }, 'degree');
  filter.apply();

  deepEqual(
    hiddenNodes(),
    [ s.graph.nodes('n4') ],
    '"apply" applies a nodesBy filter after a kill of the plugin and sigma, and a new instanciation of them.'
  );

  sigma.plugins.killFilter(s);
  deepEqual(
    filter.serialize(),
    [],
    'The filters chain is empty after `killFilter` is called.'
  );
  filter.apply(); // does nothing
  filter.undo(); // does nothing

});
