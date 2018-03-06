import {UndirectedGraph} from 'graphology';
import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

const container = document.getElementById('container');

const graph = new UndirectedGraph();

graph.addNode('Jessica', {
  label: 'Jessica',
  x: 1,
  y: 1,
  color: '#FF0',
  size: 10
});

graph.addNode('Truman', {
  label: 'Truman',
  x: 0,
  y: 0,
  color: '#00F',
  size: 5
});

graph.addEdge('Jessica', 'Truman', {
  color: '#CCC',
  size: 50
});

const renderer = new WebGLRenderer(container);

const sigma = new Sigma(graph, renderer);

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
