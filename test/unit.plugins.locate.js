module('sigma.plugins.locate');

asyncTest('API', function(assert) {
  // The number of assertions expected to run within the test:
  expect(9);
  start();

  var dom = document.createElement('DIV');

  // Add a temporary container:
  dom.id = 'graph-container';
  document.body.appendChild(dom);

  var s = new sigma({
    container: 'graph-container'
  });

  // Fill the graph:
  s.graph.addNode({
    id: 'n0',
    x: 1,
    y: 2,
    size: 1
  }).addNode({
    id: 'n1',
    x: 2,
    y: 1,
    size: 1
  }).addNode({
    id: 'n2',
    x: 1,
    y: 0,
    size: 1
  });

  s.graph.addEdge({
    id: 'e0',
    source: 'n0',
    target: 'n1',
    size: 1
  }).addEdge({
    id: 'e1',
    source: 'n1',
    target: 'n2',
    size: 1
  });

  s.camera.applyView('', s.camera.readPrefix);

  var locate = sigma.plugins.locate(s, {
    animation: {
      node: {
        duration: 0
      },
      edge: {
        duration: 0
      },
      center: {
        duration: 0
      }
    }
  });

  deepEqual(
    [s.camera.x, s.camera.y, s.camera.ratio],
    [0, 0, 1],
    'The camera is initialized with default settings.'
  );

  stop();
  locate.nodes('n0', {
    onComplete: function() {
      start();
      deepEqual(
        [s.camera.x, s.camera.y],
        [1, 2],
        '"nodes" with a node updates the camera position.'
      );
    }
  });

  stop();
  locate.nodes(['n0', 'n1'], {
    onComplete: function() {
      start();
      deepEqual(
        [s.camera.x, s.camera.y],
        [1.5, 1.5],
        '"nodes" with multiple node updates the camera position.'
      );
    }
  });

  stop();
  locate.edges('e0', {
    onComplete: function() {
      start();
      deepEqual(
        [s.camera.x, s.camera.y],
        [1.5, 1.5],
        '"edges" with an edge updates the camera position.'
      );
    }
  });

  stop();
  locate.edges(['e0', 'e1'], {
    onComplete: function() {
      start();
      deepEqual(
        [s.camera.x, s.camera.y],
        [1.5, 1],
        '"edges" with multiple edges updates the camera position.'
      );
    }
  });

  stop();
  locate.center(1, {
    onComplete: function() {
      start();
      deepEqual(
        [s.camera.x, s.camera.y],
        [1.5, 1],
        '"center" updates the camera position to the equidistant position from all nodes.'
      );
    }
  });

  s.graph.clear();


  stop();
  locate.center(1, {
    onComplete: function() {
      start();
      deepEqual(
        [s.camera.x, s.camera.y],
        [0, 0],
        '"center" updates the camera position to 0,0 if the graph is empty.'
      );
    }
  });


  throws(
    function() {
      locate.nodes('0');
    },
    new Error('Invalid argument: the node of id "0" does not exist.'),
    '"nodes" with a wrong key type throws an error.'
  );

  throws(
    function() {
      locate.edges('0');
    },
    new Error('Invalid argument: the edge of id "0" does not exist.'),
    '"edges" with a wrong key type throws an error.'
  );


 // sigma.plugins.killLocate();

  // Restore previous state:
  document.body.removeChild(dom);
});
