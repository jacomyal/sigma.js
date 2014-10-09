module('sigma.classes.graph');

test('Basic manipulation', function() {
  var a,
      k,
      opts = {},
      settings = new sigma.classes.configurable(opts),
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
          },
          {
            id: 'e4',
            source: 'n2',
            target: 'n2'
          }
        ]
      };

  // Initialize the graph:
  var myGraph = new sigma.classes.graph(settings);

  opts.immutable = opts.clone = true;
  myGraph.addNode(graph.nodes[0]);
  opts.clone = false;
  myGraph.addNode(graph.nodes[1]);
  myGraph.addNode(graph.nodes[2]);
  myGraph.addNode(graph.nodes[3]);

  opts.immutable = opts.clone = true;
  myGraph.addEdge(graph.edges[0]);
  opts.clone = false;
  myGraph.addEdge(graph.edges[1]);
  myGraph.addEdge(graph.edges[2]);
  myGraph.addEdge(graph.edges[3]);
  myGraph.addEdge(graph.edges[4]);

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
    'With {clone: true}, "addNode" creates a new object.'
  );

  equal(
    graph.nodes[1],
    myGraph.nodes(graph.nodes[1].id),
    'With {clone: false}, "addNode" keeps the same object.'
  );

  myGraph.nodes(graph.nodes[0].id).id = 'new_n0';
  strictEqual(
    graph.nodes[0].id,
    myGraph.nodes(graph.nodes[0].id).id,
    'With {immutable: true}, node ids in the graph are not writable.'
  );

  var node = myGraph.nodes(graph.nodes[1].id);
  node.id = 'new_n0';
  strictEqual(
    'new_n0',
    node.id,
    'With {immutable: false}, node ids in the graph are writable.'
  );
  node.id = 'n1';

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
      myGraph.nodes(['n0', 'n1', {}]);
    },
    /nodes: Wrong arguments/,
    '"nodes" with an array containing a non-string or non-number value throws an error.'
  );

  throws(
    function() {
      myGraph.addNode(graph.nodes[0]);
    },
    /The node "n0" already exists./,
    'Adding an already existing node throws an error.'
  );

  myGraph.addNode({ id: 'prototype' }).addNode({ id: 'constructor' });
  ok(
    myGraph.nodes('prototype') && myGraph.nodes('constructor'),
    '"constructor" and "prototype" are valid node IDs.'
  );
  myGraph.dropNode('prototype').dropNode('constructor');



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
    'With {clone: true}, "addEdge" creates a new object.'
  );

  equal(
    graph.edges[1],
    myGraph.edges(graph.edges[1].id),
    'With {clone: false}, "addEdge" keeps the same object.'
  );

  myGraph.edges(graph.edges[0].id).id = 'new_e0';
  myGraph.edges(graph.edges[0].id).source = 'undefined_node';
  myGraph.edges(graph.edges[0].id).target = 'undefined_node';
  deepEqual(
    [
      graph.edges[0].id,
      graph.edges[0].source,
      graph.edges[0].target
    ],
    [
      myGraph.edges(graph.edges[0].id).id,
      myGraph.edges(graph.edges[0].id).source,
      myGraph.edges(graph.edges[0].id).target
    ],
    'With {immutable: true}, edge sources, targets and ids in the graph are not writable.'
  );

  var edge = myGraph.edges(graph.edges[1].id);
  edge.id = 'new_e0';
  edge.source = 'undefined_node';
  edge.target = 'undefined_node';
  deepEqual(
    [
      'new_e0',
      'undefined_node',
      'undefined_node'
    ],
    [
      edge.id,
      edge.source,
      edge.target
    ],
    'With {immutable: false}, edge sources, targets and ids in the graph are writable.'
  );
  edge.id = 'e1';
  edge.source = 'n1';
  edge.target = 'n2';

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
      myGraph.edges(['e0', {}]);
    },
    /edges: Wrong arguments/,
    '"edges" with an array containing a non-string or non-number value throws an error.'
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
    ['n1', 'n2', 'n3'],
    '"dropNode" actually drops the node.'
  );
  deepEqual(
    myGraph.edges().map(function(e) { return e.id }),
    ['e1', 'e2', 'e3', 'e4'],
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
    myGraph.edges().map(function(e) { return e.id }),
    ['e2', 'e3', 'e4'],
    '"dropEdge" actually drops the edge.'
  );

  myGraph.dropEdge('e4');
  deepEqual(
    myGraph.edges().map(function(e) { return e.id }),
    ['e2', 'e3'],
    '"dropEdge" with a self loops works. (#286)'
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

  myGraph = new sigma.classes.graph();
  myGraph.read(graph);

  deepEqual(myGraph.nodes(), graph.nodes, '"read" adds properly the nodes.');
  deepEqual(myGraph.edges(), graph.edges, '"read" adds properly the edges.');
});

