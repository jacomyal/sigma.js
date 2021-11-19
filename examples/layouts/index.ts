/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

import Graph from "graphology";
import Sigma from "sigma";
import { circular } from "graphology-layout";
import { PlainObject } from "sigma/types";
import { animateNodes } from "sigma/utils/animate";
import data from "./data.json";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";

// Initialize the graph object with data
const graph = new Graph();
graph.import(data);

// Retrieve some useful DOM elements:
const container = document.getElementById("sigma-container") as HTMLElement;

const FA2Button = document.getElementById("forceatlas2") as HTMLElement;
const FA2StopLabel = document.getElementById("forceatlas2-stop-label") as HTMLElement;
const FA2StartLabel = document.getElementById("forceatlas2-start-label") as HTMLElement;

const randomButton = document.getElementById("random") as HTMLElement;

const circularButton = document.getElementById("circular") as HTMLElement;

/** FA2 LAYOUT **/
/* This example shows how to use the force atlas 2 layout in a web worker */

// Graphology provides a easy to use implementation of Force Atlas 2 in a web worker
const sensibleSettings = forceAtlas2.inferSettings(graph);
const fa2Layout = new FA2Layout(graph, {
  settings: sensibleSettings,
});

// A button to trigger the layout start/stop actions

// A variable is used to toggle state between start and stop
let cancelCurrentAnimation: (() => void) | null = null;

// correlate start/stop actions with state management
function stopFA2() {
  fa2Layout.stop();
  FA2StartLabel.style.display = "flex";
  FA2StopLabel.style.display = "none";
}
function startFA2() {
  if (cancelCurrentAnimation) cancelCurrentAnimation();
  fa2Layout.start();
  FA2StartLabel.style.display = "none";
  FA2StopLabel.style.display = "flex";
}

// the main toggle function
function toggleFA2Layout() {
  if (fa2Layout.isRunning()) {
    stopFA2();
  } else {
    startFA2();
  }
}
// bind method to the forceatlas2 button
FA2Button.addEventListener("click", toggleFA2Layout);

/** RANDOM LAYOUT **/
/* Layout can be handled manually by setting nodes x and y attributes */
/* This random layout has been coded to show how to manipulate positions directly in the graph instance */
/* Alternatively a random layout algo exists in graphology: https://github.com/graphology/graphology-layout#random  */
function randomLayout() {
  // stop fa2 if running
  if (fa2Layout.isRunning()) stopFA2();
  if (cancelCurrentAnimation) cancelCurrentAnimation();

  // to keep positions scale uniform between layouts, we first calculate positions extents
  const xExtents = { min: 0, max: 0 };
  const yExtents = { min: 0, max: 0 };
  graph.forEachNode((node, attributes) => {
    xExtents.min = Math.min(attributes.x, xExtents.min);
    xExtents.max = Math.max(attributes.x, xExtents.max);
    yExtents.min = Math.min(attributes.y, yExtents.min);
    yExtents.max = Math.max(attributes.y, yExtents.max);
  });
  const randomPositions: PlainObject<PlainObject<number>> = {};
  graph.forEachNode((node) => {
    // create random positions respecting position extents
    randomPositions[node] = {
      x: Math.random() * (xExtents.max - xExtents.min),
      y: Math.random() * (yExtents.max - yExtents.min),
    };
  });
  // use sigma animation to update new positions
  cancelCurrentAnimation = animateNodes(graph, randomPositions, { duration: 2000 });
}

// bind method to the random button
randomButton.addEventListener("click", randomLayout);

/** CIRCULAR LAYOUT **/
/* This example shows how to use an existing deterministic graphology layout */
function circularLayout() {
  // stop fa2 if running
  if (fa2Layout.isRunning()) stopFA2();
  if (cancelCurrentAnimation) cancelCurrentAnimation();

  //since we want to use animations we need to process positions before applying them through animateNodes
  const circularPositions = circular(graph, { scale: 100 });
  //In other context, it's possible to apply the position directly we : circular.assign(graph, {scale:100})
  cancelCurrentAnimation = animateNodes(graph, circularPositions, { duration: 2000, easing: "linear" });
}

// bind method to the random button
circularButton.addEventListener("click", circularLayout);

/** instantiate sigma into the container **/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container);
