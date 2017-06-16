import {UndirectedGraph} from 'graphology';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import randomLayout from 'graphology-layout/random';
import chroma from 'chroma-js';
import faker from 'faker';
import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

const container = document.getElementById('container');

const graph = erdosRenyi.fast(UndirectedGraph, {n: 500, probability: 0.05});
randomLayout.assign(graph);

graph.nodes().forEach(node => {
  const attr = graph.getNodeAttributes(node);

  const color = chroma.random().hex();

  graph.mergeNodeAttributes(node, {
    label: faker.name.findName(),
    size: Math.max(4, Math.random() * 10),
    originalColor: color,
    color
  });
});

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const renderer = new WebGLRenderer(container);

const sigma = new Sigma(graph, renderer);

const captor = renderer.getMouseCaptor();

// State
let draggedNode = null,
    dragging = false;

renderer.on('clickNode', e => {
  draggedNode = e.node;
  console.log(e)
});

captor.on('mousedown', e => (dragging = true));
captor.on('mouseup', e => (dragging = false));

captor.on('mousemove', e => {

  if (dragging && draggedNode)
    console.log(e);
});
