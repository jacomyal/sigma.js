import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";
import { getRandomName } from "./utils";
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

const renderer = new Sigma(graph, container);

// Get a random node key :
const nodeKey = graph.nodes()[Math.ceil(Math.random() * 100)];

// Highlight the node
renderer.highlightNode(nodeKey);

// Calling the camera to pan to node
renderer.camera.animate(renderer.getNodeAttributes(nodeKey), { easing: "linear", duration: 500 });

window.graph = graph;
window.renderer = renderer;
window.camera = renderer.camera;
