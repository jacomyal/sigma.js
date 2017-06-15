import {UndirectedGraph} from 'graphology';
import clusters from 'graphology-generators/random/clusters';
import randomLayout from 'graphology-layout/random';
import {
  applyLayoutChanges,
  graphToByteArrays
} from 'graphology-layout-forceatlas2/helpers';
import faker from 'faker';
import Worker from './fa2.worker.js';
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

console.time('Creation');
const graph = clusters(UndirectedGraph, {
  order: 5000,
  size: 25000,
  clusters: 5
});
console.timeEnd('Creation');

randomLayout.assign(graph, {scale: 400, center: 0});

console.time('Node Attributes');
graph.nodes().forEach(node => {
  const attr = graph.getNodeAttributes(node);

  graph.mergeNodeAttributes(node, {
    label: faker.name.findName(),
    size: Math.max(4, Math.random() * 10),
    color: PALETTE[attr.cluster]
  });
});
console.timeEnd('Node Attributes');

console.time('Edge Attributes');
graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});
console.timeEnd('Edge Attributes');

const renderer = new WebGLRenderer(container);

console.profile('Sigma');
const sigma = new Sigma(graph, renderer);
console.profileEnd('Sigma');

const worker = new Worker();

function layout() {
  const matrices = graphToByteArrays(graph);

  worker.postMessage({
    nodes: matrices.nodes.buffer,
    edges: matrices.edges.buffer
  }, [matrices.nodes.buffer, matrices.edges.buffer]);

  worker.addEventListener('message', event => {
    const nodeM = new Float32Array(event.data.nodes);

    applyLayoutChanges(graph, nodeM);

    worker.postMessage({
      nodes: nodeM.buffer
    }, [nodeM.buffer]);
  });
}

layout();

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
