/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

import Graph from "graphology";
import Sigma from "sigma";

const container = document.getElementById("sigma-container") as HTMLElement;

const graph = new Graph();

graph.addNode("John", { x: 0, y: 10, size: 5, label: "John", color: "blue" });
graph.addNode("Mary", { x: 10, y: 0, size: 3, label: "Mary", color: "red" });

graph.addEdge("John", "Mary");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container);
