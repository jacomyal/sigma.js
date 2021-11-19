/**
 * This example shows how to use different programs to render nodes.
 * This works in two steps:
 * 1. You must declare all the different rendering programs to sigma when you
 *    instantiate it
 * 2. You must give to each node and edge a "type" value that matches a declared
 *    program
 * The programs offered by default by sigma are in src/rendering/webgl/programs,
 * but you can add your own.
 *
 * Here in this example, some nodes are drawn with images in them using the
 * the getNodeProgramImage provided by Sigma. Some others are drawn as white
 * disc with a border, and the custom program to draw them is in this directory:
 * - "./node.border.ts" is the node program. It tells sigma what data to give to
 *   the GPU and how.
 * - "./node.border.vert.glsl" is the vertex shader. It tells the GPU how to
 *   interpret the data provided by the program to obtain a node position,
 *   mostly.
 * - "./node.border.frag.glsl" is the fragment shader. It tells for each pixel
 *   what color it should get, relatively to data given by the program and its
 *   position inside the shape. Basically, the GPU wants to draw a square, but
 *   we "carve" a disc in it.
 */

import Graph from "graphology";
import Sigma from "sigma";

import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import NodeProgramBorder from "./node.border";

import ForceSupervisor from "graphology-layout-force/worker";

const container = document.getElementById("sigma-container") as HTMLElement;

const graph = new Graph();

const RED = "#FA4F40";
const BLUE = "#727EE0";
const GREEN = "#5DB346";

graph.addNode("John", { size: 15, label: "John", type: "image", image: "./user.svg", color: RED });
graph.addNode("Mary", { size: 15, label: "Mary", type: "image", image: "./user.svg", color: RED });
graph.addNode("Suzan", { size: 15, label: "Suzan", type: "image", image: "./user.svg", color: RED });
graph.addNode("Nantes", { size: 15, label: "Nantes", type: "image", image: "./city.svg", color: BLUE });
graph.addNode("New-York", { size: 15, label: "New-York", type: "image", image: "./city.svg", color: BLUE });
graph.addNode("Sushis", { size: 7, label: "Sushis", type: "border", color: GREEN });
graph.addNode("Falafels", { size: 7, label: "Falafels", type: "border", color: GREEN });
graph.addNode("Kouign Amann", { size: 7, label: "Kouign Amann", type: "border", color: GREEN });

graph.addEdge("John", "Mary", { type: "line", label: "works with", size: 5 });
graph.addEdge("Mary", "Suzan", { type: "line", label: "works with", size: 5 });
graph.addEdge("Mary", "Nantes", { type: "arrow", label: "lives in", size: 5 });
graph.addEdge("John", "New-York", { type: "arrow", label: "lives in", size: 5 });
graph.addEdge("Suzan", "New-York", { type: "arrow", label: "lives in", size: 5 });
graph.addEdge("John", "Falafels", { type: "arrow", label: "eats", size: 5 });
graph.addEdge("Mary", "Sushis", { type: "arrow", label: "eats", size: 5 });
graph.addEdge("Suzan", "Kouign Amann", { type: "arrow", label: "eats", size: 5 });

graph.nodes().forEach((node, i) => {
  const angle = (i * 2 * Math.PI) / graph.order;
  graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
  graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container, {
  // We don't have to declare edgeProgramClasses here, because we only use the default ones ("line" and "arrow")
  nodeProgramClasses: {
    image: getNodeProgramImage(),
    border: NodeProgramBorder,
  },
  renderEdgeLabels: true,
});

// Create the spring layout and start it
const layout = new ForceSupervisor(graph);
layout.start();
