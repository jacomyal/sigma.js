import { UndirectedGraph } from "graphology";
import clusters from "graphology-generators/random/clusters";
import randomLayout from "graphology-layout/random";
import FA2Layout from "graphology-layout-forceatlas2/worker";

import { getRandomName, globalize } from "./utils";
import Sigma from "../src/sigma";

const PALETTE = ["#b4943e", "#777acd", "#60a862", "#c45ca2", "#cb5a4c"];

const container = document.getElementById("container");

console.time("Creation");
const graph = clusters(UndirectedGraph, {
  order: 5000,
  size: 25000,
  clusters: 5,
});
console.timeEnd("Creation");

randomLayout.assign(graph, { scale: 400, center: 0 });

console.time("Node Attributes");
graph.nodes().forEach((node) => {
  const attr = graph.getNodeAttributes(node);

  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: PALETTE[attr.cluster],
  });
});
console.timeEnd("Node Attributes");

console.time("Edge Attributes");
graph.edges().forEach((edge) => {
  graph.setEdgeAttribute(edge, "color", "#ccc");
});
console.timeEnd("Edge Attributes");

const renderer = new Sigma(graph, container);

const layout = new FA2Layout(graph, { settings: { barnesHutOptimize: true } });
layout.start();

globalize({ graph, renderer, layout });
