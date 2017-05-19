import {DirectedGraph} from 'graphology';
import gexf from 'graphology-gexf/browser';
import randomLayout from 'graphology-layout/random';
import fa2 from 'graphology-layout-forceatlas2';
import chroma from 'chroma-js';
import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

import markov from './resources/markov.json';

const graph = DirectedGraph.from(markov);
randomLayout.assign(graph, {scale: 600, center: 0});
fa2.assign(graph, {iterations: 10});

graph.nodes().forEach(node => {
  graph.mergeNodeAttributes(node, {
    label: node,
    color: chroma.random(),
    size: Math.log(graph.degree(node))
  });
});

graph.edges().forEach(edge => {
  graph.setEdgeAttribute(edge, 'color', '#ccc');
});

const container = document.getElementById('container');

const renderer = new WebGLRenderer(container);

const sigma = new Sigma(graph, renderer);

window.graph = graph;
