import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import choice from "pandemonium/choice";
import random from "pandemonium/random";
import chroma from "chroma-js";

import { getRandomName, globalize } from "./utils";
import Sigma from "../src/sigma";

const container = document.getElementById("container");

const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});

const renderer = new Sigma(graph, container);

// Randomly editing the graph every second
const OPERATIONS = ["addNode"];
let counter = 0;

function edit() {
  const op = choice(OPERATIONS);

  // Adding node
  if (op === "addNode") {
    const nodeKey = "added-" + counter++;

    const otherNodes = graph.nodes();

    graph.addNode(nodeKey, {
      label: getRandomName(),
      size: Math.max(4, Math.random() * 10) * 2,
      color: chroma.random().hex(),
      x: Math.random(),
      y: Math.random(),
    });

    // Adding edges
    const targets = new Set(
      Array.from(new Array(random(1, 5)), () => {
        return choice(otherNodes);
      }),
    );

    targets.forEach((target) => {
      graph.addEdge(nodeKey, target, { color: chroma.random().hex() });
    });
  }
}

setInterval(edit, 1000);

// Layout experiences
const layout = new FA2Layout(graph, { settings: { slowDown: 1000000 } });

globalize({
  graph,
  renderer,
  startLayout: function () {
    layout.start();
  },
  stopLayout: function () {
    layout.stop();
  },
});
