import {UndirectedGraph} from 'graphology';
import WebGLRenderer from '../src/renderers/webgl';
import {scaleLinear} from 'd3-scale';
import extent from 'simple-statistics/src/extent';
import miserables from './resources/les-miserables.json';

const nodeSizeExtent = extent(miserables.nodes.map(n => n.size));

const nodeSizeScale = scaleLinear()
  .domain(nodeSizeExtent)
  .range([3, 15]);

const graph = new UndirectedGraph();

miserables.nodes.forEach((node, i) => {
  node.size = nodeSizeScale(node.size);
  graph.addNode(i, node);
});

miserables.edges.forEach(edge => {
  graph.addEdge(+edge.source, +edge.target, {color: '#ccc'});
});

const container = document.getElementById('container');

const renderer = new WebGLRenderer(graph, container);
