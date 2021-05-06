import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";

import Sigma from "sigma";

import { getRandomName, globalize } from "./utils";

const container = document.getElementById("container");

const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: Math.random() > 0.5 ? getRandomName() : null,
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});

const renderer = new Sigma(graph, container);

globalize({ graph, renderer });
