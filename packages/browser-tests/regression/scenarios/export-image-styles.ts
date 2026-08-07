// Image export must reproduce the source renderer's declarative styles.
//
// Left: a 6-nodes graph styled through a `styles` declaration (sizes, colors,
// labels and label positions all driven by non-default attributes).
//
// Right: the PNG returned by `@sigma/export-image` for that same renderer, at
// the same size and camera. Both halves must be pixel-identical. Any
// difference means the export dropped part of the source renderer's
// configuration.
import { toBlob } from "@sigma/export-image";
import Graph from "graphology";
import Sigma from "sigma";
import { DEFAULT_STYLES } from "sigma/types";

const NODES = [
  { key: "a", x: 0, y: 0, weight: 14, group: "source", name: "Alpha" },
  { key: "b", x: 200, y: -120, weight: 22, group: "source", name: "Bravo" },
  { key: "c", x: 400, y: -40, weight: 10, group: "source", name: "Charlie" },
  { key: "d", x: 60, y: -300, weight: 18, group: "target", name: "Delta" },
  { key: "e", x: 280, y: -380, weight: 26, group: "target", name: "Echo" },
  { key: "f", x: 460, y: -280, weight: 12, group: "target", name: "Foxtrot" },
];

const EDGES: [string, string, number][] = [
  ["a", "d", 2],
  ["a", "e", 6],
  ["b", "d", 4],
  ["b", "e", 2],
  ["b", "f", 8],
  ["c", "e", 3],
  ["c", "f", 5],
];

function buildGraph(): Graph {
  const graph = new Graph();
  for (const { key, ...attributes } of NODES) graph.addNode(key, attributes);
  for (const [source, target, weight] of EDGES) graph.addEdge(source, target, { weight });
  return graph;
}

export default async (container: HTMLElement) => {
  container.style.display = "flex";
  container.style.background = "#ffffff";

  const liveContainer = document.createElement("div");
  liveContainer.style.flex = "1";
  liveContainer.style.minWidth = "0";
  container.appendChild(liveContainer);

  const exportContainer = document.createElement("div");
  exportContainer.style.flex = "1";
  exportContainer.style.minWidth = "0";
  container.appendChild(exportContainer);

  const renderer = new Sigma(buildGraph(), liveContainer, {
    styles: {
      nodes: [
        DEFAULT_STYLES.nodes,
        {
          size: { attribute: "weight" },
          label: { attribute: "name" },
          labelSize: 14,
          labelColor: "#222222",
          labelVisibility: "visible",
        },
        {
          matchData: "group",
          cases: {
            source: { color: "#e22653", labelPosition: "above" },
            target: { color: "#2653e2", labelPosition: "below" },
          },
        },
      ],
      edges: [
        DEFAULT_STYLES.edges,
        {
          size: { attribute: "weight" },
          color: "#9a9a9a",
        },
      ],
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  const blob = await toBlob(renderer, { format: "png", backgroundColor: "#ffffff" });
  const image = new Image();
  image.style.display = "block";
  image.style.width = "100%";
  image.style.height = "100%";
  image.src = URL.createObjectURL(blob);
  await image.decode();
  exportContainer.appendChild(image);

  return renderer;
};
