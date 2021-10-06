/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

import Graph from "graphology";
import Sigma from "sigma";
import { PlainObject } from "sigma/types";
import { animateNodes } from "../../utils/animate";
import data from "./data.json";
import FA2Layout from "graphology-layout-forceatlas2/worker";

const container = document.getElementById("sigma-container") as HTMLElement;

const graph = new Graph();
graph.import(data);

/*** FA2 LAYOUT ***/

// Force Atlas 2 can be run trough a weborker
// See https://github.com/graphology/graphology-layout-forceatlas2
const fa2Layout = new FA2Layout(graph, {
  settings: {
    gravity: 1,
  },
});

// A button can trigger the layout strat/stop actions
const FA2Button = document.getElementById("forceatlas2");

// A variable is used to toggle state between start and stop
let FA2isRunning = false;

// correlate start/stop actions with state management
const stopFA2 = () => {
  fa2Layout.stop();
  FA2Button.innerHTML = "start FA2";
  FA2isRunning = false;
};
const startFA2 = () => {
  fa2Layout.start();
  FA2Button.innerHTML = "stop FA2";
  FA2isRunning = true;
};

// the main toggle function
const toggleFA2Layout = () => {
  if (FA2isRunning) {
    stopFA2();
  } else {
    startFA2();
  }
};
// bind method to the forceatlas2 button
FA2Button.onclick = toggleFA2Layout;

/*** RANDOM LAYOUT ***/
const randomLayout = () => {
  // stop fa2 if running
  if (FA2isRunning) stopFA2();

  // Layout can be set manually using nodes props
  // graph is a Graphology instance with nice iterators
  const randomPositions: PlainObject<PlainObject<number>> = {};
  // to keep positions scale uniform between layouts, calculate positions extents
  const xExtents = { min: 0, max: 0 };
  const yExtents = { min: 0, max: 0 };
  graph.forEachNode((node, attributes) => {
    xExtents.min = Math.min(attributes.x, xExtents.min);
    xExtents.max = Math.max(attributes.x, xExtents.max);
    yExtents.min = Math.min(attributes.y, yExtents.min);
    yExtents.max = Math.max(attributes.y, yExtents.max);
  });
  graph.forEachNode((node) => {
    // store random positions in randomPositions
    randomPositions[node] = {
      x: Math.random() * (xExtents.max - xExtents.min),
      y: Math.random() * (yExtents.max - yExtents.min),
    };
  });
  // use sigma animation to update new positions
  console.log(randomPositions);
  animateNodes(graph, randomPositions, { duration: 2000, easing: "linear" }, () => {
    console.log("animation done");
  });
};

// bind method to the random button
document.getElementById("random").onclick = randomLayout;

const renderer = new Sigma(graph, container);
