module('sigma.plugins.filter');

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

  s.graph.addNode(graph.nodes[0]);
  s.graph.addNode(graph.nodes[1]);
  s.graph.addNode(graph.nodes[2]);
  s.graph.addNode(graph.nodes[3]);
  s.graph.addNode(graph.nodes[4]);

  s.graph.addEdge(graph.edges[0]);
  s.graph.addEdge(graph.edges[1]);
  s.graph.addEdge(graph.edges[2]);
  s.graph.addEdge(graph.edges[3]);

  function hiddenNodes() {
    return s.graph.nodes().filter(function(n) {
      return n.hidden;
    });
  };

  function hiddenEdges() {
    return s.graph.edges().filter(function(e) {
      return e.hidden;
    });
  };

  // Hide isolated nodes (i.e. degree(n) = 0)
  function degreePredicate(n) {
    return this.degree(n.id) > 0;
  };

  function myEdgeAttrPredicate(e) {
    return e.myEdgeAttr > 1;
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
    filter.chain().map(function(o) { return o.key }),
    ['degree', 'attr'],
    'The filter chain is exported'
  );


  // Clear the filter chain
  filter.clear();
  
  deepEqual(
    filter.chain(),
    [],
    'The filter chain is cleared'
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
    [s.graph.nodes('n0') , s.graph.nodes('n4') ],
    '"undo" undoes the filters before it in the chain, and not the filters after it'
  );


  // Call "apply" multiple times
  filter.apply().apply();

  deepEqual(
    hiddenNodes(),
    [s.graph.nodes('n0') , s.graph.nodes('n4') ],
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

  filter.undo().apply();


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
