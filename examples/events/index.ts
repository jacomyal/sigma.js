/**
 * This example shows how to use node and edges events in sigma.
 */

import Graph from "graphology";
import Sigma from "sigma";

import data from "./data.json";

const container = document.getElementById("sigma-container") as HTMLElement;
const logsDOM = document.getElementById("sigma-logs") as HTMLElement;

const graph = new Graph();
graph.import(data);

function logEvent(event: string, itemType?: "node" | "edge", item?: string): void {
  const div = document.createElement("div");
  let message = `Event "${event}"`;
  if (item && itemType) {
    const label = itemType === "node" ? graph.getNodeAttribute(item, "label") : graph.getEdgeAttribute(item, "label");
    message += `, ${itemType} ${label || "with no label"} (id "${item}")`;
  }
  div.innerHTML = `<span>${message}</span>`;
  logsDOM.appendChild(div);
  logsDOM.scrollTo({ top: logsDOM.scrollHeight });

  if (logsDOM.children.length > 50) logsDOM.children[0].remove();
}

const renderer = new Sigma(graph, container, {
  enableEdgeClickEvents: true,
  enableEdgeHoverEvents: 'debounce',
});

["enterNode", "leaveNode", "clickNode"].forEach((eventType) =>
  renderer.on(eventType, ({ node }) => logEvent(eventType, "node", node)),
);
["enterEdge", "leaveEdge", "clickEdge"].forEach((eventType) =>
  renderer.on(eventType, ({ edge }) => logEvent(eventType, "edge", edge)),
);
