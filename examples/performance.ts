import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";

import Sigma from "sigma";

import { getRandomName, globalize } from "./utils";

const container = document.getElementById("container");

const graph = erdosRenyi.sparse(UndirectedGraph, {
  order: 1000 * 1000,
  probability: 0,
});
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});

graph.edges().forEach((edge) => {
  graph.setEdgeAttribute(edge, "color", "#ccc");
});

const renderer = new Sigma(graph, container, {
  renderLabels: false,
});

globalize({ graph, renderer });
