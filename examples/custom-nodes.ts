import {UndirectedGraph} from 'graphology';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import randomLayout from 'graphology-layout/random';
import chroma from 'chroma-js';
import faker from 'faker';
import WebGLRenderer from '../src/renderers/webgl/index';

import CustomNodeProgram from './custom-nodes/custom-node-program';

const container = document.getElementById('container');

const graph = erdosRenyi(UndirectedGraph, {order: 100, probability: 0.2});
randomLayout.assign(graph);

graph.nodes().forEach(node => {
  graph.mergeNodeAttributes(node, {
    label: faker.name.findName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex()
  });
});

const renderer = new WebGLRenderer(graph, container, {
  nodeProgramClasses: {circle: CustomNodeProgram}
});

// window.graph = graph;
// window.renderer = renderer;
// window.camera = renderer.camera;
