/**
 * This story shows how to use a custom tile layer with @sigma/layer-leaflet.
 */
import bindLeafletLayer from "@sigma/layer-leaflet";
import Graph from "graphology";
import { Attributes, SerializedGraph } from "graphology-types";
import Sigma from "sigma";

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

  bindLeafletLayer(renderer, {
    tileLayer: {
      urlTemplate: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });

  return () => {
    renderer.kill();
  };
};
