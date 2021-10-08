/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import data from "./euroSIS.json";
import iwanthue from "iwanthue";
import { Coordinates } from "sigma/types";

const container = document.getElementById("sigma-container") as HTMLElement;
const graph = Graph.from(data as SerializedGraph);

// cluster definition
interface Cluster {
  label: string;
  x?: number;
  y?: number;
  color?: string;
  positions: { x: number; y: number }[];
}

// initialize clusters from graph data
const countryClusters: { [key: string]: Cluster } = {};
graph.forEachNode((node, atts) => {
  if (!countryClusters[atts.country]) countryClusters[atts.country] = { label: atts.country, positions: [] };
});
// create and assign one color by cluster
const palette = iwanthue(Object.keys(countryClusters).length, { seed: "eurSISCountryClusters" });
for (const country in countryClusters) {
  countryClusters[country].color = palette.pop();
}

// change node appearance
graph.forEachNode((node, atts) => {
  const cluster = countryClusters[atts.country];
  // node color depends on the cluster it belongs to
  atts.color = cluster.color;
  // node size depends on its degree
  atts.size = Math.sqrt(graph.degree(node)) / 2;
  // store cluster's nodes positions to calculate cluster label position
  cluster.positions.push({ x: atts.x, y: atts.y });
});

// calculate the cluster's nodes barycenter to use this as cluster label position
for (const country in countryClusters) {
  countryClusters[country].x =
    countryClusters[country].positions.reduce((acc, p) => acc + p.x, 0) / countryClusters[country].positions.length;
  countryClusters[country].y =
    countryClusters[country].positions.reduce((acc, p) => acc + p.y, 0) / countryClusters[country].positions.length;
}

// initiate sigma
const renderer = new Sigma(graph, container);

// create the clustersLabel layer
const clustersLayer = document.createElement("div");
clustersLayer.id = "clustersLayer";
let clusterLabelsDoms = "";
for (const country in countryClusters) {
  // for each cluster create a div label
  const cluster = countryClusters[country];
  // adapt the position to viewport coordinates
  const viewportPos = renderer.graphToViewport(cluster as Coordinates);
  clusterLabelsDoms += `<div id='${cluster.label}' class="clusterLabel" style="top:${viewportPos.y}px;left:${viewportPos.x}px;color:${cluster.color}">${cluster.label}</div>`;
}
clustersLayer.innerHTML = clusterLabelsDoms;
// insert the layer underneath the hovers layer
container.insertBefore(clustersLayer, document.getElementsByClassName("sigma-hovers")[0]);

// Clusters labels position needs to be updated on each render
renderer.on("afterRender", () => {
  for (const country in countryClusters) {
    const cluster = countryClusters[country];
    const clusterLabel = document.getElementById(cluster.label);
    // update position from the viewport
    const viewportPos = renderer.graphToViewport(cluster as Coordinates);
    clusterLabel.style.top = `${viewportPos.y}px`;
    clusterLabel.style.left = `${viewportPos.x}px`;
  }
});
