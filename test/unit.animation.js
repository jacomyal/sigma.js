module('sigma.misc.animation');

asyncTest('Camera animation', function() {
  function approx(v) {
    return Math.round(v * 10000) / 10000;
  }

  var hasTestedFrame,
      graph = new sigma.classes.graph(),
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

  sigma.misc.animation.camera(camera, {
    x: 2,
    y: 1,
    ratio: 2,
    angle: Math.PI / 2
  }, {
    duration: 50,
    easing: function(k) {
      return (k === 1) ? k : 0.5;
    },
    onNewFrame: function() {
      camera.applyView('', 'display:');

      if (!hasTestedFrame) {
        start();
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
              size: approx(Math.pow(2 / 3, camera.settings('nodesPowRatio'))),
              x: approx(Math.SQRT1_2),
              y: approx(Math.SQRT1_2)
            },
            {
              size: approx(Math.pow(2 / 3, camera.settings('nodesPowRatio'))),
              x: approx(Math.SQRT1_2),
              y: -approx(Math.SQRT1_2) / 3
            },
            {
              size: approx(Math.pow(2 / 3, camera.settings('nodesPowRatio'))),
              x: -approx(Math.SQRT1_2) / 3,
              y: -approx(Math.SQRT1_2) / 3
            }
          ],
          'Animation\'s middle gives the good values.'
        );
        stop();
        hasTestedFrame = true;
      }
    },
    onComplete: function() {
      camera.applyView('', 'display:');
      start();
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
        'Animation\'s end gives the good values and custom easings work well.'
      );
    }
  });
});
