import { UndirectedGraph } from "graphology";
import circularLayout from "graphology-layout/circular";
import { scaleLinear } from "d3-scale";
import { extent } from "simple-statistics";

import Sigma from "../src/sigma";
import { animateNodes } from "../src/utils/animate";
import { PlainObject } from "../src/types";

import miserables from "./resources/les-miserables.json";

const graph = new UndirectedGraph();

// Prepare data:
const nodeSizeExtent = extent(miserables.nodes.map((n) => n.size));
const xExtent = extent(miserables.nodes.map((n) => n.x));
const yExtent = extent(miserables.nodes.map((n) => n.y));

const nodeSizeScale = scaleLinear().domain(nodeSizeExtent).range([3, 15]);
const xScale = scaleLinear().domain(xExtent).range([0, 1]);
const yScale = scaleLinear().domain(yExtent).range([0, 1]);

miserables.nodes.forEach((node: { x: number; y: number; size: number }) => {
  node.size = nodeSizeScale(node.size) as number;
  node.x = xScale(node.x) as number;
  node.y = yScale(node.y) as number;
});

miserables.nodes.forEach((node, i) => {
  graph.addNode(i, node);
});

miserables.edges.forEach((edge) => {
  graph.addEdge(+edge.source, +edge.target, { color: "#ccc" });
});

const container = document.getElementById("container");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container);

const initial: PlainObject<{ x: number; y: number }> = {};

miserables.nodes.forEach((node: { size: number; x: number; y: number }, i) => {
  initial[i] = {
    x: node.x,
    y: node.y,
  };
});

const circle = circularLayout(graph);

let state = false;

function loop() {
  const l = state ? initial : circle;

  animateNodes(graph, l, { duration: 2000 }, () => {
    state = !state;
    loop();
  });
}

loop();
