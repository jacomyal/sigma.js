import { createNodePiechartProgram } from "@sigma/node-piechart";
import Graph from "graphology";
import Sigma from "sigma";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    offset: Math.PI / 3,
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    offset: Math.PI / 2,
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    offset: Math.PI,
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    offset: (Math.PI * 2) / 3,
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    offset: (Math.PI * 3) / 2,
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const NodePiechartProgram = createNodePiechartProgram({
    defaultColor: "#BCB7C4",
    offset: { attribute: "offset" },
    slices: [
      { color: { value: "yellow" }, value: { value: 1 } },
      { color: { value: "orange" }, value: { value: 1 } },
    ],
  });
  const renderer = new Sigma(graph, container, {
    defaultNodeType: "piechart",
    nodeProgramClasses: {
      piechart: NodePiechartProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
