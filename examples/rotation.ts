import "./random";
import { UndirectedGraph } from "graphology";

import WebGLRenderer from "../src/renderers/webgl/index";
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
const renderer = new WebGLRenderer(graph, container);

// Setup constant rotation:
function rotate() {
  const camera = renderer.getCamera();
  camera.setState({
    ...camera.getState(),
    angle: camera.getState().angle + 0.01,
  });
  requestAnimationFrame(rotate);
}
rotate();
