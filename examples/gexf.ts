import Graph from "graphology";
import gexf from "graphology-gexf/browser";
import Sigma from "../src/sigma";

import arctic from "./resources/arctic.gexf";

const graph = gexf.parse(Graph, arctic);

const container = document.getElementById("container");

const renderer = new Sigma(graph, container);

window.renderer = renderer;
window.camera = renderer.getCamera();
