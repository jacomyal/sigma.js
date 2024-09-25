import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../../_data/data.json";

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
    createContoursProgram(graph.nodes(), {
      radius: 150,
      feather: 1,
      border: {
        color: "#000000",
        thickness: 4,
      },
      levels: [
        {
          color: "#fff7f3",
          threshold: 0.9,
        },
        {
          color: "#fde0dd",
          threshold: 0.8,
        },
        {
          color: "#fcc5c0",
          threshold: 0.7,
        },
        {
          color: "#fa9fb5",
          threshold: 0.6,
        },
        {
          color: "#f768a1",
          threshold: 0.5,
        },
        {
          color: "#dd3497",
          threshold: 0.4,
        },
        {
          color: "#ae017e",
          threshold: 0.3,
        },
        {
          color: "#7a0177",
          threshold: 0.2,
        },
        {
          color: "#49006a",
          threshold: -0.1,
        },
      ],
    }),
  );

  return () => {
    renderer?.kill();
  };
};
