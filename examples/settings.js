import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';
import WebGLRenderer from '../src/renderers/webgl';

import arctic from './resources/arctic.gexf';

const graph = gexf.parse(Graph, arctic);

graph.forEachEdge(edge => graph.setEdgeAttribute(edge, 'size', 10));

const container = document.getElementById('container');

const settings = {
  defaultEdgeType: 'arrow',
  defaultEdgeColor: 'rgba(0, 0, 0, 0.6)',
  labelSize: 20,
  labelGrid: {
    cell: {
      width: 250,
      height: 50
    },
    renderedSizeThreshold: 8
  }
};

const renderer = new WebGLRenderer(graph, container, settings);

window.renderer = renderer;
