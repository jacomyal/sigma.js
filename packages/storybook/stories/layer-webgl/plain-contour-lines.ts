import { bindWebGLLayer, createMetaballsProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../_data/data.json";
import { onStoryDown } from "../utils";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Retrieve some useful DOM elements:
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma:
  const renderer = new Sigma(graph, container);

  bindWebGLLayer(
    "metaball",
    renderer,
    createMetaballsProgram(graph.nodes(), {
      radius: 150,
      halos: [
        {
          color: "#fff7f3",
          threshold: 0.9,
          feather: 0.005,
        },
        {
          color: "#fde0dd",
          threshold: 0.8,
          feather: 0.005,
        },
        {
          color: "#fcc5c0",
          threshold: 0.7,
          feather: 0.005,
        },
        {
          color: "#fa9fb5",
          threshold: 0.6,
          feather: 0.005,
        },
        {
          color: "#f768a1",
          threshold: 0.5,
          feather: 0.005,
        },
        {
          color: "#dd3497",
          threshold: 0.4,
          feather: 0.005,
        },
        {
          color: "#ae017e",
          threshold: 0.3,
          feather: 0.005,
        },
        {
          color: "#7a0177",
          threshold: 0.2,
          feather: 0.005,
        },
        {
          color: "#49006a",
          threshold: -0.1,
          feather: 0,
        },
      ],
    }),
  );

  onStoryDown(() => {
    renderer?.kill();
  });
};
