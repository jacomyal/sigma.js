import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";
import { Attributes, EdgeKey, NodeKey } from "graphology-types";

import Sigma from "sigma";
import { EdgeAttributes, NodeAttributes } from "sigma/types";

import { getRandomName, globalize } from "./utils";

const container = document.getElementById("container");

const graph = erdosRenyi.sparse(UndirectedGraph, {
  order: 500,
  probability: 0.05,
});
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
    zIndex: 0,
  });
});

graph.edges().forEach((edge) =>
  graph.mergeEdgeAttributes(edge, {
    color: "#ccc",
    zIndex: 0,
  }),
);

let highlighedNodes = new Set();
let highlighedEdges = new Set();

const nodeReducer = (node: NodeKey, data: Attributes) => {
  if (highlighedNodes.has(node)) return { ...data, color: "#f00", zIndex: 1 };

  return data;
};

const edgeReducer = (edge: EdgeKey, data: Attributes) => {
  if (highlighedEdges.has(edge)) return { ...data, color: "#f00", zIndex: 1 };

  return data;
};

const renderer = new Sigma(graph, container, {
  nodeReducer,
  edgeReducer,
  zIndex: true,
});

renderer.on("clickNode", ({ node, captor, event }) => {
  console.log("Clicking:", node, captor, event);
});
renderer.on("rightClickNode", ({ node, captor, event }) => {
  console.log("Right Clicking:", node, captor, event);
  event.preventDefault();
});

renderer.on("downStage", ({ event }) => {
  console.log("Downing the stage.", event);
});
renderer.on("clickStage", ({ event }) => {
  console.log("Clicking the stage.", event);
});
renderer.on("rightClickStage", ({ event }) => {
  console.log("Right Clicking the stage.", event);
});

renderer.on("enterNode", ({ node }) => {
  console.log("Entering: ", node);
  highlighedNodes = new Set(graph.neighbors(node));
  highlighedNodes.add(node);

  highlighedEdges = new Set(graph.edges(node));

  renderer.refresh();
});

renderer.on("leaveNode", ({ node }) => {
  console.log("Leaving:", node);

  highlighedNodes.clear();
  highlighedEdges.clear();

  renderer.refresh();
});

globalize({ graph, renderer });
