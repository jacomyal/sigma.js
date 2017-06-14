import {UndirectedGraph} from 'graphology';
import clusters from 'graphology-generators/random/clusters';
import randomLayout from 'graphology-layout/random';
import fa2 from 'graphology-layout-forceatlas2';
import faker from 'faker';
import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

const PALETTE = [
  '#b4943e',
  '#777acd',
  '#60a862',
  '#c45ca2',
  '#cb5a4c'
];

const container = document.getElementById('container');

console.profile('Creation');
const graph = clusters(UndirectedGraph, {
  order: 1000,
  size: 5000,
  clusters: 5
});
console.profileEnd('Creation');

randomLayout.assign(graph, {scale: 400, center: 0});

graph.nodes().forEach(node => {
  const attr = graph.getNodeAttributes(node);

  graph.mergeNodeAttributes(node, {
    label: faker.name.findName(),
    size: Math.max(4, Math.random() * 10),
    color: PALETTE[attr.cluster]
  });
});

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const renderer = new WebGLRenderer(container);

const sigma = new Sigma(graph, renderer);

function iterate() {
  fa2.assign(graph, {iterations: 1, settings: {barnesHutOptimize: true}});
  requestAnimationFrame(iterate);
}

iterate();

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
