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
