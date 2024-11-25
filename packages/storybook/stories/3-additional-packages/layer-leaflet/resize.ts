/**
 * This story shows how to handle resizing with @sigma/layer-leaflet.
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
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });

  let isSmall = false;
  const toggleButton = document.createElement("button");
  toggleButton.innerText = "Toggle fullscreen";
  toggleButton.style.position = "absolute";
  toggleButton.style.zIndex = "1";
  toggleButton.onclick = () => {
    container.style.width = isSmall ? "100%" : "50%";
    container.style.height = isSmall ? "100%" : "50%";
    renderer.refresh({ schedule: false });
    isSmall = !isSmall;
  };
  container.appendChild(toggleButton);

  return () => {
    renderer.kill();
  };
};
