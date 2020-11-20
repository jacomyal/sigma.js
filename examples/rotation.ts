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
function rotate(angle: number) {
  const camera = renderer.getCamera();
  camera.setState({
    ...camera.getState(),
    angle: camera.getState().angle + 0.01,
  });
  if (camera.getState().angle < angle) requestAnimationFrame(() => rotate(angle));
  else window.dispatchEvent(new Event("RotationDone"));
}

// Create  button rotate
const button = document.createElement("button");
button.textContent = "Rotate 90";
button.style.position = "absolute";
button.style.left = "10px";
button.style.top = "10px";
button.onclick = () => {
  const camera = renderer.getCamera();
  rotate(camera.getState().angle + Math.PI / 2);
};
container.appendChild(button);

rotate(Math.PI / 2);
