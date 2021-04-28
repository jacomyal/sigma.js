import { UndirectedGraph } from "graphology";

import Sigma from "../src/sigma";
import { requestFrame } from "../src/utils";
import { globalize } from "./utils";

import miserables from "./resources/les-miserables.json";

const graph = new UndirectedGraph();

// Read graph data:
miserables.nodes.forEach((node, i) => {
  graph.addNode(i, node);
});
miserables.edges.forEach((edge) => {
  graph.addEdge(+edge.source, +edge.target, { color: "#ccc" });
});

// Instantiate sigma:
const container = document.getElementById("container");
const renderer = new Sigma(graph, container);

// Setup constant rotation:
function rotate() {
  const camera = renderer.getCamera();
  camera.setState({
    ...camera.getState(),
    angle: camera.getState().angle + 0.01,
  });
  requestFrame(rotate);
}
rotate();

globalize({ graph, renderer });
