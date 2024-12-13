import Graph from "graphology";
import { Attributes } from "graphology-types";
import { EdgeLabelDrawingFunction } from "sigma/rendering";

export const DEFAULT_EDGE_CURVATURE = 0.25;

export type CreateEdgeCurveProgramOptions<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = {
  // If 0, then edges have no arrow head. Else, the head is as long as this ratio times the thickness.
  curvatureAttribute: string;
  defaultCurvature: number;
  arrowHead: null | {
    extremity: "target" | "source" | "both";
    lengthToThicknessRatio: number;
    widenessToThicknessRatio: number;
  };
  // Allows overriding drawLabel returned class method.
  drawLabel?: EdgeLabelDrawingFunction<N, E, G> | undefined;
};

export const DEFAULT_EDGE_CURVE_PROGRAM_OPTIONS: CreateEdgeCurveProgramOptions = {
  arrowHead: null,
  curvatureAttribute: "curvature",
  defaultCurvature: DEFAULT_EDGE_CURVATURE,
};

/**
 * This function helps to identify parallel edges, to adjust their curvatures.
 */
export const DEFAULT_INDEX_PARALLEL_EDGES_OPTIONS = {
  edgeIndexAttribute: "parallelIndex",
  edgeMinIndexAttribute: "parallelMinIndex",
  edgeMaxIndexAttribute: "parallelMaxIndex",
};
export function indexParallelEdgesIndex(
  graph: Graph,
  options?: Partial<typeof DEFAULT_INDEX_PARALLEL_EDGES_OPTIONS>,
): void {
  const opts = {
    ...DEFAULT_INDEX_PARALLEL_EDGES_OPTIONS,
    ...(options || {}),
  };

  const nodeIDsMapping: Record<string, string> = {};
  const edgeDirectedIDsMapping: Record<string, string> = {};
  const edgeUndirectedIDsMapping: Record<string, string> = {};

  // Normalize IDs:
  let incr = 0;
  graph.forEachNode((node) => {
    nodeIDsMapping[node] = ++incr + "";
  });
  graph.forEachEdge((edge, _attrs, source, target) => {
    const sourceId = nodeIDsMapping[source];
    const targetId = nodeIDsMapping[target];
    const directedId = [sourceId, targetId].join("-");
    edgeDirectedIDsMapping[edge] = directedId;
    edgeUndirectedIDsMapping[directedId] = [sourceId, targetId].sort().join("-");
  });

  // Index edge unique IDs, only based on their extremities:
  const directedIndex: Record<string, string[]> = {};
  const undirectedIndex: Record<string, string[]> = {};
  graph.forEachEdge((edge) => {
    const directedId = edgeDirectedIDsMapping[edge];
    const undirectedId = edgeUndirectedIDsMapping[directedId];

    directedIndex[directedId] = directedIndex[directedId] || [];
    directedIndex[directedId].push(edge);
    undirectedIndex[undirectedId] = undirectedIndex[undirectedId] || [];
    undirectedIndex[undirectedId].push(edge);
  });

  // Store index attributes:
  for (const directedId in directedIndex) {
    const edges = directedIndex[directedId];
    const directedCount = edges.length;
    const undirectedCount = undirectedIndex[edgeUndirectedIDsMapping[directedId]].length;

    // If the edge is alone, in both side:
    if (directedCount === 1 && undirectedCount === 1) {
      const edge = edges[0];
      graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, null);
      graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, null);
    }

    // If the edge is alone, but there is at least one edge in the opposite direction:
    else if (directedCount === 1) {
      const edge = edges[0];
      graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, 1);
      graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, 1);
    }

    // If the edge is not alone, and all edges are in the same direction:
    else if (directedCount === undirectedCount) {
      const max = (directedCount - 1) / 2;
      const min = -max;
      for (let i = 0; i < directedCount; i++) {
        const edge = edges[i];
        const edgeIndex = -(directedCount - 1) / 2 + i;
        graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, edgeIndex);
        graph.setEdgeAttribute(edge, opts.edgeMinIndexAttribute, min);
        graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, max);
      }
    }

    // If the edge is not alone, and there are edges in both directions:
    else {
      for (let i = 0; i < directedCount; i++) {
        const edge = edges[i];
        graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, i + 1);
        graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, directedCount);
      }
    }
  }
}
