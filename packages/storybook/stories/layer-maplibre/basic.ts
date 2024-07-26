/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import bindMaplibreLayer from "@sigma/layer-maplibre";
import Graph from "graphology";
import { Attributes, SerializedGraph } from "graphology-types";
import Sigma from "sigma";

import { onStoryDown } from "../utils";
import data from "./data/airports.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const graph = Graph.from(data as SerializedGraph);
  graph.updateEachNodeAttributes((_node, attributes) => ({
    ...attributes,
    label: attributes.fullName,
    x: 0,
    y: 0,
  }));

  // initiate sigma
  const renderer = new Sigma(graph, container, {
    labelRenderedSizeThreshold: 20,
    defaultNodeColor: "#e22352",
    defaultEdgeColor: "#ffaeaf",
    minEdgeThickness: 1,
    nodeReducer: (node, attrs) => {
      return {
        ...attrs,
        size: Math.sqrt(graph.degree(node)) / 2,
      };
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });

  bindMaplibreLayer(renderer, {
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });
};
