import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';
import WebGLRenderer from '../src/renderers/webgl';

import arctic from './resources/arctic.gexf';

const container = document.getElementById('container');

const graph = gexf.parse(Graph, arctic);

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const renderer = new WebGLRenderer(graph, container);

const camera = renderer.getCamera();

const captor = renderer.getMouseCaptor();

// State
let draggedNode = null,
    dragging = false;

renderer.on('downNode', e => {
  dragging = true;
  draggedNode = e.node;
  camera.disable();
});

captor.on('mouseup', e => {
  dragging = false;
  draggedNode = null;
  camera.enable();
});

captor.on('mousemove', e => {

  if (!dragging)
    return;

  // Get new position of node
  const pos = renderer.normalizationFunction.inverse(
    camera.viewportToGraph(renderer, e.x, e.y)
  );

  graph.setNodeAttribute(draggedNode, 'x', pos.x);
  graph.setNodeAttribute(draggedNode, 'y', pos.y);
});

window.renderer = renderer;
window.camera = renderer.getCamera();
