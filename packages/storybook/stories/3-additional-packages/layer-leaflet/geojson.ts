/**
 * This story shows how to handle custom interactions with Leaflet when using @sigma/layer-leaflet.
 */
import bindLeafletLayer, { graphToLatlng } from "@sigma/layer-leaflet";
import { FeatureCollection } from "geojson";
import Graph from "graphology";
import L from "leaflet";
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
  const { map } = bindLeafletLayer(renderer);

  // Add a geojson on the map
  L.geoJSON(geojson as FeatureCollection).addTo(map);

  // When clicking on the stage of sigma,
  // create a marker on the map
  let markerOnClick: null | L.Marker = null;
  renderer.on("clickStage", (e) => {
    const graphCoords = renderer.viewportToGraph({ x: e.event.x, y: e.event.y });
    const geoCoords = graphToLatlng(map, graphCoords);
    if (markerOnClick) markerOnClick.remove();
    markerOnClick = L.marker(geoCoords);
    markerOnClick.addTo(map);
  });

  return () => {
    renderer.kill();
  };
};
