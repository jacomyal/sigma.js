/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import bindLeafletLayer from "@sigma/layer-leaflet";
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
    x: 0,
    y: 0,
  }));

  // initiate sigma
  const renderer = new Sigma(graph, container, {
    labelRenderedSizeThreshold: 20,
    nodeReducer: (node, attrs) => {
      return {
        ...attrs,
        label: attrs.fullName,
        color: "#e22352",
        size: Math.sqrt(graph.degree(node)) / 2,
      };
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });

  bindLeafletLayer(renderer, {
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });
};
