module('sigma.classes.camera');

test('Basic manipulation', function() {
  var graph = new sigma.classes.graph(),
      camera = new sigma.classes.camera('myCam', graph, sigma.classes.configurable(sigma.settings));

  deepEqual(
    [camera.x, camera.y, camera.ratio, camera.angle],
    [0, 0, 1, 0],
    'Initial values for [x, y, angle, ratio] are [0, 0, 1, 0].'
  );

  camera.goTo({
    x: 1,
    y: 2,
    ratio: 3,
    angle: 4
  });
  deepEqual(
    [camera.x, camera.y, camera.ratio, camera.angle],
    [1, 2, 3, 4],
    '"goTo" with every parameters effectively updates them all.'
  );

  camera.goTo({
    x: 5
  });
  deepEqual(
    [camera.x, camera.y, camera.ratio, camera.angle],
    [5, 2, 3, 4],
    '"goTo" with only some parameters effectively updates only them.'
  );

  throws(
    function() {
      camera.goTo({
        x: 'abc'
      });
    },
    /Value for "x" is not a number./,
    '"goTo" with a non-number value throws an error.'
  );

  throws(
    function() {
      camera.goTo({
        x: NaN
      });
    },
    /Value for "x" is not a number./,
    '"goTo" with NaN as a value throws an error.'
  );
});

test('Apply to a graph', function() {
  function approx(v) {
    return Math.round(v * 10000) / 10000;
  }

  var graph = new sigma.classes.graph(),
      camera = new sigma.classes.camera('myCam', graph, sigma.classes.configurable(sigma.settings));

  // Fill the graph:
  graph.addNode({
    id: '0',
    x: 1,
    y: 2,
    size: 1
  }).addNode({
    id: '1',
    x: 2,
    y: 1,
    size: 1
  }).addNode({
    id: '2',
    x: 1,
    y: 0,
    size: 1
  });

  graph.addEdge({
    id: '0',
    source: '0',
    target: '1',
    size: 1
  });

  camera.applyView('', 'display:');
  deepEqual(
    graph.nodes().map(function(n) {
      return {
        x: n['display:x'],
        y: n['display:y'],
        size: n['display:size']
      };
    }),
    graph.nodes().map(function(n) {
      return {
        x: n.x,
        y: n.y,
        size: n.size
      };
    }),
    'Applying the camera\'s view to the graph does nothing when the camera is at the origin and the angle is 0'
  );

  camera.goTo({
    x: 2,
    y: 1,
    ratio: 2,
    angle: Math.PI / 2
  });
  camera.applyView('', 'display:');
  deepEqual(
    graph.nodes().map(function(n) {
      return {
        x: approx(n['display:x']),
        y: approx(n['display:y']),
        size: approx(n['display:size'])
      };
    }),
    [
      {
        x: 0.5,
        y: 0.5,
        size: approx(Math.pow(0.5, camera.settings('nodesPowRatio')))
      },
      {
        x: 0,
        y: 0,
        size: approx(Math.pow(0.5, camera.settings('nodesPowRatio')))
      },
      {
        x: -0.5,
        y: 0.5,
        size: approx(Math.pow(0.5, camera.settings('nodesPowRatio')))
      }
    ],
    'Applying the camera\'s view to the graph works after having moved the camera.'
  );
});

test('Position', function() {
  function approx(v) {
    return Math.round(v * 10000) / 10000;
  }

  var pos,
      camera = new sigma.classes.camera('myCam', undefined, sigma.classes.configurable(sigma.settings));

  camera.goTo({
    x: 2,
    y: 1,
    ratio: 2,
    angle: Math.PI / 2
  });
  pos = camera.graphPosition(1, 2);
  deepEqual(
    { x: approx(pos.x), y: approx(pos.y) },
    { x: 0.5, y: 0.5 },
    'graphPosition works (test 1).'
  );

  camera.goTo({
    x: 0,
    y: 2,
    ratio: 0.5,
    angle: -Math.PI / 2
  });
  pos = camera.graphPosition(1, 2);
  deepEqual(
    { x: approx(pos.x), y: approx(pos.y) },
    { x: 0, y: 2 },
    'graphPosition works (test 2).'
  );

  camera.goTo({
    x: 2,
    y: 1,
    ratio: 2,
    angle: Math.PI / 2
  });
  pos = camera.cameraPosition(0.5, 0.5);
  deepEqual(
    { x: approx(pos.x), y: approx(pos.y) },
    { x: 1, y: 2 },
    'cameraPosition works (test 1).'
  );

  camera.goTo({
    x: 0,
    y: 2,
    ratio: 0.5,
    angle: -Math.PI / 2
  });
  pos = camera.cameraPosition(0, 2);
  deepEqual(
    { x: approx(pos.x), y: approx(pos.y) },
    { x: 1, y: 2 },
    'cameraPosition works (test 2).'
  );
});
