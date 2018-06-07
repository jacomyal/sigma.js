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

const renderer = new WebGLRenderer(graph, container, {
  zIndex: true
});

// Binding events
renderer.on('overNode', e => {
  const edges = new Set(graph.edges(e.node));

  const neighbors = new Set(
    [e.node].concat([...edges].map(edge => graph.opposite(e.node, edge)))
  );

  graph.nodes().forEach(node => {
    if (neighbors.has(node)) {
      graph.setNodeAttribute(node, 'color', '#f00');
    }
    else {
      graph.setNodeAttribute(node, 'color', '#ccc');
    }
  });

  graph.edges().forEach(edge => {
    if (edges.has(edge)) {
      graph.setEdgeAttribute(edge, 'hidden', false);
      graph.setEdgeAttribute(edge, 'color', '#f00');
    }
    else {
      graph.setEdgeAttribute(edge, 'hidden', true);
    }
  });
});

renderer.on('outNode', e => {
  graph.edges().forEach(edge => {
    graph.setEdgeAttribute(edge, 'hidden', false);
    graph.setEdgeAttribute(edge, 'color', '#ccc');
  });

  graph.nodes().forEach(node => {
    graph.setNodeAttribute(node, 'color', graph.getNodeAttribute(node, 'originalColor'));
  });
});

renderer.on('clickNode', e => {
  console.log(e.node, graph.getNodeAttributes(e.node));
});

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
