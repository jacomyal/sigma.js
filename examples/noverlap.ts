import { UndirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";
import empty from "graphology-generators/classic/empty";
import WebGLRenderer from "../src/renderers/webgl/index";
import { animateNodes } from "../src/animate";
import noverlap from "graphology-layout-noverlap";
import chroma from "chroma-js";
import random from "pandemonium/random";

const container = document.getElementById("container");

const graph = empty(UndirectedGraph, 5000);
randomLayout.assign(graph);

graph.forEachNode((node) => {
  graph.mergeNodeAttributes(node, {
    label: node,
    size: random(5, 20),
    color: chroma.random().hex(),
  });
});

const renderer = new WebGLRenderer(graph, container);
const camera = renderer.getCamera();

const button = document.createElement("button");
button.textContent = "noverlap";
button.style.position = "absolute";
button.style.left = "10px";
button.style.top = "10px";

container.appendChild(button);

const reducer = (sizeRatio) => (key, attr) => {
  const pos = camera.graphToViewport(renderer, attr.x, attr.y);

  return {
    x: pos.x,
    y: pos.y,
    size: attr.size / sizeRatio,
  };
};

button.onclick = () => {
  var layout = noverlap(graph, { reducer: reducer(Math.pow(camera.getState().ratio, 0.5)), maxIterations: 1 });

  for (const node in layout)
    layout[node] = camera.viewportToGraph(renderer, layout[node].x, layout[node].y);

  animateNodes(graph, layout, { duration: 100, easing: "linear" }, () => console.log("done"));
};

window.renderer = renderer;
