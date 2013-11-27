module('sigma.classes.graph');

test('Basic manipulation', function() {
  var a,
      k,
      graph = {
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
          }
        ]
      };

  // Initialize the graph:
  var myGraph = new sigma.classes.graph();
  for (k in graph.nodes)
    myGraph.addNode(graph.nodes[k]);
  for (k in graph.edges)
    myGraph.addEdge(graph.edges[k]);




  // NODES:
  // ******
  deepEqual(
    graph.nodes[0],
    myGraph.nodes(graph.nodes[0].id),
    '"addNode" works and the node properties have been preserved.'
  );

  notStrictEqual(
    graph.nodes[0],
    myGraph.nodes(graph.nodes[0].id),
    '"addNode" creates a new object.'
  );

  notStrictEqual(
    graph.nodes[0],
    myGraph.nodes(graph.nodes[0].id),
    '"addNode" creates a new object.'
  );

  myGraph.nodes(graph.nodes[0].id).id = 'new_n0';
  strictEqual(
    graph.nodes[0].id,
    myGraph.nodes(graph.nodes[0].id).id,
    'Node ids in the graph are not writable.'
  );

  myGraph.nodes(graph.nodes[0].id).label = 'New node 0';
  strictEqual(
    'New node 0',
    myGraph.nodes(graph.nodes[0].id).label,
    'Other node attributes are writable.'
  );
  myGraph.nodes(graph.nodes[0].id).label = 'Node 0';

  notStrictEqual(
    myGraph.nodes(),
    myGraph.nodes(),
    '"nodes" without arguments returns a copy of the nodes array.'
  );

  strictEqual(
    myGraph.nodes('unexisting_id'),
    undefined,
    '"nodes" with an unreferenced id returns undefined and does not throw an error.'
  );

  deepEqual(
    myGraph.nodes(['n0', 'n1', 'n0']),
    [graph.nodes[0], graph.nodes[1], graph.nodes[0]],
    '"nodes" with a strings array as arguments returns the array of specified nodes.'
  );

  throws(
    function() {
      myGraph.nodes(['n0', 'n1', 123]);
    },
    /nodes: Wrong arguments/,
    '"nodes" with an array containing a non-string value throws an error.'
  );

  throws(
    function() {
      myGraph.addNode(graph.nodes[0]);
    },
    /The node "n0" already exists./,
    'Adding an already existing node throws an error.'
  );




  // EDGES:
  // ******
  deepEqual(
    graph.edges[0],
    myGraph.edges(graph.edges[0].id),
    '"addEdge" works and the edge properties have been preserved.'
  );

  notStrictEqual(
    graph.edges[0],
    myGraph.edges(graph.edges[0].id),
    '"addEdge" creates a new object.'
  );

  notStrictEqual(
    graph.edges[0],
    myGraph.edges(graph.edges[0].id),
    '"addEdge" creates a new object.'
  );

  myGraph.edges(graph.edges[0].id).id = 'new_e0';
  strictEqual(
    graph.edges[0].id,
    myGraph.edges(graph.edges[0].id).id,
    'Edge ids in the graph are not writable.'
  );

  myGraph.edges(graph.edges[0].id).source = 'undefined_node';
  strictEqual(
    graph.edges[0].source,
    myGraph.edges(graph.edges[0].id).source,
    'Edge sources in the graph are not writable.'
  );

  myGraph.edges(graph.edges[0].id).target = 'undefined_node';
  strictEqual(
    graph.edges[0].target,
    myGraph.edges(graph.edges[0].id).target,
    'Edge sources in the graph are not writable.'
  );

  myGraph.edges(graph.edges[0].id).myEdgeAttr = 456;
  strictEqual(
    456,
    myGraph.edges(graph.edges[0].id).myEdgeAttr,
    'Other edge attributes are writable.'
  );
  myGraph.edges(graph.edges[0].id).myEdgeAttr = 123;

  notStrictEqual(
    myGraph.edges(),
    myGraph.edges(),
    '"edges" without arguments returns a copy of the edge array.'
  );

  strictEqual(
    myGraph.edges('unexisting_id'),
    undefined,
    '"edges" with an unreferenced id returns undefined and does not throw an error.'
  );

  deepEqual(
    myGraph.edges(['e0', 'e0']),
    [graph.edges[0], graph.edges[0]],
    '"edges" with a strings array as arguments returns the array of specified edge.'
  );

  throws(
    function() {
      myGraph.edges(['e0', 123]);
    },
    /edges: Wrong arguments/,
    '"edges" with an array containing a non-string value throws an error.'
  );

  throws(
    function() {
      myGraph.addEdge(graph.edges[0]);
    },
    /The edge "e0" already exists./,
    'Adding an already existing edge throws an error.'
  );




  // DROPING AND CLEARING:
  // *********************
  myGraph.dropNode('n0');
  deepEqual(
    myGraph.nodes().map(function(n) { return n.id }),
    ['n1', 'n2'],
    '"dropNode" actually drops the node.'
  );
  deepEqual(
    myGraph.edges().map(function(e) { return e.id }),
    ['e1'],
    '"dropNode" also kills the edges linked to the related nodes..'
  );

  throws(
    function() {
      myGraph.dropNode('n0');
    },
    /The node "n0" does not exist./,
    'Droping an unexisting node throws an error.'
  );

  myGraph.dropEdge('e1');
  deepEqual(
    myGraph.edges(),
    [],
    '"dropEdge" actually drops the edge.'
  );

  throws(
    function() {
      myGraph.dropEdge('e1');
    },
    /The edge "e1" does not exist./,
    'Droping an unexisting edge throws an error.'
  );

  // Reinitialize the graph:
  myGraph.addNode(graph.nodes[0]);
  myGraph.addEdge(graph.edges[0]);
  myGraph.addEdge(graph.edges[1]);

  myGraph.clear();
  deepEqual(
    [myGraph.nodes(), myGraph.edges()],
    [[], []],
    '"clear" empties the nodes and edges arrays.'
  );
});

