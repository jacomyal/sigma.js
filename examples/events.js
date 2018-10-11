import {UndirectedGraph} from 'graphology';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import randomLayout from 'graphology-layout/random';
import chroma from 'chroma-js';
import faker from 'faker';
import WebGLRenderer from '../src/renderers/webgl';

const container = document.getElementById('container');

const graph = erdosRenyi.sparse(UndirectedGraph, {order: 500, probability: 0.05});
randomLayout.assign(graph);

graph.nodes().forEach(node => {

  graph.mergeNodeAttributes(node, {
    label: faker.name.findName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
    zIndex: 0
  });
});

graph.edges().forEach(edge => graph.mergeEdgeAttributes(edge, {
  color: '#ccc',
  zIndex: 0
}));

let highlighedNodes = new Set();
let highlighedEdges = new Set();

const nodeReducer = (node, data) => {
  if (highlighedNodes.has(node))
    return {...data, color: '#f00', zIndex: 1};

  return data;
};

const edgeReducer = (edge, data) => {
  if (highlighedEdges.has(edge))
    return {...data, color: '#f00', zIndex: 1};

  return data;
};

const renderer = new WebGLRenderer(graph, container, {
  nodeReducer,
  edgeReducer,
  zIndex: true
});

renderer.on('clickNode', ({node}) => {
  console.log('Clicking:', node);
});

renderer.on('clickStage', () => {
  console.log('Clicking the stage.');
});

renderer.on('enterNode', ({node}) => {
  console.log('Entering: ', node);
  highlighedNodes = new Set(graph.neighbors(node));
  highlighedNodes.add(node);

  highlighedEdges = new Set(graph.edges(node));

  renderer.refresh();
});

renderer.on('leaveNode', ({node}) => {
  console.log('Leaving:', node);

  highlighedNodes.clear();
  highlighedEdges.clear();

  renderer.refresh();
});

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.getCamera();
