import Configurable from "../Configurable";
import Graph from "../Graph";

describe("The Graph Class", () => {
  it("Basic manipulation", () => {
    const opts = {};
    const settings = new Configurable(opts);
    const graph = {
      nodes: [
        {
          id: "n0",
          label: "Node 0",
          myNodeAttr: 123
        },
        {
          id: "n1",
          label: "Node 1"
        },
        {
          id: "n2",
          label: "Node 2"
        },
        {
          id: "n3",
          label: "Node 3"
        }
      ],
      edges: [
        {
          id: "e0",
          source: "n0",
          target: "n1",
          myEdgeAttr: 123
        },
        {
          id: "e1",
          source: "n1",
          target: "n2"
        },
        {
          id: "e2",
          source: "n1",
          target: "n3"
        },
        {
          id: "e3",
          source: "n2",
          target: "n3"
        },
        {
          id: "e4",
          source: "n2",
          target: "n2"
        }
      ]
    };

    // Initialize the graph:
    let myGraph = new Graph(settings);

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
    expect(graph.nodes[0]).toEqual(
      myGraph.nodes(graph.nodes[0].id),
      '"addNode" works and the node properties have been preserved.'
    );

    expect(graph.nodes[0]).not.toBe(
      myGraph.nodes(graph.nodes[0].id),
      'With {clone: true}, "addNode" creates a new object.'
    );

    expect(graph.nodes[1]).toEqual(
      myGraph.nodes(graph.nodes[1].id),
      'With {clone: false}, "addNode" keeps the same object.'
    );

    expect(() => {
      myGraph.nodes(graph.nodes[0].id).id = "new_n0";
    }).toThrow();
    expect(graph.nodes[0].id).toEqual(
      myGraph.nodes(graph.nodes[0].id).id,
      "With {immutable: true}, node ids in the graph are not writable."
    );

    const node = myGraph.nodes(graph.nodes[1].id);
    node.id = "new_n0";
    expect("new_n0").toEqual(
      node.id,
      "With {immutable: false}, node ids in the graph are writable."
    );
    node.id = "n1";

    myGraph.nodes(graph.nodes[0].id).label = "New node 0";
    expect("New node 0").toEqual(
      myGraph.nodes(graph.nodes[0].id).label,
      "Other node attributes are writable."
    );
    myGraph.nodes(graph.nodes[0].id).label = "Node 0";

    expect(myGraph.nodes()).not.toBe(
      myGraph.nodes(),
      '"nodes" without arguments returns a copy of the nodes array.'
    );

    expect(myGraph.nodes("unexisting_id")).toEqual(
      undefined,
      '"nodes" with an unreferenced id returns undefined and does not throw an error.'
    );

    expect(myGraph.nodes(["n0", "n1", "n0"])).toEqual(
      [graph.nodes[0], graph.nodes[1], graph.nodes[0]],
      '"nodes" with a strings array as arguments returns the array of specified nodes.'
    );

    expect(() => myGraph.nodes(["n0", "n1", {}])).toThrow(
      /nodes: Wrong arguments/,
      '"nodes" with an array containing a non-string or non-number value throws an error.'
    );

    expect(() => myGraph.addNode(graph.nodes[0])).toThrow(
      /The node "n0" already exists./,
      "Adding an already existing node throws an error."
    );

    myGraph.addNode({ id: "prototype" }).addNode({ id: "constructor" });
    expect(
      myGraph.nodes("prototype") && myGraph.nodes("constructor")
    ).toBeDefined();
    myGraph.dropNode("prototype").dropNode("constructor");

    // EDGES:
    // ******
    expect(graph.edges[0]).toEqual(
      myGraph.edges(graph.edges[0].id),
      '"addEdge" works and the edge properties have been preserved.'
    );

    expect(graph.edges[0]).not.toBe(
      myGraph.edges(graph.edges[0].id),
      'With {clone: true}, "addEdge" creates a new object.'
    );

    expect(graph.edges[1]).toEqual(
      myGraph.edges(graph.edges[1].id),
      'With {clone: false}, "addEdge" keeps the same object.'
    );

    expect(() => {
      myGraph.edges(graph.edges[0].id).id = "new_e0";
    }).toThrow();
    expect(() => {
      myGraph.edges(graph.edges[0].id).source = "undefined_node";
    }).toThrow();
    expect(() => {
      myGraph.edges(graph.edges[0].id).target = "undefined_node";
    }).toThrow();
    expect([
      graph.edges[0].id,
      graph.edges[0].source,
      graph.edges[0].target
    ]).toEqual(
      [
        myGraph.edges(graph.edges[0].id).id,
        myGraph.edges(graph.edges[0].id).source,
        myGraph.edges(graph.edges[0].id).target
      ],
      "With {immutable: true}, edge sources, targets and ids in the graph are not writable."
    );

    const edge = myGraph.edges(graph.edges[1].id);
    edge.id = "new_e0";
    edge.source = "undefined_node";
    edge.target = "undefined_node";
    expect(["new_e0", "undefined_node", "undefined_node"]).toEqual(
      [edge.id, edge.source, edge.target],
      "With {immutable: false}, edge sources, targets and ids in the graph are writable."
    );
    edge.id = "e1";
    edge.source = "n1";
    edge.target = "n2";

    myGraph.edges(graph.edges[0].id).myEdgeAttr = 456;
    expect(456).toEqual(
      myGraph.edges(graph.edges[0].id).myEdgeAttr,
      "Other edge attributes are writable."
    );
    myGraph.edges(graph.edges[0].id).myEdgeAttr = 123;

    expect(myGraph.edges()).not.toBe(
      myGraph.edges(),
      '"edges" without arguments returns a copy of the edge array.'
    );

    expect(myGraph.edges("unexisting_id")).toEqual(
      undefined,
      '"edges" with an unreferenced id returns undefined and does not throw an error.'
    );

    expect(myGraph.edges(["e0", "e0"])).toEqual(
      [graph.edges[0], graph.edges[0]],
      '"edges" with a strings array as arguments returns the array of specified edge.'
    );

    expect(() => myGraph.edges(["e0", {}])).toThrow(
      /edges: Wrong arguments/,
      '"edges" with an array containing a non-string or non-number value throws an error.'
    );

    expect(() => myGraph.addEdge(graph.edges[0])).toThrow(
      /The edge "e0" already exists./,
      "Adding an already existing edge throws an error."
    );

    // DROPING AND CLEARING:
    // *********************
    myGraph.dropNode("n0");
    expect(myGraph.nodes().map(n => n.id)).toEqual(
      ["n1", "n2", "n3"],
      '"dropNode" actually drops the node.'
    );
    expect(myGraph.edges().map(e => e.id)).toEqual(
      ["e1", "e2", "e3", "e4"],
      '"dropNode" also kills the edges linked to the related nodes..'
    );

    expect(() => myGraph.dropNode("n0")).toThrow(
      /The node "n0" does not exist./,
      "Droping an unexisting node throws an error."
    );

    myGraph.dropEdge("e1");
    expect(myGraph.edges().map(e => e.id)).toEqual(
      ["e2", "e3", "e4"],
      '"dropEdge" actually drops the edge.'
    );

    myGraph.dropEdge("e4");
    expect(myGraph.edges().map(e => e.id)).toEqual(
      ["e2", "e3"],
      '"dropEdge" with a self loops works. (#286)'
    );

    expect(() => myGraph.dropEdge("e1")).toThrow(
      /The edge "e1" does not exist./,
      "Droping an unexisting edge throws an error."
    );

    // Reinitialize the graph:
    myGraph.addNode(graph.nodes[0]);
    myGraph.addEdge(graph.edges[0]);
    myGraph.addEdge(graph.edges[1]);

    myGraph.clear();
    expect([myGraph.nodes(), myGraph.edges()]).toEqual(
      [[], []],
      '"clear" empties the nodes and edges arrays.'
    );

    myGraph = new Graph();
    myGraph.read(graph);

    expect(myGraph.nodes()).toEqual(
      graph.nodes,
      '"read" adds properly the nodes.'
    );
    expect(myGraph.edges()).toEqual(
      graph.edges,
      '"read" adds properly the edges.'
    );
  });

  it("Methods and attached functions", () => {
    let counter;
    const colorPalette = { Person: "#C3CBE1", Place: "#9BDEBD" };

    counter = 0;
    Graph.attach("addNode", "counterInc", () => counter++);

    Graph.attachBefore("addNode", "applyNodeColorPalette", n => {
      // eslint-disable-next-line no-param-reassign
      n.color = colorPalette[n.category];
    });

    expect(false).toEqual(
      Graph.hasMethod("getNodeLabel"),
      "sigma.classes.hasMethod returns false if the method does not exist."
    );

    Graph.addMethod("getNodeLabel", function getNodeLabel(nId) {
      return (this.nodesIndex[nId] || {}).label;
    });

    expect(true).toEqual(
      Graph.hasMethod("getNodeLabel"),
      "sigma.classes.hasMethod returns true if the method has been added with addMethod."
    );

    expect(true).toEqual(
      Graph.hasMethod("hasMethod"),
      "sigma.classes.hasMethod returns true if the method is implemented in the core."
    );

    const myGraph = new Graph();
    myGraph.addNode({ id: "n0", label: "My node", category: "Person" });
    expect(1).toEqual(
      counter,
      "Attached functions are effectively executed when the anchor method is called."
    );
    expect(myGraph.nodes("n0").color).toEqual(
      "#C3CBE1",
      'Attached "before" functions are effectively executed before when the anchor method is called.'
    );
    expect(myGraph.getNodeLabel("n0")).toEqual(
      "My node",
      'Custom methods work, can have arguments, and have access to the data in their scope (through "this").'
    );

    function noop() {}

    expect(() => Graph.attach("addNode", "counterInc", noop)).toThrow(
      /A function "counterInc" is already attached to the method "addNode"/,
      "Attaching a function to a method when there is already a function attached to this method under the same key throws an error."
    );

    expect(() => Graph.attach("undefinedMethod", "counterInc", noop)).toThrow(
      /The method "undefinedMethod" does not exist./,
      "Attaching a function to an unexisting method when throws an error."
    );

    expect(() =>
      Graph.attachBefore("addNode", "applyNodeColorPalette", noop)
    ).toThrow(
      /A function "applyNodeColorPalette" is already attached to the method "addNode"/,
      'Attaching a "before" function to a method when there is already a "before" function attached to this method under the same key throws an error.'
    );

    expect(() =>
      Graph.attachBefore("undefinedMethod", "applyNodeColorPalette", noop)
    ).toThrow(
      /The method "undefinedMethod" does not exist./,
      'Attaching a "before" function to an unexisting method when throws an error.'
    );

    expect(() => Graph.addMethod("getNodeLabel", noop)).toThrow(
      /The method "getNodeLabel" already exists./,
      "Attaching a method whose name is already referenced throws an error."
    );
  });

  it("Builtin indexes", () => {
    const graph = {
      nodes: [
        {
          id: "n0",
          label: "Node 0",
          myNodeAttr: 123
        },
        {
          id: "n1",
          label: "Node 1"
        },
        {
          id: "n2",
          label: "Node 2"
        }
      ],
      edges: [
        {
          id: "e0",
          source: "n0",
          target: "n1",
          myEdgeAttr: 123
        },
        {
          id: "e1",
          source: "n1",
          target: "n2"
        }
      ]
    };

    Graph.addMethod("retrieveIndexes", function getIndexes() {
      return {
        inIndex: this.inNeighborsIndex,
        outIndex: this.outNeighborsIndex,
        allIndex: this.allNeighborsIndex,
        inCount: this.inNeighborsCount,
        outCount: this.outNeighborsCount,
        allCount: this.allNeighborsCount
      };
    });

    const g = new Graph();
    g.read(graph);

    const index = g.retrieveIndexes();

    expect(index.inIndex).toEqual(
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
      "Incoming index up to date"
    );

    expect(index.inCount).toEqual(
      {
        n0: 0,
        n1: 1,
        n2: 1
      },
      "Incoming count up to date"
    );

    expect(index.outIndex).toEqual(
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
      "Outcoming index up to date"
    );

    expect(index.outCount).toEqual(
      {
        n0: 1,
        n1: 1,
        n2: 0
      },
      "Outcoming count up to date"
    );

    expect(index.allIndex).toEqual(
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
      "Full index up to date"
    );

    expect(index.allCount).toEqual(
      {
        n0: 1,
        n1: 2,
        n2: 1
      },
      "Full count up to date"
    );

    g.dropNode("n2");

    expect(index.inIndex).toEqual(
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
      "Incoming index up to date after having dropped a node"
    );

    expect(index.inCount).toEqual(
      {
        n0: 0,
        n1: 1
      },
      "Incoming count up to date after having dropped a node"
    );

    expect(index.outIndex).toEqual(
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
      "Outcoming index up to date after having dropped a node"
    );

    expect(index.outCount).toEqual(
      {
        n0: 1,
        n1: 0
      },
      "Outcoming count up to date after having dropped a node"
    );

    expect(index.allIndex).toEqual(
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
      "Full index up to date after having dropped a node"
    );

    expect(index.allCount).toEqual(
      {
        n0: 1,
        n1: 1
      },
      "Full count up to date after having dropped a node"
    );

    g.dropEdge("e0");

    expect(index.inIndex).toEqual(
      {
        n0: {},
        n1: {}
      },
      "Incoming index up to date after having dropped an edge"
    );

    expect(index.inCount).toEqual(
      {
        n0: 0,
        n1: 0
      },
      "Incoming count up to date after having dropped an edge"
    );

    expect(index.outIndex).toEqual(
      {
        n0: {},
        n1: {}
      },
      "Outcoming index up to date after having dropped an edge"
    );

    expect(index.outCount).toEqual(
      {
        n0: 0,
        n1: 0
      },
      "Outcoming count up to date after having dropped an edge"
    );

    expect(index.allIndex).toEqual(
      {
        n0: {},
        n1: {}
      },
      "Full index up to date after having dropped an edge"
    );

    expect(index.allCount).toEqual(
      {
        n0: 0,
        n1: 0
      },
      "Full count up to date after having dropped an edge"
    );
  });

  it("Custom indexes", () => {
    Graph.addIndex("nodesCount", {
      constructor() {
        this.nodesCount = 0;
      },
      addNode() {
        this.nodesCount++;
      },
      dropNode() {
        this.nodesCount--;
      },
      clear() {
        this.nodesCount = 0;
      }
    });

    Graph.addMethod("getNodesCount", function getNodeCount() {
      return this.nodesCount;
    });

    const myGraph = new Graph();
    myGraph
      .addNode({ id: "n0" })
      .addNode({ id: "n1" })
      .dropNode("n0");
    expect(1).toEqual(
      myGraph.getNodesCount(),
      "Indexes work, and the scope is effectively shared with custom methods."
    );
  });
});
