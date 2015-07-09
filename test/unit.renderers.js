module('sigma.renderers');

test('Renderers Smoke Test', function() {
  var container = document.getElementById('graph-container');

  var renderers = ['svg','canvas'];

  // Check if WebGL is enabled:
  var canvas, webgl = !!window.WebGLRenderingContext;
  if (webgl) {
    canvas = document.createElement('canvas');
    try {
      webgl = !!(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      webgl = false;
    }
  }
  if(webgl){
    renderers.push('webgl');
  }

  renderers.forEach(function(renderer){
    var i,
        N = 100,
        E = 500,
        s = new sigma(),
        cam = s.addCamera();

    // Generate a random graph:
    for (i = 0; i < N; i++)
      s.graph.addNode({
        id: 'n' + i,
        label: 'Node ' + i,
        x: Math.random(),
        y: Math.random(),
        size: 4 + (3 * Math.random()) | 0
      });

    for (i = 0; i < E; i++)
      s.graph.addEdge({
        id: 'e' + i,
        source: 'n' + (Math.random() * N | 0),
        target: 'n' + (Math.random() * N | 0),
        size: 1 + Math.random()
      });


    s.addRenderer({
      container: document.getElementById('graph-container'),
      type: renderer,
      camera: cam,
      settings: {
        defaultLabelColor: '#000',
        defaultNodeColor: '#666',
        defaultEdgeColor: '#999',
        edgeColor: 'default'
      }
    });

    s.refresh();

    ok(true, renderer+" renderer working");

    container.innerHTML = "";
  })
});
