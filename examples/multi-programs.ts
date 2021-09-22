import { MultiGraph } from "graphology";

import Sigma from "../src/sigma";
import { globalize } from "./utils";
import CustomNodeProgram from "./custom-nodes/custom-node-program";
import CircleNodeProgram from "../src/rendering/webgl/programs/node.fast";

const container = document.getElementById("container") as HTMLDivElement;

const graph = new MultiGraph();

graph.addNode("Alice", {
  label: "Alice",
  x: -2,
  y: 1,
  color: "#FF0",
  size: 30,
  type: "custom",
});

graph.addNode("Bob", {
  label: "Bob",
  x: 1,
  y: 2,
  color: "#00F",
  size: 30,
  type: "custom",
});

graph.addNode("Charles", {
  label: "Charles",
  x: 2,
  y: -1,
  color: "#00F",
  size: 30,
});

graph.addNode("Deborah", {
  label: "Deborah",
  x: -1,
  y: -2,
  color: "#00F",
  size: 30,
});

graph.addEdge("Alice", "Bob", {
  label: "likes to play with",
  size: 20,
  type: "arrow",
});

graph.addEdge("Bob", "Charles", {
  label: "likes to be with",
  color: "#fc0",
  size: 20,
  type: "arrow",
});

graph.addEdge("Charles", "Deborah", {
  label: "likes to talk with",
  color: "#CCC",
  size: 20,
});

graph.addEdge("Deborah", "Alice", {
  label: "likes to talk with",
  color: "#000",
  size: 20,
});

const renderer = new Sigma(graph, container, {
  defaultEdgeType: "line",
  defaultEdgeColor: "#888",
  renderEdgeLabels: true,
  nodeProgramClasses: {
    circle: CircleNodeProgram,
    custom: CustomNodeProgram,
  },
});

globalize({ graph, renderer });
