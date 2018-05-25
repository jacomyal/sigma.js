import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';
import WebGLRenderer from '../src/renderers/webgl';

import arctic from './resources/arctic.gexf';

const graph = gexf.parse(Graph, arctic);

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const container = document.getElementById('container');

const renderer = new WebGLRenderer(graph, container);

window.renderer = renderer;
window.camera = renderer.getCamera();
