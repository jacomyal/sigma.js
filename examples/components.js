import {UndirectedGraph} from 'graphology';
import randomLayout from 'graphology-layout/random';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import {connectedComponents} from 'graphology-components';
import louvain from 'graphology-communities-louvain';
import WebGLRenderer from '../src/renderers/webgl';

import data from './resources/toflit.json';

const scale = (d) => Math.max(2, Math.log2(d) * 1.7);

document.body.innerHTML += `
  <style>
    .subcontainer {
      position: absolute;
      height: 300px;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
    }
    .subcontainer:nth-child(1),
    .subcontainer:nth-child(2),
    .subcontainer:nth-child(3) {
      border-top: 1px solid black;
    }
  </style>
`;

const mainContainer = document.getElementById('container');

const graph = new UndirectedGraph({defaultNodeAttributes: {size: 3}});

data.forEach(({source, target}) => {
  graph.mergeEdge(source, target);
});

graph.nodes().forEach(node => {
  graph.setNodeAttribute(node, 'label', node);
  graph.setNodeAttribute(node, 'size', scale(graph.degree(node)));
});

const components = connectedComponents(graph);

components.forEach(component => {
  if (component.length < 10)
    component.forEach(node => graph.dropNode(node));
});

const map = louvain(graph);
let communities = {};

for (const node in map) {
  const c = map[node];

  if (!(c in communities))
    communities[c] = new UndirectedGraph();

  const h = communities[c];

  h.mergeNode(node, graph.getNodeAttributes(node));

  graph.edges(node).forEach(edge => {
    const target = graph.opposite(node, edge);

    if (node < target || map[target] !== c)
      return;

    h.mergeEdge(node, target);
  });
}

communities = Object.values(communities)
  .sort((a, b) => b.order - a.order)
  .slice(0, 6);

const width = mainContainer.offsetWidth;

const cellWidth = (width / 3) | 0;

const containers = communities.map((_, i) => {
  const container = document.createElement('div');
  container.style.width = `${cellWidth}px`;
  container.style.left = `${(i % 3) * cellWidth}px`;
  container.style.top = `${Math.floor(i / 3) * 300}px`;
  container.className = 'subcontainer';
  mainContainer.appendChild(container);
  return container;
});

communities.forEach((h, i) => {
  randomLayout.assign(h);
  forceAtlas2.assign(h, {
    iterations: 100,
    settings: forceAtlas2.inferSettings(h)
  });

  const container = containers[i];

  const renderer = new WebGLRenderer(h, container);
});
