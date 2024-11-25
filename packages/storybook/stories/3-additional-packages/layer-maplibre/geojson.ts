/**
 * This story shows how to handle custom interactions with MapLibre when using @sigma/layer-maplibre.
 */
import bindMaplibreLayer, { graphToLatlng } from "@sigma/layer-maplibre";
import { FeatureCollection } from "geojson";
import Graph from "graphology";
import { Marker } from "maplibre-gl";
import Sigma from "sigma";

import geojson from "./data/sample-geojson.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const graph = new Graph();
  graph.addNode("b-cycle-51", { x: 0, y: 0, lat: 39.7471494, lng: -104.9998241, size: 20, color: "#e22352" });
  graph.addNode("b-cycle-52", { x: 0, y: 0, lat: 39.7502833, lng: -104.9983545, size: 20, color: "#e22352" });
  graph.addEdge("b-cycle-51", "b-cycle-52");

  // Initiate sigma
  const renderer = new Sigma(graph, container);
  const { map } = bindMaplibreLayer(renderer);

  // Add a geojson on the map
  map.once("load", () => {
    map.addSource("my_custom_source", { type: "geojson", data: geojson as FeatureCollection }).addLayer({
      id: "my_custom_layer",
      type: "line",
      source: "my_custom_source",
      paint: {
        "line-color": "#e22352",
        "line-width": 5,
      },
    });

    // When clicking on the stage of sigma,
    // create a marker on the map
    let markerOnClick: null | Marker = null;
    renderer.on("clickStage", (e) => {
      const graphCoords = renderer.viewportToGraph({ x: e.event.x, y: e.event.y });
      const geoCoords = graphToLatlng(map, graphCoords);
      if (!markerOnClick) {
        markerOnClick = new Marker();
        markerOnClick.setLngLat(geoCoords);
        markerOnClick.addTo(map);
      } else {
        markerOnClick.setLngLat(geoCoords);
      }
    });
  });

  return () => {
    renderer.kill();
  };
};
