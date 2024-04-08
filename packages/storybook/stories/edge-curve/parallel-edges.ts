import { DEFAULT_EDGE_CURVATURE, EdgeCurvedArrowProgram, indexParallelEdgesIndex } from "@sigma/edge-curve";
import { MultiGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Create a graph, with various parallel edges:
  const graph = new MultiGraph();

  graph.addNode("a", { x: 0, y: 0, size: 10, label: "Alexandra" });
  graph.addNode("b", { x: 1, y: -1, size: 20, label: "Bastian" });
  graph.addNode("c", { x: 3, y: -2, size: 10, label: "Charles" });
  graph.addNode("d", { x: 1, y: -3, size: 10, label: "Dorothea" });
  graph.addNode("e", { x: 3, y: -4, size: 20, label: "Ernestine" });
  graph.addNode("f", { x: 4, y: -5, size: 10, label: "Fabian" });

  graph.addEdge("a", "b", { size: 2 });
  graph.addEdge("b", "c");
  graph.addEdge("b", "d");
  graph.addEdge("c", "b", { size: 3 });
  graph.addEdge("c", "e", { size: 3 });
  graph.addEdge("d", "c");
  graph.addEdge("d", "e");
  graph.addEdge("d", "e", { size: 2 });
  graph.addEdge("d", "e");
  graph.addEdge("d", "e");
  graph.addEdge("e", "d", { size: 2 });
  graph.addEdge("e", "f", { size: 2 });
  graph.addEdge("f", "e");
  graph.addEdge("f", "e");

  // Use dedicated helper to identify parallel edges:
  indexParallelEdgesIndex(graph, { edgeIndexAttribute: "parallelIndex", edgeMaxIndexAttribute: "parallelMaxIndex" });

  // Adapt types and curvature of parallel edges for rendering:
  graph.forEachEdge(
    (
      edge,
      {
        parallelIndex,
        parallelMaxIndex,
      }: { parallelIndex: number; parallelMaxIndex: number } | { parallelIndex?: null; parallelMaxIndex?: null },
    ) => {
      if (typeof parallelIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: "curved",
          curvature: DEFAULT_EDGE_CURVATURE + (3 * DEFAULT_EDGE_CURVATURE * parallelIndex) / parallelMaxIndex,
        });
      } else {
        graph.setEdgeAttribute(edge, "type", "straight");
      }
    },
  );

  const renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    defaultEdgeType: "straight",
    edgeProgramClasses: {
      straight: EdgeArrowProgram,
      curved: EdgeCurvedArrowProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
