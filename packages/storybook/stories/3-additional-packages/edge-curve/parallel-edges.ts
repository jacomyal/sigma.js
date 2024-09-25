import { DEFAULT_EDGE_CURVATURE, EdgeCurvedArrowProgram, indexParallelEdgesIndex } from "@sigma/edge-curve";
import { MultiGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";

function getCurvature(index: number, maxIndex: number): number {
  if (maxIndex <= 0) throw new Error("Invalid maxIndex");
  if (index < 0) return -getCurvature(-index, maxIndex);
  const amplitude = 3.5;
  const maxCurvature = amplitude * (1 - Math.exp(-maxIndex / amplitude)) * DEFAULT_EDGE_CURVATURE;
  return (maxCurvature * index) / maxIndex;
}

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Create a graph, with various parallel edges:
  const graph = new MultiGraph();

  graph.addNode("a1", { x: 0, y: 0, size: 10 });
  graph.addNode("b1", { x: 10, y: 0, size: 20 });
  graph.addNode("c1", { x: 20, y: 0, size: 10 });
  graph.addNode("d1", { x: 30, y: 0, size: 10 });
  graph.addNode("e1", { x: 40, y: 0, size: 20 });
  graph.addNode("a2", { x: 0, y: -10, size: 20 });
  graph.addNode("b2", { x: 10, y: -10, size: 10 });
  graph.addNode("c2", { x: 20, y: -10, size: 10 });
  graph.addNode("d2", { x: 30, y: -10, size: 20 });
  graph.addNode("e2", { x: 40, y: -10, size: 10 });

  // Parallel edges in the same direction:
  graph.addEdge("a1", "b1", { size: 6 });
  graph.addEdge("b1", "c1", { size: 3 });
  graph.addEdge("b1", "c1", { size: 6 });
  graph.addEdge("c1", "d1", { size: 3 });
  graph.addEdge("c1", "d1", { size: 6 });
  graph.addEdge("c1", "d1", { size: 10 });
  graph.addEdge("d1", "e1", { size: 3 });
  graph.addEdge("d1", "e1", { size: 6 });
  graph.addEdge("d1", "e1", { size: 10 });
  graph.addEdge("d1", "e1", { size: 3 });
  graph.addEdge("d1", "e1", { size: 10 });

  // Parallel edges in both directions:
  graph.addEdge("a2", "b2", { size: 3 });
  graph.addEdge("b2", "a2", { size: 6 });

  graph.addEdge("b2", "c2", { size: 6 });
  graph.addEdge("b2", "c2", { size: 10 });
  graph.addEdge("c2", "b2", { size: 3 });
  graph.addEdge("c2", "b2", { size: 3 });

  graph.addEdge("c2", "d2", { size: 3 });
  graph.addEdge("c2", "d2", { size: 6 });
  graph.addEdge("c2", "d2", { size: 6 });
  graph.addEdge("c2", "d2", { size: 10 });
  graph.addEdge("d2", "c2", { size: 3 });

  graph.addEdge("d2", "e2", { size: 3 });
  graph.addEdge("d2", "e2", { size: 3 });
  graph.addEdge("d2", "e2", { size: 3 });
  graph.addEdge("d2", "e2", { size: 6 });
  graph.addEdge("d2", "e2", { size: 10 });
  graph.addEdge("e2", "d2", { size: 3 });
  graph.addEdge("e2", "d2", { size: 3 });
  graph.addEdge("e2", "d2", { size: 6 });
  graph.addEdge("e2", "d2", { size: 6 });
  graph.addEdge("e2", "d2", { size: 10 });

  // Use dedicated helper to identify parallel edges:
  indexParallelEdgesIndex(graph, {
    edgeIndexAttribute: "parallelIndex",
    edgeMinIndexAttribute: "parallelMinIndex",
    edgeMaxIndexAttribute: "parallelMaxIndex",
  });

  // Adapt types and curvature of parallel edges for rendering:
  graph.forEachEdge(
    (
      edge,
      {
        parallelIndex,
        parallelMinIndex,
        parallelMaxIndex,
      }:
        | { parallelIndex: number; parallelMinIndex?: number; parallelMaxIndex: number }
        | { parallelIndex?: null; parallelMinIndex?: null; parallelMaxIndex?: null },
    ) => {
      if (typeof parallelMinIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: parallelIndex ? "curved" : "straight",
          curvature: getCurvature(parallelIndex, parallelMaxIndex),
        });
      } else if (typeof parallelIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: "curved",
          curvature: getCurvature(parallelIndex, parallelMaxIndex),
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

  return () => {
    renderer.kill();
  };
};
