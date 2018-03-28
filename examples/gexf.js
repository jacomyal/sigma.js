import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';
import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

import arctic from './resources/arctic.gexf';

const graph = gexf.parse(Graph, arctic);

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const container = document.getElementById('container');

const renderer = new WebGLRenderer(container);

const sigma = new Sigma(graph, renderer);

window.renderer = renderer;
window.camera = renderer.getCamera();
