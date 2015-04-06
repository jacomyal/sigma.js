module('sigma.plugins.design');

test('API', function(assert) {
  var a,
      k,
      s = new sigma(),
      design;

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

  // Initialize the design:
  design = sigma.plugins.design(s, {
    styles: myStyles,
    palette: myPalette
  });

  s.graph.read(graph);

  design.apply('nodes');
  design.apply('edges');

  design.apply();

  design.deprecate();


  // check apply node color

  design.apply('nodes', 'color');

  ok(
    design.styles.nodes.color.active,
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

  design.apply('nodes', 'size');

  ok(
    design.styles.nodes.size.active,
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


  // check reset node color
  // see https://github.com/jacomyal/sigma.js/issues/500

  // design.reset('nodes', 'color');

  // strictEqual(
  //   s.graph.nodes('n0').color,
  //   '#333',
  //   '"reset(\'nodes\', \'color\')" reset node color'
  // );

  // strictEqual(
  //   s.graph.nodes('n1').color,
  //   undefined,
  //   '"reset(\'nodes\', \'color\')" reset node color'
  // );


  // check reset node size

  design.reset('nodes', 'size');

  ok(
    !design.styles.nodes.size.active,
    'nodes size is not active after "reset(\'nodes\', \'size\')"'
  );

  strictEqual(
    s.graph.nodes('n0').size,
    1,
    '"reset(\'nodes\', \'size\')" reset node size'
  );

  strictEqual(
    s.graph.nodes('n1').size,
    undefined,
    '"reset(\'nodes\', \'size\')" reset node size'
  );


  design.apply('edges', 'color');

  ok(
    design.styles.edges.color.active,
    'edges color is active after "apply(\'edges\', \'color\')"'
  );

  design.apply('edges', 'size');

  ok(
    design.styles.edges.size.active,
    'edges size is active after "apply(\'edges\', \'size\')"'
  );

  design.reset('edges', 'color');

  ok(
    !design.styles.edges.color.active,
    'edges color is not active after "reset(\'edges\', \'color\')"'
  );

  design.reset('edges', 'size');

  ok(
    !design.styles.edges.size.active,
    'edges size is not active after "reset(\'edges\', \'size\')"'
  );

  design.apply();

  ok(
    design.styles.nodes.color.active,
    'nodes color is active after "apply()"'
  );


  // check histogram function

  equal(
    design.utils.histogram('edges', 'color', 'quantity').length,
    7,
    '"design.utils.histogram" returns an array of specified length'
  );


  throws(
    function() {
      design.utils.histogram('edges', 'color', 'meh');
    },
    new Error('The property "meh" is not sequential.'),
    '"utils.histogram" throws an error on a non-existing property.'
  );

  throws(
    function() {
      design.utils.histogram('edges', 'meh', 'quantity');
    },
    new Error('Unknown visual variable "meh".'),
    '"utils.histogram" throws an error on an unknown visual variable.'
  );

  throws(
    function() {
      design.utils.histogram('meh', 'color', 'quantity');
    },
    new Error('Invalid argument: "target" is not "nodes" or "edges", was meh'),
    '"utils.histogram" throws an error on an unknown target.'
  );


  // check isSequential function

  ok(
    design.utils.isSequential('nodes', 'data.quantity'),
    '"utils.isSequential" returns true on a quantitative property'
  );

  ok(
    !design.utils.isSequential('nodes', 'data.quality'),
    '"utils.isSequential" returns false on a qualitative property'
  );

  strictEqual(
    design.utils.isSequential('nodes', 'data.missing'),
    undefined,
    '"utils.isSequential" returns undefined on a property which does not exist'
  );

  design.reset();

  design.clear();


  // check plugin lifecycle
  design.kill();
  s.kill();
  s = new sigma();
  design = sigma.plugins.design(s);
  s.graph.read(graph);

  design
    .nodesBy('label', myStyles.nodes.label)
    .nodesBy('size', myStyles.nodes.size)
    .setPalette(myPalette)
    .nodesBy('color', myStyles.nodes.color)
    .edgesBy('size', myStyles.edges.size)
    .edgesBy('color', myStyles.edges.color)
    .apply();

  sigma.plugins.killDesign(s);
  deepEqual(
    design.styles,
    undefined,
    'The styles object is undefined after `killDesign` is called.'
  );

  design.apply();  // does nothing
  design.reset();  // does nothing

});
