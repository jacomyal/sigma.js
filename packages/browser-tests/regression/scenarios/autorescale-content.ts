import Graph from "graphology";
import Sigma from "sigma";
import type { Settings } from "sigma/settings";
import { DEFAULT_STYLES } from "sigma/types";

const DEG = Math.PI / 180;

// prettier-ignore
const NODES = [
  { id: "right", x: 14,  y: 0,   size: 2, color: "#9242D5", label: "right · 14", labelPosition: "right", labelSize: 14, labelAngle: 22 * DEG },
  { id: "left",  x: -14, y: 0,   size: 5, color: "#5B8FF9", label: "left · 44",  labelPosition: "left",  labelSize: 44, labelAngle: 0 },
  { id: "above", x: 0,   y: 14,  size: 3, color: "#5AD8A6", label: "above · 22", labelPosition: "above", labelSize: 22, labelAngle: -16 * DEG },
  // Test that empty labels are not considered for the auto-rescale:
  { id: "below", x: 0,   y: -14, size: 4, color: "#E8684A", label: "",           labelPosition: "below", labelAngle: 0 },
];

export default (container: HTMLElement) => {
  const params = new URLSearchParams(location.search);
  // Defaults to the label-aware mode (the one whose framing depends on the box
  // math); the sidecar may still override it through the query string.
  const autoRescaleContent = (params.get("autoRescaleContent") ?? "labels") as Settings["autoRescaleContent"];

  const graph = new Graph();
  for (const node of NODES) graph.addNode(node.id, node);

  return new Sigma(graph, container, {
    styles: {
      nodes: [
        DEFAULT_STYLES.nodes,
        {
          labelColor: { attribute: "color" },
          labelSize: { attribute: "labelSize" },
          labelPosition: { attribute: "labelPosition", defaultValue: "right" },
          labelAngle: { attribute: "labelAngle" },
          labelBackgroundColor: "#ffffffcc",
          labelBackgroundPadding: 3,
          labelVisibility: "visible",
        },
      ],
    },
    settings: {
      itemSizesReference: "positions",
      stagePadding: 0,
      zoomToSizeRatioFunction: (x: number) => x,
      autoRescaleContent,
    },
  });
};
