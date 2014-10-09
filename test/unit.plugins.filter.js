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
            myNodeAttr: 0
          },
          {
            id: 'n1',
            label: 'Node 1',
            myNodeAttr: 1
          },
          {
            id: 'n2',
            label: 'Node 2',
            myNodeAttr: 2
          },
          {
            id: 'n3',
            label: 'Node 3',
            myNodeAttr: -1
          },
          {
            id: 'n4',
            label: 'Node 4'
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

  // Show non-isolated nodes only
  function degreePredicate(n) {
    return this.degree(n.id) > 0;
  };

  // Show edges without the myEdgeAttr attribute or with myEdgeAttr > 1
  function myEdgeAttrPredicate(e) {
    return e.myEdgeAttr === undefined || e.myEdgeAttr > 1;
  };

  // Register the filter
  filter.nodesBy(degreePredicate, 'degree');

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
    [s.graph.nodes('n2') , s.graph.nodes('n3') , s.graph.nodes('n4') ],
    '"neighborsOf" hides all nodes which are not linked to the specified node'
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
    .nodesBy(degreePredicate)
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
    .nodesBy(degreePredicate, 'degree')
    .edgesBy(myEdgeAttrPredicate, 'attr')
    .apply();

  deepEqual(
    filter.export().map(function(o) { return o.key }),
    ['degree', 'attr'],
    'The filters chain is exported'
  );


  // Clear the filters chain
  filter.clear();

  deepEqual(
    filter.export(),
    [],
    'The filters chain is cleared'
  );

  // Undo all filters
  filter.undo().apply();


  // nodesBy X > undo > nodesBy Y > apply
  filter
    .nodesBy(degreePredicate, 'degree0')
    .undo()
    .nodesBy(function(n) {
      return this.degree(n.id) > 1;
    }, 'degree1')
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
    .nodesBy(degreePredicate, 'degree0')
    .undo('degree0', 'degree1')
    .apply();

  deepEqual(
    hiddenNodes(),
    [],
    '"undo" is called with multiple arguments'
  );


  // Import an empty chain
  filter.import([]);

  strictEqual(
    filter.export().length,
    0,
    'The empty chain is imported'
  );


  // Import a chain of filters
  var chain = [
    {
      key: 'my-filter',
      predicate: degreePredicate,
      processor: 'filter.processors.nodes'
    }
  ];

  filter.import(chain).apply();

  deepEqual(
    filter.export().map(function(o) {
      return {
        key: o.key,
        predicate: o.predicate.toString(),
        processor: o.processor
      };
    }),
    [{
      key: 'my-filter',
      predicate: degreePredicate.toString(),
      processor: 'filter.processors.nodes'
    }],
    'The filters chain is imported'
  );


  // export > import > export
  var dumpedChain = filter.import(filter.export()).export();

  deepEqual(
    chain.map(function(o) {
      return {
        key: o.key,
        predicate: o.predicate.toString(),
        processor: o.processor
      };
    }),
    dumpedChain.map(function(o) {
      return {
        key: o.key,
        predicate: o.predicate.toString(),
        processor: o.processor
      };
    }),
    'The exported filters chain is imported'
  );


  // check chain duplication
  filter.clear();

  strictEqual(
    dumpedChain.length,
    1,
    'The exported chain is a deep copy of the internal chain'
  );


  // check chain duplication
  filter.import(chain);
  chain.length = 0;
  degreePredicate = null;

  deepEqual(
    filter.export().map(function(o) {
      return {
        key: o.key,
        predicate: o.predicate.toString().replace(/\s+/g, ' '),
        processor: o.processor
      };
    }),
    [
      {
        key: 'my-filter',
        predicate: function degreePredicate(n) {
          return this.degree(n.id) > 0;
        }.toString().replace(/\s+/g, ' '),
        processor: 'filter.processors.nodes'
      }
    ],
    'The internal chain is a deep copy of the imported chain'
  );


  throws(
    function() {
      filter.nodesBy(function() {}, 5);
    },
    /The filter key \"5\" must be a string./,
    '"nodesBy" with a wrong key type throws an error.'
  );

  throws(
    function() {
      filter.edgesBy(function() {}, '');
    },
    /The filter key must be a non-empty string./,
    '"edgesBy" with a wrong key type throws an error.'
  );

  throws(
    function() {
      filter.neighborsOf(0);
    },
    /The node id \"0\" must be a string./,
    '"neighborsOf" with a wrong node id type throws an error.'
  );

  throws(
    function() {
      filter.neighborsOf('');
    },
    /The node id must be a non-empty string./,
    '"neighborsOf" with a wrong node id type throws an error.'
  );

  throws(
    function() {
      filter
        .nodesBy(function() {}, "a")
        .edgesBy(function() {}, "a");
    },
    /The filter \"a\" already exists./,
    'Registering two filters with the same key throws an error.'
  );

});
