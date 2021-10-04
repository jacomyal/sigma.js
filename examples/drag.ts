import Graph from "graphology";
import gexf from "graphology-gexf/browser";
import { NodeKey } from "graphology-types";

import Sigma from "../src/sigma";
import { globalize } from "./utils";

import arctic from "./resources/arctic.gexf";

const container = document.getElementById("container");

const graph = gexf.parse(Graph, arctic);

graph.edges().forEach((edge) => {
  graph.setEdgeAttribute(edge, "color", "#ccc");
});

const renderer = new Sigma(graph, container);

const camera = renderer.getCamera();

const captor = renderer.getMouseCaptor();

// State
let draggedNode: NodeKey | null = null,
  dragging = false;

renderer.on("downNode", (e) => {
  if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
  dragging = true;
  draggedNode = e.node;
  graph.setNodeAttribute(draggedNode, "highlighted", true);
  camera.disable();
});

captor.on("mouseup", () => {
  graph.removeNodeAttribute(draggedNode, "highlighted");
  dragging = false;
  draggedNode = null;
  camera.enable();
});

captor.on("mousemove", (e) => {
  if (!dragging || !draggedNode) return;

  // Get new position of node
  const pos = renderer.viewportToGraph(e);

  graph.setNodeAttribute(draggedNode, "x", pos.x);
  graph.setNodeAttribute(draggedNode, "y", pos.y);
});

globalize({ graph, renderer });
