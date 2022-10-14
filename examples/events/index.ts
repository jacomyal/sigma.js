/**
 * This example shows how to use node and edges events in sigma.
 */

import Graph from "graphology";
import Sigma from "sigma";
import { MouseCoords } from "sigma/types";

import data from "./data.json";

const container = document.getElementById("sigma-container") as HTMLElement;
const logsDOM = document.getElementById("sigma-logs") as HTMLElement;

const graph = new Graph();
graph.import(data);

function logEvent(event: string, itemType: "node" | "edge" | "positions", item: string | MouseCoords): void {
  const div = document.createElement("div");
  let message = `Event "${event}"`;
  if (item && itemType) {
    if (itemType === "positions") {
      item = item as MouseCoords;
      message += `, x ${item.x}, y ${item.y}`;
    } else {
      const label = itemType === "node" ? graph.getNodeAttribute(item, "label") : graph.getEdgeAttribute(item, "label");
      message += `, ${itemType} ${label || "with no label"} (id "${item}")`;

      if (itemType === "edge") {
        message += `, source ${graph.getSourceAttribute(item, "label")}, target: ${graph.getTargetAttribute(
          item,
          "label",
        )}`;
      }
    }
  }
  div.innerHTML = `<span>${message}</span>`;
  logsDOM.appendChild(div);
  logsDOM.scrollTo({ top: logsDOM.scrollHeight });

  if (logsDOM.children.length > 50) logsDOM.children[0].remove();
}

let hoveredEdge = null;
const renderer = new Sigma(graph, container, {
  enableEdgeClickEvents: true,
  enableEdgeWheelEvents: true,
  enableEdgeHoverEvents: "debounce",
  edgeReducer(edge, data) {
    const res = { ...data };
    if (edge === hoveredEdge) res.color = "#cc0000";
    return res;
  },
});

const nodeEvents = [
  "enterNode",
  "leaveNode",
  "downNode",
  "clickNode",
  "rightClickNode",
  "doubleClickNode",
  "wheelNode",
] as const;
const edgeEvents = ["downEdge", "clickEdge", "rightClickEdge", "doubleClickEdge", "wheelEdge"] as const;
const stageEvents = ["downStage", "clickStage", "doubleClickStage", "wheelStage"] as const;

nodeEvents.forEach((eventType) => renderer.on(eventType, ({ node }) => logEvent(eventType, "node", node)));
edgeEvents.forEach((eventType) => renderer.on(eventType, ({ edge }) => logEvent(eventType, "edge", edge)));

renderer.on("enterEdge", ({ edge }) => {
  logEvent("enterEdge", "edge", edge);
  hoveredEdge = edge;
  renderer.refresh();
});
renderer.on("leaveEdge", ({ edge }) => {
  logEvent("leaveEdge", "edge", edge);
  hoveredEdge = null;
  renderer.refresh();
});

stageEvents.forEach((eventType) => {
  renderer.on(eventType, ({ event }) => {
    logEvent(eventType, "positions", event);
  });
});
