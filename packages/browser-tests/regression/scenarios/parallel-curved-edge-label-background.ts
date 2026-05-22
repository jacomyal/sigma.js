// A curved edge's label background does not line up with its label text.
//
// It only happens when the graph also has a straight labelled edge, and the
// curved edges are drawn on top of it (on a higher depth layer). Here, a
// straight "anchor" edge with two curved edges above it, all carrying a label
// background. The curved edges' backgrounds are then drawn with the wrong
// curve and drift away from their text. Remove the straight edge and the
// backgrounds line up again.
import Graph from "graphology";
import Sigma from "sigma";
import { layerFill, layerPlain, pathCurved, pathLine } from "sigma/rendering";
import { DEFAULT_STYLES } from "sigma/types";

export default (container: HTMLElement) => {
  const graph = new Graph({ multi: true });

  graph.addNode("anchorL", { x: -3, y: 1.6, size: 0.5, color: "#8a97a8", label: "" });
  graph.addNode("anchorR", { x: 3, y: 1.6, size: 0.5, color: "#8a97a8", label: "" });
  graph.addNode("parL", { x: -3, y: -1.6, size: 0.5, color: "#3b6fd4", label: "" });
  graph.addNode("parR", { x: 3, y: -1.6, size: 0.5, color: "#3b6fd4", label: "" });

  graph.addEdge("anchorL", "anchorR", {
    size: 0.2,
    color: "#9aa7b8",
    label: "anchor label",
    path: "straight",
    curvature: 0,
    layer: "edges",
    labelBackgroundColor: "#ffdede",
  });

  graph.addEdge("parL", "parR", {
    size: 0.2,
    color: "#5B8FF9",
    label: "curved label one",
    path: "curved",
    curvature: 0.6,
    layer: "topEdges",
    labelBackgroundColor: "#d4e2ff",
  });
  graph.addEdge("parL", "parR", {
    size: 0.2,
    color: "#5B8FF9",
    label: "curved label two",
    path: "curved",
    curvature: -0.6,
    layer: "topEdges",
    labelBackgroundColor: "#d4e2ff",
  });

  return new Sigma(graph, container, {
    primitives: {
      nodes: { layers: [layerFill()] },
      edges: { paths: [pathLine(), pathCurved()], layers: [layerPlain()], label: { color: "#1c1c1c" } },
    },
    styles: {
      nodes: { ...DEFAULT_STYLES.nodes, color: { attribute: "color" }, size: { attribute: "size" } },
      edges: [
        DEFAULT_STYLES.edges,
        {
          color: { attribute: "color" },
          size: { attribute: "size" },
          path: { attribute: "path" },
          depth: { attribute: "layer" },
          labelDepth: { attribute: "layer" },
          labelVisibility: "visible",
          labelBackgroundColor: { attribute: "labelBackgroundColor" },
          labelBackgroundPadding: 6,
        },
      ],
    },
    settings: { renderEdgeLabels: true, itemSizesReference: "positions", autoRescale: true },
  });
};
