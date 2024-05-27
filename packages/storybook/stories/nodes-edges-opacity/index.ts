/**
 * This example shows how to render nodes and edges with various opacities
 */
import chroma from "chroma-js";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../../public/data.json";
import { onStoryDown } from "../utils";

const DEFAULT_ARGS = {
  nodesAlpha: 0.5,
  edgesAlpha: 0.5,
};

export default (input: { args: typeof DEFAULT_ARGS }) => {
  const args = {
    ...DEFAULT_ARGS,
    ...input.args,
  };

  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();
  graph.import(data);
  const renderer = new Sigma(graph, container, {
    enableEdgeEvents: true,
    edgeReducer: (_, attr) => {
      attr.color = chroma(attr.color || "#000000")
        .alpha(args.edgesAlpha)
        .hex();
      return attr;
    },
    nodeReducer: (_, attr) => {
      attr.color = chroma(attr.color).alpha(args.nodesAlpha).hex();
      attr.label = null;
      return attr;
    },
  });

  onStoryDown(() => {
    renderer?.kill();
  });
};
