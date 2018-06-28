import {UndirectedGraph} from 'graphology';
import WebGLRenderer from '../src/renderers/webgl';
import circularLayout from 'graphology-layout/circular';
import {animateNodes} from '../src/animate.js';
import {scaleLinear} from 'd3-scale';
import extent from 'simple-statistics/src/extent';
import miserables from './resources/les-miserables.json';

const nodeSizeExtent = extent(miserables.nodes.map(n => n.size));
const xExtent = extent(miserables.nodes.map(n => n.x));
const yExtent = extent(miserables.nodes.map(n => n.y));

const nodeSizeScale = scaleLinear()
  .domain(nodeSizeExtent)
  .range([3, 15]);

const xScale = scaleLinear()
  .domain(xExtent)
  .range([0, 1]);

const yScale = scaleLinear()
  .domain(yExtent)
  .range([0, 1]);

const graph = new UndirectedGraph();

miserables.nodes.forEach((node, i) => {
  node.size = nodeSizeScale(node.size);
  node.x = xScale(node.x);
  node.y = yScale(node.y);
  graph.addNode(i, node);
});

miserables.edges.forEach(edge => {
  graph.addEdge(+edge.source, +edge.target, {color: '#ccc'});
});

const container = document.getElementById('container');

const renderer = new WebGLRenderer(graph, container);

const initial = {};

miserables.nodes.forEach((node, i) => {
  initial[i] = {
    x: node.x,
    y: node.y
  };
});

const circle = circularLayout(graph);

let state = 0;

function loop() {
  const l = state ? initial : circle;

  animateNodes(graph, l, {duration: 2000}, () => {
    state = !state;
    loop();
  });
}

loop();
