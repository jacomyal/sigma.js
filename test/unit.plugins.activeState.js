module('sigma.plugins.activeState');

test('Standard manipulation', function() {
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
            label: 'Node 1',
            active: true
          },
          {
            id: 'n2',
            label: 'Node 2'
          },
          {
            id: 'n3',
            label: 'Node 3'
          },
          {
            id: 'n4',
            label: 'Node 4',
            active: true
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
            target: 'n2',
            active: true
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
            target: 'n3'
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
  myGraph.addNode(graph.nodes[4]);

  opts.immutable = opts.clone = true;
  myGraph.addEdge(graph.edges[0]);
  opts.clone = false;
  myGraph.addEdge(graph.edges[1]);
  myGraph.addEdge(graph.edges[2]);
  myGraph.addEdge(graph.edges[3]);
  myGraph.addEdge(graph.edges[4]);

  // Instanciate the ActiveState plugin:
  var activeState = sigma.plugins.activeState(myGraph);


  // GRAPH MANIPULATIONS:
  // *********************
  equal(
    activeState.nodes().length, 
    2,
    '"graph.addNode" adds actives nodes to activeNodesIndex');
  equal(
    activeState.edges().length, 
    1,
    '"graph.addEdge" adds actives edges to activeEdgesIndex');

  myGraph.dropNode('n4');
  equal(
    activeState.nodes().length, 
    1,
    '"graph.dropNode" drops actives nodes from activeNodesIndex');

  myGraph.dropEdge('e4');
  equal(
    activeState.edges().length, 
    1,
    '"graph.dropEdge" drops actives edges from activeEdgesIndex');



  // (DE)ACTIVATING NODES:
  // *********************
  // all nodes:
  activeState.addNodes();
  equal(
    activeState.nodes().length,
    myGraph.nodes().length, 
    '"addNodes" adds all nodes to activeNodesIndex');

  activeState.dropNodes();
  equal(
    activeState.nodes().length, 
    0, 
    '"dropNodes" removes all nodes from activeNodesIndex');

  // one node:
  activeState.addNodes('n0');
  equal(
    myGraph.nodes('n0').active, 
    true, 
    '"addNodes" sets the node attribute "active" to true');
  equal(
    activeState.nodes().length, 
    1, 
    '"addNodes" adds one node to activeNodesIndex');
  
  activeState.dropNodes('n0');
  equal(
    myGraph.nodes('n0').active, 
    false, 
    '"dropNodes" sets the node attribute "active" to false');
  equal(
    activeState.nodes().length, 
    0, 
    '"dropNodes" removes one node from activeNodesIndex');
  
  // a set of nodes:
  activeState.addNodes(['n0', 'n1']);
  equal(
    myGraph.nodes('n0').active && myGraph.nodes('n1').active, 
    true, 
    '"addNodes" sets the attribute "active" of the nodes to true');
  equal(
    activeState.nodes().length, 
    2, 
    '"addNodes" adds the nodes to activeNodesIndex');
  
  activeState.dropNodes(['n0', 'n1']);
  equal(
    myGraph.nodes('n0').active || myGraph.nodes('n1').active, 
    false, 
    '"dropNodes" sets the attribute "active" of the nodes to false');
  equal(
    activeState.nodes().length, 
    0, 
    '"dropNodes" removes the nodes to activeNodesIndex');
  

  // (DE)ACTIVATING EDGES:
  // *********************
  // all edges:
  activeState.addEdges();
  equal(
    activeState.edges().length, 
    myGraph.edges().length, 
    'addEdges() adds all edges to activeEdgesIndex');

  activeState.dropEdges();
  equal(
    activeState.edges().length, 
    0, 
    '"dropEdges" removes all edges from activeEdgesIndex');

  // one edge:
  activeState.addEdges('e0');
  equal(
    myGraph.edges('e0').active, 
    true, 
    '"addEdges" sets the edge attribute "active" to true');
  equal(
    activeState.edges().length, 
    1, 
    '"addEdges" adds one edge to activeEdgesIndex');
  
  activeState.dropEdges('e0');
  equal(
    myGraph.edges('e0').active, 
    false, 
    '"dropEdges" sets the edge attribute "active" to false');
  equal(
    activeState.edges().length, 
    0, 
    '"dropEdges" removes one edge from activeEdgesIndex');

  // a set of edges:
  activeState.addEdges(['e0', 'e1']);
  equal(
    myGraph.edges('e0').active && myGraph.edges('e1').active, 
    true, 
    '"addEdges" sets the attribute "active" of the edges to true');
  equal(
    activeState.edges().length, 
    2, 
    '"addEdges" adds the edges to activeEdgesIndex');
  
  // kills the plugin instance:
  activeState.addNodes(['n0', 'n1']);
  sigma.plugins.killActiveState();
  equal(
    activeState.nodes().length, 
    0,
    '"killActiveState" clears activeNodesIndex');
  equal(
    activeState.edges().length, 
    0,
    '"killActiveState" clears activeEdgesIndex');

  // re-instiantiate the plugin:
  activeState = sigma.plugins.activeState(myGraph);
  equal(
    activeState.nodes().length, 
    2,
    '"activeState" recovers activeNodesIndex after a kill');
  equal(
    activeState.edges().length, 
    2,
    '"activeState" recovers activeEdgesIndex after a kill');

  // Advanced manipulation

  activeState.invertNodes();
  deepEqual(
    activeState.nodes(),
    [graph.nodes[2], graph.nodes[3]], 
    '"invertNodes" drops the currenct nodes and adds the other nodes');

  activeState
    .addEdges('e0')
    .addNeighbors();

  deepEqual(
    activeState.nodes(),
    [graph.nodes[2], graph.nodes[3], graph.nodes[1]], 
    '"addNeighbors" adds all node neighbors');

  equal(
    activeState.edges().length,
    0, 
    '"addNeighbors" drops all edges');

  activeState.setNodesBy(function(n) {
    return this.degree(n.id) === 1;
  });
  equal(
    activeState.nodes().length,
    1, 
    '"setNodesBy" drops the currenct nodes and adds the nodes that pass a predicate');

  activeState
    .dropNodes()
    .addEdges('e0')
    .invertEdges();

  deepEqual(
    activeState.edges(),
    [graph.edges[1], graph.edges[2], graph.edges[3]], 
    '"invertEdges" drops the currenct edges and adds the other edges');

});