test('Methods and attached functions', function() {
  var counter,
      myGraph;

  counter = 0;
  sigma.classes.graph.attach('addNode', 'counterInc', function() {
    counter++;
  });

  sigma.classes.graph.addMethod('getNodeLabel', function(nId) {
    return (this.nodesIndex[nId] || {}).label;
  });

  myGraph = new sigma.classes.graph();
  myGraph.addNode({ id: 'n0', label: 'My node' });
  strictEqual(
    1,
    counter,
    'Attached functions are effectively executed when the anchor method is called.'
  );
  strictEqual(
    myGraph.getNodeLabel('n0'),
    'My node',
    'Custom methods work, can have arguments, and have access to the data in their scope (through "this").'
  );

  throws(
    function() {
      sigma.classes.graph.attach('addNode', 'counterInc', function() {});
    },
    /A function "counterInc" is already attached to the method "addNode"/,
    'Attaching a function to a method when there is already a function attached to this method under the same key throws an error.'
  );

  throws(
    function() {
      sigma.classes.graph.attach('undefinedMethod', 'counterInc', function() {});
    },
    /The method "undefinedMethod" does not exist./,
    'Attaching a function to an unexisting method when throws an error.'
  );

  throws(
    function() {
      sigma.classes.graph.addMethod('getNodeLabel', function() {});
    },
    /The method "getNodeLabel" already exists./,
    'Attaching a method whose name is already referenced throws an error.'
  );
});

test('Indexes', function() {
  var myGraph;

  sigma.classes.graph.addIndex('nodesCount', {
    constructor: function() {
      this.nodesCount = 0;
    },
    addNode: function() {
      this.nodesCount++;
    },
    dropNode: function() {
      this.nodesCount--;
    },
    clear: function() {
      this.nodesCount = 0;
    }
  });

  sigma.classes.graph.addMethod('getNodesCount', function() {
    return this.nodesCount;
  });

  myGraph = new sigma.classes.graph();
  myGraph.addNode({ id: 'n0' }).addNode({ id: 'n1' }).dropNode('n0');
  strictEqual(
    1,
    myGraph.getNodesCount(),
    'Indexes work, and the scope is effectively shared with custom methods.'
  );
});