test('Methods and attached functions', function() {
  var counter,
      colorPalette = { Person: '#C3CBE1', Place: '#9BDEBD' },
      myGraph;

  counter = 0;
  sigma.classes.graph.attach('addNode', 'counterInc', function() {
    counter++;
  });

  sigma.classes.graph.attachBefore('addNode', 'applyNodeColorPalette', function(n) {
    n.color = colorPalette[n.category];
  });

  strictEqual(
    false,
    sigma.classes.graph.hasMethod('getNodeLabel'),
    'sigma.classes.hasMethod returns false if the method does not exist.'
  );

  sigma.classes.graph.addMethod('getNodeLabel', function(nId) {
    return (this.nodesIndex[nId] || {}).label;
  });

  strictEqual(
    true,
    sigma.classes.graph.hasMethod('getNodeLabel'),
    'sigma.classes.hasMethod returns true if the method has been added with addMethod.'
  );

  strictEqual(
    true,
    sigma.classes.graph.hasMethod('hasMethod'),
    'sigma.classes.hasMethod returns true if the method is implemented in the core.'
  );

  myGraph = new sigma.classes.graph();
  myGraph.addNode({ id: 'n0', label: 'My node', category: 'Person' });
  strictEqual(
    1,
    counter,
    'Attached functions are effectively executed when the anchor method is called.'
  );
  strictEqual(
    myGraph.nodes('n0').color,
    '#C3CBE1',
    'Attached "before" functions are effectively executed before when the anchor method is called.'
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
      sigma.classes.graph.attachBefore('addNode', 'applyNodeColorPalette', function() {});
    },
    /A function "applyNodeColorPalette" is already attached to the method "addNode"/,
    'Attaching a "before" function to a method when there is already a "before" function attached to this method under the same key throws an error.'
  );

  throws(
    function() {
      sigma.classes.graph.attachBefore('undefinedMethod', 'applyNodeColorPalette', function() {});
    },
    /The method "undefinedMethod" does not exist./,
    'Attaching a "before" function to an unexisting method when throws an error.'
  );

  throws(
    function() {
      sigma.classes.graph.addMethod('getNodeLabel', function() {});
    },
    /The method "getNodeLabel" already exists./,
    'Attaching a method whose name is already referenced throws an error.'
  );
});

test('Builtin indexes', function() {
  var graph = {
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

  sigma.classes.graph.addMethod('retrieveIndexes', function() {
    return {
      'inIndex': this.inNeighborsIndex,
      'outIndex': this.outNeighborsIndex,
      'allIndex': this.allNeighborsIndex,
      'inCount': this.inNeighborsCount,
      'outCount': this.outNeighborsCount,
      'allCount': this.allNeighborsCount
    }
  });

  var g = new sigma.classes.graph();
  g.read(graph);

  var index = g.retrieveIndexes();

  deepEqual(
    index['inIndex'],
    {
      n0: {},
      n1: {
        n0: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      },
      n2: {
        n1: {
          e1: {
            id: "e1",
            source: "n1",
            target: "n2"
          }
        }
      }
    },
    'Incoming index up to date'
  );

  deepEqual(
    index['inCount'],
    {
      n0: 0,
      n1: 1,
      n2: 1
    },
    'Incoming count up to date'
  );

  deepEqual(
    index['outIndex'],
    {
      n0: {
        n1: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      },
      n1: {
        n2: {
          e1: {
            id: "e1",
            source: "n1",
            target: "n2"
          }
        }
      },
      n2: {}
    },
    'Outcoming index up to date'
  );

  deepEqual(
    index['outCount'],
    {
      n0: 1,
      n1: 1,
      n2: 0
    },
    'Outcoming count up to date'
  );

  deepEqual(
    index['allIndex'],
    {
      n0: {
        n1: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      },
      n1: {
        n0: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        },
        n2: {
          e1: {
            id: "e1",
            source: "n1",
            target: "n2"
          }
        }
      },
      n2: {
        n1: {
          e1: {
            id: "e1",
            source: "n1",
            target: "n2"
          }
        }
      }
    },
    'Full index up to date'
  );

  deepEqual(
    index['allCount'],
    {
      n0: 1,
      n1: 2,
      n2: 1
    },
    'Full count up to date'
  );

  g.dropNode('n2');

  deepEqual(
    index['inIndex'],
    {
      n0: {},
      n1: {
        n0: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      }
    },
    'Incoming index up to date after having dropped a node'
  );

  deepEqual(
    index['inCount'],
    {
      n0: 0,
      n1: 1
    },
    'Incoming count up to date after having dropped a node'
  );

  deepEqual(
    index['outIndex'],
    {
      n0: {
        n1: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      },
      n1: {}
    },
    'Outcoming index up to date after having dropped a node'
  );

  deepEqual(
    index['outCount'],
    {
      n0: 1,
      n1: 0
    },
    'Outcoming count up to date after having dropped a node'
  );

  deepEqual(
    index['allIndex'],
    {
      n0: {
        n1: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      },
      n1: {
        n0: {
          e0: {
            id: "e0",
            myEdgeAttr: 123,
            source: "n0",
            target: "n1"
          }
        }
      }
    },
    'Full index up to date after having dropped a node'
  );

  deepEqual(
    index['allCount'],
    {
      n0: 1,
      n1: 1
    },
    'Full count up to date after having dropped a node'
  );

  g.dropEdge('e0');

  deepEqual(
    index['inIndex'],
    {
      n0: {},
      n1: {}
    },
    'Incoming index up to date after having dropped an edge'
  );

  deepEqual(
    index['inCount'],
    {
      n0: 0,
      n1: 0
    },
    'Incoming count up to date after having dropped an edge'
  );

  deepEqual(
    index['outIndex'],
    {
      n0: {},
      n1: {}
    },
    'Outcoming index up to date after having dropped an edge'
  );

  deepEqual(
    index['outCount'],
    {
      n0: 0,
      n1: 0
    },
    'Outcoming count up to date after having dropped an edge'
  );

  deepEqual(
    index['allIndex'],
    {
      n0: {},
      n1: {}
    },
    'Full index up to date after having dropped an edge'
  );

  deepEqual(
    index['allCount'],
    {
      n0: 0,
      n1: 0
    },
    'Full count up to date after having dropped an edge'
  );
});

test('Custom indexes', function() {
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
