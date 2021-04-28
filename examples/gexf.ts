import Graph from "graphology";
import gexf from "graphology-gexf/browser";

import Sigma from "../src/sigma";
import { globalize } from "./utils";

import arctic from "./resources/arctic.gexf";

const graph = gexf.parse(Graph, arctic);

const container = document.getElementById("container");

const renderer = new Sigma(graph, container);

globalize({ graph, renderer });
