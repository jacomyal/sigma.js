import { getNodesInViewport } from "@sigma/utils";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../../_data/data.json";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Retrieve some useful DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma
  const renderer = new Sigma(graph, container);

  // Add buttons
  const logsContainer = document.createElement("div");
  logsContainer.style.position = "absolute";
  logsContainer.style.left = "10px";
  logsContainer.style.top = "10px";
  document.body.append(logsContainer);

  setInterval(() => {
    const nodesInViewport = getNodesInViewport(renderer);
    const count = nodesInViewport.length;
    logsContainer.innerHTML =
      count === 0 ? "No visible node" : count === 1 ? "One visible node" : `${count} visible nodes`;
  }, 200);

  return () => {
    renderer?.kill();
  };
};
