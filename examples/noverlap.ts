import { UndirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";
import empty from "graphology-generators/classic/empty";
import WebGLRenderer from "../src/renderers/webgl/index";
import { animateNodes } from "../src/animate";
import noverlap from "graphology-layout-noverlap";
import NoverlapLayoutSupervisor from "graphology-layout-noverlap/worker";
import chroma from "chroma-js";
import random from "pandemonium/random";

// import arctic from "./resources/arctic.gexf";
// import gexf from "graphology-gexf/browser";

const NOVERLAP_SETTINGS = {
  margin: 2,
  ratio: 1,
  speed: 3,
};

const container = document.getElementById("container");

const graph = empty(UndirectedGraph, 1000);
randomLayout.assign(graph);

// const graph = gexf.parse(UndirectedGraph, arctic);

graph.forEachNode((node) => {
  graph.mergeNodeAttributes(node, {
    label: node,
    size: random(2, 10),
    color: chroma.random().hex(),
  });
});

const renderer = new WebGLRenderer(graph, container);
const camera = renderer.getCamera();

function createButton(text, offset) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.position = "absolute";
  button.style.left = "10px";

  let top = 10;

  top += offset * 20;

  button.style.top = `${top}px`;

  container.appendChild(button);

  return button;
}

const inputReducer = (key, attr) => {
  let pos = renderer.normalizationFunction(attr);
  pos = camera.graphToViewport(renderer, pos);

  return {
    x: pos.x,
    y: pos.y,
    size: attr.size,
  };
};

const outputReducer = (key, pos) => {
  return renderer.normalizationFunction.inverse(camera.viewportToGraph(renderer, pos));
};

const fixedButton = createButton("noverlap 500", 0);

fixedButton.onclick = () => {
  console.time("noverlap");
  const layout = noverlap(graph, { inputReducer, outputReducer, maxIterations: 500, settings: NOVERLAP_SETTINGS });
  console.timeEnd("noverlap");

  animateNodes(graph, layout, { duration: 100, easing: "linear" }, () => console.log("done"));
};

const supervisor = new NoverlapLayoutSupervisor(graph, { inputReducer, outputReducer, settings: NOVERLAP_SETTINGS });

const startButton = createButton("start", 1);
const stopButton = createButton("stop", 2);

startButton.onclick = () => {
  supervisor.start();
};

stopButton.onclick = () => {
  supervisor.stop();
  console.log(supervisor.converged);
};

window.renderer = renderer;
