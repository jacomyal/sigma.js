import {UndirectedGraph} from 'graphology';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import randomLayout from 'graphology-layout/random';
import chroma from 'chroma-js';

import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

const container = document.getElementById('container');

const graph = erdosRenyi(UndirectedGraph, {n: 20, probability: 0.7});
randomLayout.assign(graph);

graph.nodes().forEach(node => {
  const attr = graph.getNodeAttributes(node);

  graph.mergeNodeAttributes(node, {
    size: Math.random() * 2,
    color: chroma.random().hex(),
    x: attr.x * 500,
    y: attr.y * 500
  });
});

const renderer = new WebGLRenderer(container);

const sigma = new Sigma(graph, renderer);

window.renderer = renderer;
