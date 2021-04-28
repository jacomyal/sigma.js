import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";
import { NodeKey } from "graphology-types";

import { getRandomName, globalize } from "./utils";
import Sigma from "../src/sigma";

const container = document.getElementById("container");

const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});

// Get a random node key :
const centerKey: NodeKey = graph.nodes()[Math.ceil(Math.random() * 100)];

const renderer = new Sigma(graph, container, {
  nodeReducer: (nodeKey: NodeKey, data) => (nodeKey === centerKey ? { ...data, highlighted: true } : data),
});

// Calling the camera to pan to node
renderer.getCamera().animate(renderer.getNodeAttributes(centerKey) as { x: number; y: number }, {
  easing: "linear",
  duration: 500,
});

globalize({ graph, renderer });
