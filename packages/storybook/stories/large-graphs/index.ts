/**
 * This example aims at showcasing sigma's performances.
 */

import Sigma from "sigma";
import Graph from "graphology";
import seedrandom from "seedrandom";

import EdgeRectangleProgram from "sigma/rendering/programs/edge-rectangle";
import EdgeLineProgram from "sigma/rendering/programs/edge-line";
import circlepack from "graphology-layout/circlepack";
import clusters from "graphology-generators/random/clusters";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { onStoryDown } from "../utils";

export default (args: any) => {
  //{ order: number; size: number; clusters: number; edgesRenderer: string }) => {
  const rng = seedrandom("sigma");
  const state = {
    order: 5000,
    size: 1000,
    clusters: 3,
    edgesRenderer: "edges-default",
    ...args.args,
  };

  // 1. Generate a graph:
  const graph = clusters(Graph, { ...state, rng });
  circlepack.assign(graph, {
    hierarchyAttributes: ["cluster"],
  });
  const colors: Record<string, string> = {};
  for (let i = 0; i < +state.clusters; i++) {
    colors[i] = "#" + Math.floor(rng() * 16777215).toString(16);
  }
  let i = 0;
  graph.forEachNode((node, { cluster }) => {
    graph.mergeNodeAttributes(node, {
      size: graph.degree(node) / 3,
      label: `Node n°${++i}, in cluster n°${cluster}`,
      color: colors[cluster + ""],
    });
  });

  // 2. Render the graph:
  const container = document.getElementById("sigma-container") as HTMLElement;
  const renderer = new Sigma(graph, container, {
    defaultEdgeColor: "#e6e6e6",
    defaultEdgeType: state.edgesRenderer,
    edgeProgramClasses: {
      "edges-default": EdgeRectangleProgram,
      "edges-fast": EdgeLineProgram,
    },
  });

  // 3. Enable FA2 button:
  const fa2Button = document.getElementById("fa2") as HTMLButtonElement;
  const sensibleSettings = forceAtlas2.inferSettings(graph);
  const fa2Layout = new FA2Layout(graph, {
    settings: sensibleSettings,
  });
  function toggleFA2Layout() {
    if (fa2Layout.isRunning()) {
      fa2Layout.stop();
      fa2Button.innerHTML = `Start layout ▶`;
    } else {
      fa2Layout.start();
      fa2Button.innerHTML = `Stop layout ⏸`;
    }
  }
  fa2Button.addEventListener("click", toggleFA2Layout);

  // Cheap trick: tilt the camera a bit to make labels more readable:
  renderer.getCamera().setState({
    angle: 0.2,
  });

  onStoryDown(() => {
    fa2Layout.kill();
    renderer.kill();
  });
};
