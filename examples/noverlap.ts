import { UndirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";
import empty from "graphology-generators/classic/empty";
import noverlap, { NoverlapNodeReducer } from "graphology-layout-noverlap";
import NoverlapLayoutSupervisor from "graphology-layout-noverlap/worker";
import chroma from "chroma-js";
import random from "pandemonium/random";

import Sigma from "../src/sigma";
import { animateNodes } from "../src/utils/animate";
import { globalize } from "./utils";

const NOVERLAP_SETTINGS = {
  margin: 2,
  ratio: 1,
  speed: 3,
};

const container = document.getElementById("container") as HTMLDivElement;

const graph = empty(UndirectedGraph, 1000);
randomLayout.assign(graph);

graph.forEachNode((node) => {
  graph.mergeNodeAttributes(node, {
    label: node,
    size: random(2, 10),
    color: chroma.random().hex(),
  });
});

const renderer = new Sigma(graph, container);

function createButton(text: string, offset: number) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.position = "absolute";
  button.style.left = "10px";

  let top = 10;

  top += offset * 40;

  button.style.top = `${top}px`;

  container.appendChild(button);

  return button;
}

const inputReducer: NoverlapNodeReducer = (key, attr) => {
  return { ...attr, ...renderer.graphToViewport(attr) };
};

const outputReducer: NoverlapNodeReducer = (key, attr) => {
  return { ...attr, ...renderer.viewportToGraph(attr) };
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
};

globalize({ graph, renderer });
