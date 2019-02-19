QUnit.module("sigma.statistics.HITS");

// These tests are based on testing plan
// https://docs.google.com/file/d/0BznZHkruvUX6WkFBSmdEMWFReU0/edit
// read plugin documentation for more info
// read also for more context: https://github.com/jacomyal/sigma.js/issues/309#issuecomment-47554156

QUnit.test("Stats computation", assert => {
  const opts = {};
  const settings = new sigma.classes.configurable(opts);

  const graph1 = {
    nodes: [{ id: "n1" }],
    edges: []
  };

  const graph2 = {
    nodes: [{ id: "n1" }, { id: "n2" }],
    edges: [{ id: "e1", source: "n1", target: "n2" }]
  };

  const graph3 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" }
    ],
    edges: []
  };

  const graph4 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" }
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n1", target: "n3" },
      { id: "e3", source: "n1", target: "n4" },
      { id: "e4", source: "n1", target: "n5" },
      { id: "e5", source: "n2", target: "n3" },
      { id: "e6", source: "n2", target: "n4" },
      { id: "e7", source: "n2", target: "n5" },
      { id: "e8", source: "n3", target: "n4" },
      { id: "e9", source: "n3", target: "n5" },
      { id: "e10", source: "n4", target: "n5" }
    ]
  };

  const graph5 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" },
      { id: "n6" }
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n1", target: "n3" },
      { id: "e3", source: "n1", target: "n4" },
      { id: "e4", source: "n1", target: "n5" },
      { id: "e5", source: "n1", target: "n6" }
    ]
  };

  const graph6 = {
    nodes: [{ id: "n1" }, { id: "n2" }, { id: "n3" }],
    edges: [
      { id: "e1", source: "n1", target: "n1" },
      { id: "e2", source: "n1", target: "n2" },
      { id: "e3", source: "n2", target: "n3" },
      { id: "e4", source: "n3", target: "n3" }
    ]
  };

  const graph7 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" }
    ],
    edges: [
      { id: "e1", source: "n1", target: "n4" },
      { id: "e2", source: "n1", target: "n5" },
      { id: "e3", source: "n2", target: "n4" },
      { id: "e4", source: "n2", target: "n5" },
      { id: "e5", source: "n3", target: "n4" },
      { id: "e6", source: "n3", target: "n5" }
    ]
  };

  const graph8 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" },
      { id: "n6" }
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n1", target: "n3" },
      { id: "e3", source: "n1", target: "n4" },
      { id: "e4", source: "n1", target: "n5" },
      { id: "e5", source: "n1", target: "n6" }
    ]
  };

  const graph9 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" },
      { id: "n6" }
    ],
    edges: [
      { id: "e1", source: "n2", target: "n1" },
      { id: "e2", source: "n3", target: "n1" },
      { id: "e3", source: "n4", target: "n1" },
      { id: "e4", source: "n5", target: "n1" },
      { id: "e5", source: "n3", target: "n6" },
      { id: "e6", source: "n4", target: "n6" },
      { id: "e7", source: "n5", target: "n6" }
    ]
  };

  const graph10 = {
    nodes: [
      { id: "n1" },
      { id: "n2" },
      { id: "n3" },
      { id: "n4" },
      { id: "n5" },
      { id: "n6" }
    ],
    edges: [
      { id: "e1", source: "n1", target: "n5" },
      { id: "e2", source: "n2", target: "n5" },
      { id: "e3", source: "n3", target: "n5" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6" }
    ]
  };

  // Initialize the graph:
  const myGraph = new sigma.classes.graph(settings);

  // HITS:
  // ******

  myGraph.read(graph1);

  let stats = myGraph.HITS(true);

  assert.ok(stats.n1.authority === 1, "test 1.1");
  assert.ok(stats.n1.hub === 1, "test 1.2");

  myGraph.clear();
  myGraph.read(graph2);

  stats = myGraph.HITS(true);

  assert.equal(stats.n1.authority, 0.5, "test 2");

  myGraph.clear();
  myGraph.read(graph3);

  stats = myGraph.HITS(true);

  assert.ok(stats.n2.hub === 0.2, "test 3.1");
  assert.ok(stats.n3.authority === 0.2, "test 3.2");

  myGraph.clear();
  myGraph.read(graph4);

  stats = myGraph.HITS(true);

  assert.equal(stats.n1.hub, 0.19999999999999998, "test 4.1");
  assert.equal(stats.n5.authority, 0.19999999999999998, "test 4.2");

  myGraph.clear();
  myGraph.read(graph5);

  stats = myGraph.HITS(true);

  assert.ok(stats.n1.hub > stats.n3.hub, "test 5.1");

  assert.ok(stats.n1.authority > stats.n4.authority, "test 5.2");

  myGraph.clear();
  myGraph.read(graph6);

  stats = myGraph.HITS(true);

  assert.ok(stats.n2.hub > stats.n1.hub, "test 6");

  myGraph.clear();
  myGraph.read(graph7);

  stats = myGraph.HITS();

  assert.equal(stats.n1.hub, 0.3333333333333333, "test 7.1");
  assert.equal(stats.n4.hub, 0, "test 7.2");
  assert.equal(stats.n2.authority, 0, "test 7.3");
  assert.equal(stats.n5.authority, 0.5, "test 7.4");

  myGraph.clear();
  myGraph.read(graph8);

  stats = myGraph.HITS();

  assert.equal(stats.n1.hub, 1, "test 8.1");
  assert.equal(stats.n1.authority, 0, "test 8.2");
  assert.equal(stats.n3.hub, 0, "test 8.3");
  assert.equal(stats.n3.authority, 0.2, "test 8.4");

  myGraph.clear();
  myGraph.read(graph9);

  stats = myGraph.HITS();

  assert.equal(stats.n3.hub, stats.n5.hub, "test 9.1");
  assert.ok(stats.n3.hub > stats.n2.hub, "test 9.2");
  assert.ok(stats.n1.authority > stats.n6.authority, "test 9.3");
  assert.equal(stats.n6.hub, 0, "test 9.4");
  assert.equal(stats.n3.authority, 0, "test 9.5");

  myGraph.clear();
  myGraph.read(graph10);

  stats = myGraph.HITS();

  assert.equal(stats.n1.hub, stats.n3.hub, "test 10.1");
  assert.ok(stats.n1.hub > stats.n5.hub, "test 10.2");
  assert.ok(stats.n5.authority > stats.n6.authority, "test 10.3");
});
