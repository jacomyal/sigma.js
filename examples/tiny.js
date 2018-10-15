import {UndirectedGraph} from 'graphology';
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
  size: 1
});

const renderer = new WebGLRenderer(graph, container);

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
