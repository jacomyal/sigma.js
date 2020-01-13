import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';
import WebGLRenderer from '../src/renderers/webgl';

import arctic from './resources/arctic.gexf';

const graph = gexf.parse(Graph, arctic);

graph.forEachEdge(edge => graph.setEdgeAttribute(edge, 'size', 2));

const container = document.getElementById('container');

const settings = {
  defaultEdgeType: 'arrow',
  labelGrid: {
    renderedSizeThreshold: 10
  }
};

const renderer = new WebGLRenderer(graph, container, settings);

window.renderer = renderer;
