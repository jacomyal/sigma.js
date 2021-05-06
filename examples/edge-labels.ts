import { DirectedGraph } from "graphology";

import Sigma from "sigma";

import { globalize } from "./utils";

const container = document.getElementById("container");

const graph = new DirectedGraph();

graph.addNode("Alice", {
  label: "Alice",
  x: -2,
  y: 1,
  color: "#FF0",
  size: 10,
});

graph.addNode("Bob", {
  label: "Bob",
  x: 1,
  y: 2,
  color: "#00F",
  size: 5,
});

graph.addNode("Charles", {
  label: "Charles",
  x: 2,
  y: -1,
  color: "#00F",
  size: 5,
});

graph.addNode("Deborah", {
  label: "Deborah",
  x: -1,
  y: -2,
  color: "#00F",
  size: 5,
});

graph.addEdge("Alice", "Bob", {
  label: "likes to play with",
  size: 1,
});

graph.addEdge("Bob", "Charles", {
  label: "likes to be with",
  color: "#fc0",
  size: 2,
});

graph.addEdge("Charles", "Deborah", {
  label: "likes to talk with",
  color: "#CCC",
  size: 3,
});

graph.addEdge("Deborah", "Alice", {
  label: "likes to talk with",
  color: "#000",
  size: 20,
});

const renderer = new Sigma(graph, container, {
  defaultEdgeType: "arrow",
  defaultEdgeColor: "#888",
  renderEdgeLabels: true,
});

globalize({ graph, renderer });
