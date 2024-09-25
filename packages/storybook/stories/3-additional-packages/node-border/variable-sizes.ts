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
    color: "pink",
    borderColor: "red",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "yellow",
    borderColor: "red",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    borderSize: 0.8,
    label: "C",
    color: "yellow",
    borderColor: "red",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    borderSize: 0.8,
    label: "D",
    color: "pink",
    borderColor: "blue",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    borderSize: 0.2,
    label: "E",
    color: "pink",
    borderColor: "blue",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    borderSize: 0.2,
    label: "F",
    color: "yellow",
    borderColor: "blue",
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
          { size: { attribute: "borderSize", defaultValue: 0.5 }, color: { attribute: "borderColor" } },
          { size: { fill: true }, color: { attribute: "color" } },
        ],
      }),
    },
  });

  return () => {
    renderer.kill();
  };
};
