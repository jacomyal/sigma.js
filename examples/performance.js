import {UndirectedGraph} from 'graphology';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import randomLayout from 'graphology-layout/random';
import chroma from 'chroma-js';
import faker from 'faker';
import WebGLRenderer from '../src/renderers/webgl';

const container = document.getElementById('container');

const graph = erdosRenyi.sparse(UndirectedGraph, {order: 1000 * 1000, probability: 0});
randomLayout.assign(graph);

graph.nodes().forEach(node => {
  const attr = graph.getNodeAttributes(node);

  graph.mergeNodeAttributes(node, {
    label: faker.name.findName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex()
  });
});

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const renderer = new WebGLRenderer(graph, container, {
  renderLabels: false
});

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
