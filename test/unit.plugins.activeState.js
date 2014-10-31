module('sigma.plugins.activeState');

test('Standard manipulation', function() {
  var a,
      k,
      s = new sigma(),
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
  s.graph.read(graph);

  // Instanciate the ActiveState plugin:
  var activeState = sigma.plugins.activeState(s);


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

  s.graph.dropNode('n4');
  equal(
    activeState.nodes().length, 
    1,
    '"graph.dropNode" drops actives nodes from activeNodesIndex');

  s.graph.dropEdge('e4');
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
    s.graph.nodes().length, 
    '"addNodes" adds all nodes to activeNodesIndex');

  activeState.dropNodes();
  equal(
    activeState.nodes().length, 
    0, 
    '"dropNodes" removes all nodes from activeNodesIndex');

  // one node:
  activeState.addNodes('n0');
  equal(
    s.graph.nodes('n0').active, 
    true, 
    '"addNodes" sets the node attribute "active" to true');
  equal(
    activeState.nodes().length, 
    1, 
    '"addNodes" adds one node to activeNodesIndex');
  
  activeState.dropNodes('n0');
  equal(
    s.graph.nodes('n0').active, 
    false, 
    '"dropNodes" sets the node attribute "active" to false');
  equal(
    activeState.nodes().length, 
    0, 
    '"dropNodes" removes one node from activeNodesIndex');
  
  // a set of nodes:
  activeState.addNodes(['n0', 'n1']);
  equal(
    s.graph.nodes('n0').active && s.graph.nodes('n1').active, 
    true, 
    '"addNodes" sets the attribute "active" of the nodes to true');
  equal(
    activeState.nodes().length, 
    2, 
    '"addNodes" adds the nodes to activeNodesIndex');
  
  activeState.dropNodes(['n0', 'n1']);
  equal(
    s.graph.nodes('n0').active || s.graph.nodes('n1').active, 
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
    s.graph.edges().length, 
    'addEdges() adds all edges to activeEdgesIndex');

  activeState.dropEdges();
  equal(
    activeState.edges().length, 
    0, 
    '"dropEdges" removes all edges from activeEdgesIndex');

  // one edge:
  activeState.addEdges('e0');
  equal(
    s.graph.edges('e0').active, 
    true, 
    '"addEdges" sets the edge attribute "active" to true');
  equal(
    activeState.edges().length, 
    1, 
    '"addEdges" adds one edge to activeEdgesIndex');
  
  activeState.dropEdges('e0');
  equal(
    s.graph.edges('e0').active, 
    false, 
    '"dropEdges" sets the edge attribute "active" to false');
  equal(
    activeState.edges().length, 
    0, 
    '"dropEdges" removes one edge from activeEdgesIndex');

  // a set of edges:
  activeState.addEdges(['e0', 'e1']);
  equal(
    s.graph.edges('e0').active && s.graph.edges('e1').active, 
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
  activeState = sigma.plugins.activeState(s);
  equal(
    activeState.nodes().length, 
    2,
    '"activeState" regenerates activeNodesIndex after a kill');
  equal(
    activeState.edges().length, 
    2,
    '"activeState" regenerates activeEdgesIndex after a kill');

  // Advanced manipulation

  activeState.invertNodes();
  deepEqual(
    activeState.nodes().map(function(n) { return n.id; }),
    ['n2', 'n3'], 
    '"invertNodes" drops the currenct nodes and adds the other nodes');

  activeState
    .addEdges('e0')
    .addNeighbors();

  deepEqual(
    activeState.nodes().map(function(n) { return n.id; }),
    ['n2', 'n3', 'n1'], 
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
    activeState.edges().map(function(e) { return e.id; }),
    ['e1', 'e2', 'e3'], 
    '"invertEdges" drops the currenct edges and adds the other edges');


  // CLEAR GRAPH:
  // *********************
  s.graph.clear();

  equal(
    activeState.nodes().length,
    0, 
    '"graph.clear" drops all nodes');

  equal(
    activeState.edges().length,
    0, 
    '"graph.clear" drops all edges');
});
