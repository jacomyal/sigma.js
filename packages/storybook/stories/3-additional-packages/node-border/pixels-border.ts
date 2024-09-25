import { createNodeBorderProgram } from "@sigma/node-border";
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
    borderColor: "blue",
    fillColor: "white",
    dotColor: "red",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    borderColor: "purple",
    fillColor: "white",
    dotColor: "red",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    borderColor: "purple",
    fillColor: "white",
    dotColor: "red",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    borderColor: "blue",
    fillColor: "white",
    dotColor: "green",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    borderColor: "blue",
    fillColor: "white",
    dotColor: "green",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    borderColor: "purple",
    fillColor: "white",
    dotColor: "green",
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

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "bordered",
    nodeProgramClasses: {
      bordered: createNodeBorderProgram({
        borders: [
          { size: { value: 10, mode: "pixels" }, color: { attribute: "borderColor" } },
          { size: { fill: true }, color: { attribute: "fillColor" } },
          { size: { value: 20, mode: "pixels" }, color: { attribute: "dotColor" } },
        ],
      }),
    },
  });

  return () => {
    renderer.kill();
  };
};
