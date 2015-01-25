module('sigma.plugins.designer');

test('API', function(assert) {
  var a,
      k,
      s = new sigma(),
      designer;

  var graph = {
    nodes: [
      {
        id: 'n0',
        label: 'Node 0',
        color: '#333',
        size: 1,
        data: {quantity: 5, quality: 'A'}
      },
      {
        id: 'n1',
        label: 'Node 1',
        data: {quantity: 3, quality: 'B'}
      },
      {
        id: 'n2',
        label: 'Node 2',
        data: {quantity: -10, quality: 'C'}
      },
      {
        id: 'n3',
        label: 'Node 3',
        data: {}
      },
      {
        id: 'n4',
        label: 'Node 4',
        data: {quantity: 1, quality: 'A'}
      }
    ],
    edges: [
      {
        id: 'e0',
        source: 'n0',
        target: 'n1',
        quantity: 0
      },
      {
        id: 'e1',
        source: 'n1',
        target: 'n2',
        quantity: 1
      },
      {
        id: 'e2',
        source: 'n1',
        target: 'n3',
        quantity: 2
      },
      {
        id: 'e3',
        source: 'n2',
        target: 'n3',
        quantity: -1
      },
      {
        id: 'e4',
        source: 'n0',
        target: 'n0'
      }
    ]
  },
  // Create a custom color palette:
  myPalette = {
    aQualitativeScheme: {
      'A': '#7fc97f',
      'B': '#beaed4',
      'C': '#fdc086'
    },
    colorbrewer: {
      sequentialGreen: {
        3: ["#e5f5f9","#99d8c9","#2ca25f"],
        4: ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
        5: ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],
        6: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
        7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
        8: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
        9: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]
      }
    }
  },
  myStyles = {
    nodes: {
      label: {
        by: 'id',
        format: function(value) { return '#' + value; }
      },
      size: {
        by: 'data.quantity',
        bins: 7,
        min: 2,
        max: 20
      },
      color: {
        by: 'data.quality',
        scheme: 'aQualitativeScheme',
      },
    },
    edges: {
      color: {
        by: 'quantity',
        scheme: 'colorbrewer.sequentialGreen',
        bins: 7
      },
      size: {
        by: 'quantity',
        bins: 7,
        min: 1,
        max: 5
      },
    }
  };

  // Initialize the designer:
  designer = new sigma.plugins.designer(s, {
    styles: myStyles,
    palette: myPalette
  });

  s.graph.read(graph);

  designer.apply('nodes');
  designer.apply('edges');

  designer.apply();

  designer.deprecate();


  // check apply node color

  designer.apply('nodes', 'color');

  ok(
    designer.styles.nodes.color.active,
    'nodes color is active after "apply(\'nodes\', \'color\')"'
  );

  strictEqual(
    s.graph.nodes('n0').color,
    '#7fc97f',
    '"apply(\'nodes\', \'color\')" applies node color'
  );

  strictEqual(
    s.graph.nodes('n1').color,
    '#beaed4',
    '"apply(\'nodes\', \'color\')" applies node color'
  );

  strictEqual(
    s.graph.nodes('n2').color,
    '#fdc086',
    '"apply(\'nodes\', \'color\')" applies node color'
  );

  strictEqual(
    s.graph.nodes('n3').color,
    undefined,
    '"apply(\'nodes\', \'color\')" applies node color'
  );

  strictEqual(
    s.graph.nodes('n4').color,
    '#7fc97f',
    '"apply(\'nodes\', \'color\')" applies node color'
  );


  // check apply node size

  designer.apply('nodes', 'size');

  ok(
    designer.styles.nodes.size.active,
    'nodes size is active after "apply(\'nodes\', \'size\')"'
  );

  strictEqual(
    s.graph.nodes('n0').size,
    7,
    '"apply(\'nodes\', \'size\')" applies node size'
  );

  strictEqual(
    s.graph.nodes('n1').size,
    7,
    '"apply(\'nodes\', \'size\')" applies node size'
  );

  strictEqual(
    s.graph.nodes('n2').size,
    1,
    '"apply(\'nodes\', \'size\')" applies node size'
  );

  strictEqual(
    s.graph.nodes('n3').size,
    undefined,
    '"apply(\'nodes\', \'size\')" does not apply node size if the property is missing on the node'
  );


  // check undo node color
  // see https://github.com/jacomyal/sigma.js/issues/500

  // designer.undo('nodes', 'color');

  // strictEqual(
  //   s.graph.nodes('n0').color,
  //   '#333',
  //   '"undo(\'nodes\', \'color\')" reset node color'
  // );

  // strictEqual(
  //   s.graph.nodes('n1').color,
  //   undefined,
  //   '"undo(\'nodes\', \'color\')" reset node color'
  // );


  // check undo node size

  designer.undo('nodes', 'size');

  ok(
    !designer.styles.nodes.size.active,
    'nodes size is not active after "undo(\'nodes\', \'size\')"'
  );

  strictEqual(
    s.graph.nodes('n0').size,
    1,
    '"undo(\'nodes\', \'size\')" reset node size'
  );

  strictEqual(
    s.graph.nodes('n1').size,
    undefined,
    '"undo(\'nodes\', \'size\')" reset node size'
  );


  designer.apply('edges', 'color');

  ok(
    designer.styles.edges.color.active,
    'edges color is active after "apply(\'edges\', \'color\')"'
  );

  designer.apply('edges', 'size');

  ok(
    designer.styles.edges.size.active,
    'edges size is active after "apply(\'edges\', \'size\')"'
  );

  designer.undo('edges', 'color');

  ok(
    !designer.styles.edges.color.active,
    'edges color is not active after "undo(\'edges\', \'color\')"'
  );

  designer.undo('edges', 'size');

  ok(
    !designer.styles.edges.size.active,
    'edges size is not active after "undo(\'edges\', \'size\')"'
  );

  designer.apply();

  ok(
    designer.styles.nodes.color.active,
    'nodes color is active after "apply()"'
  );


  // check histogram function

  equal(
    designer.utils.histogram('edges', 'color', 'quantity').length,
    7,
    '"designer.utils.histogram" returns an array of specified length'
  );


  throws(
    function() {
      designer.utils.histogram('edges', 'color', 'meh');
    },
    /Designer.utils.histogram: Missing property \"meh\"/,
    '"utils.histogram" throws an error on a non-existing property.'
  );

  throws(
    function() {
      designer.utils.histogram('edges', 'meh', 'quantity');
    },
    /Designer.utils.histogram: Unknown visual variable./,
    '"utils.histogram" throws an error on an unknown visual variable.'
  );

  throws(
    function() {
      designer.utils.histogram('meh', 'color', 'quantity');
    },
    /Designer.utils.histogram: Unknown target \"meh\"/,
    '"utils.histogram" throws an error on an unknown target.'
  );


  // check isSequential function

  ok(
    designer.utils.isSequential('nodes', 'data.quantity'),
    '"utils.isSequential" returns true on a quantitative property'
  );

  ok(
    !designer.utils.isSequential('nodes', 'data.quality'),
    '"utils.isSequential" returns false on a qualitative property'
  );

  strictEqual(
    designer.utils.isSequential('nodes', 'data.notset'),
    undefined,
    '"utils.isSequential" returns undefined on a property which does not exist'
  );

  designer.undo();

  designer.clear();


  // check plugin lifecycle
  designer.kill();
  s.kill();
  s = new sigma();
  designer = new sigma.plugins.designer(s);
  s.graph.read(graph);
  designer.apply();

  sigma.plugins.killDesigner(s);
  deepEqual(
    designer.styles,
    undefined,
    'The styles object is undefined after `killDesigner` is called.'
  );

  designer.apply();  // does nothing
  designer.undo();  // does nothing

});
