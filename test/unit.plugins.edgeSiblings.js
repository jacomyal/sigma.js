module('sigma.plugins.edgeSiblings');

test('API', function() {
  var e0 = {
    id: 'e0',
    label: 'Edge 0',
    source: 'n0',
    target: 'n1',
    type: 'line',
    size: Math.random(),
    color: '#ccc',
    anAttr: 0
  };
  var e1 = {
    id: 'e1',
    label: 'Edge 1',
    source: 'n0',
    target: 'n1',
    type: 'line',
    size: Math.random(),
    color: '#ccc',
    anAttr: 1
  };
  var e2 = {
    id: 'e2',
    label: 'Edge 2',
    source: 'n0',
    target: 'n1',
    type: 'line',
    size: Math.random(),
    color: '#ccc',
    anAttr: 2
  };
  var e3 = {
    id: 'e3',
    label: 'Edge 3',
    source: 'n2',
    target: 'n3',
    type: 'line',
    size: Math.random(),
    color: '#ccc',
    anAttr: -1
  };
  var e4 = {
    id: 'e4',
    label: 'Edge 4',
    source: 'n0',
    target: 'n0',
    type: 'line',
    size: Math.random(),
    color: '#ccc',
    anAttr: 1
  };

  // clone data to make testing easier
  var s = new sigma({ settings: { clone:true } }),
      graph = {
        nodes: [{ id: 'n0' }, { id: 'n1' }, { id: 'n2' }, { id: 'n3' }],
        edges: [e0, e1, e3, e4]
      };

  s.graph.readWithSiblings(graph);



  ok(
    s.graph.edges().length == 3,
    '"readWithSiblings" does not create parallel edges.'
  );

  deepEqual(
    s.graph.edges('e0').siblings,
    {
      'e0': e0,
      'e1': e1
    },
    '"readWithSiblings" adds a sibling to an existing edge.'
  );



  s.graph.addEdgeSibling(e2);

  ok(
    s.graph.edges().length == 3,
    '"addEdgeSibling" does not create parallel edges in the graph.'
  );

  deepEqual(
    s.graph.edges('e0').siblings,
    {
      'e0': e0,
      'e1': e1,
      'e2': e2
    },
    '"addEdgeSibling" adds a sibling to an existing edge.'
  );

  ok(
    s.graph.edges('e0').type == 'parallel',
    '"addEdgeSibling" sets the type of edges with sibling as "parallel".'
  );

  ok(
    s.graph.edges('e0').size == 1,
    '"addEdgeSibling" set the size of edges with sibling to 1.'
  );

  ok(
    s.graph.edges('e0').color === undefined,
    '"addEdgeSibling" removes the color of edges with sibling.'
  );

  ok(
    s.graph.edges('e0').label === undefined,
    '"addEdgeSibling" removes the label of edges with sibling.'
  );

  throws(
    function() {
      s.graph.addEdgeSibling(e0);
    },
    new Error('Invalid argument: an edge of id "e0" already exists.'),
    '"addEdgeSibling" with an existing edge throws an error.'
  );

  throws(
    function() {
      s.graph.addEdgeSibling(e1);
    },
    new Error('Invalid argument: an edge sibling of id "e1" already exists.'),
    '"addEdgeSibling" with an existing sibling throws an error.'
  );



  deepEqual(
    s.graph.edgeSiblings(),
    s.graph.edges(),
    '"edgeSiblings" with no argument returns all edges.'
  );

  deepEqual(
    s.graph.edgeSiblings('e0').siblings,
    {
      'e0': e0,
      'e1': e1,
      'e2': e2
    },
    '"edgeSiblings" with a container returns the edge.'
  );

  deepEqual(
    s.graph.edgeSiblings('e1'),
    s.graph.edges('e0'),
    '"edgeSiblings" with a sibling returns its container.'
  );

  deepEqual(
    s.graph.edgeSiblings('e3'),
    e3,
    '"edgeSiblings" with an edge returns the edge.'
  );

  deepEqual(
    s.graph.edgeSiblings('ex'),
    undefined,
    '"edgeSiblings" with an unknown edge returns undefined.'
  );

  deepEqual(
    s.graph.edgeSiblings(['e0', 'e1', 'e3']),
    [
      s.graph.edgeSiblings('e0'),
      s.graph.edgeSiblings('e1'),
      s.graph.edgeSiblings('e3')
    ],
    '"edgeSiblings" with a mixed array of edges and siblings returns an array of edges.'
  );



  s.graph.dropEdgeSibling('e2');

  deepEqual(
    s.graph.edges('e0').siblings,
    {
      'e0': e0,
      'e1': e1
    },
    '"dropEdgeSibling" drops a sibling to an existing edge.'
  );



  s.graph.dropEdgeSibling('e1');

  ok(
    s.graph.edges('e0').siblings === undefined,
    '"dropEdgeSibling" transforms a single sibling into an edge.'
  );

  ok(
    s.graph.edges('e0').type === e0.type,
    '"dropEdgeSibling" restores the type of edges with no sibling anymore.'
  );

  ok(
    s.graph.edges('e0').size === e0.size,
    '"dropEdgeSibling" restores the size of edges with no sibling anymore.'
  );

  ok(
    s.graph.edges('e0').color === e0.color,
    '"dropEdgeSibling" restores the color of edges with no sibling anymore.'
  );

  ok(
    s.graph.edges('e0').anAttr === e0.anAttr,
    '"dropEdgeSibling" restores the attributes of edges with no sibling anymore.'
  );

  s.graph.addEdgeSibling(e1);



  s.graph.dropEdgeSibling('e0');

  ok(
    s.graph.edges('e0') === undefined,
    '"dropEdgeSibling" drops an edge.'
  );

  s.graph.dropEdgeSibling('e1');

  ok(
    s.graph.edges().length == 2,
    '"dropEdgeSibling" drops an edge which was formally a sibling.'
  );


  // Reset sigma:
  s = new sigma({ settings: { clone:true } }),
      graph = {
        nodes: [{ id: 'n0' }, { id: 'n1' }, { id: 'n2' }, { id: 'n3' }],
        edges: [e0, e1, e3, e4]
      };

  s.graph.readWithSiblings(graph);



  s.graph.addEdge(e2);

  deepEqual(
    s.graph.edges('e2'),
    e2,
    '"addEdge" adds an edge normally.'
  );

  s.graph.addEdge(e1);

  deepEqual(
    s.graph.edges('e1'),
    e1,
    '"addEdge" adds a parallel edge even when a sibling exists.'
  );

  s.graph.dropEdgeSibling('e1');

  ok(
    s.graph.edges('e0').siblings === undefined &&
    s.graph.edges('e1') !== undefined,
    '"dropEdgeSibling" drops a sibling and does not drop the parallel edge.'
  );

  s.graph.dropEdge('e1');

  s.graph.addEdgeSibling(e1);
  // // which edge contains the sibling? not determined
});
