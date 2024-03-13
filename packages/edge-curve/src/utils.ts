import Graph from "graphology";
import { EdgeDisplayData } from "sigma/types";

export type CurvedEdgeDisplayData = EdgeDisplayData & { curvature?: number };

export const DEFAULT_EDGE_CURVATURE = 0.25;

const DEFAULT_OPTIONS = {
  edgeIndexAttribute: "parallelIndex",
  edgeMaxIndexAttribute: "parallelMaxIndex",
};

/**
 * This function helps to identify parallel edges, to adjust their curvatures.
 */
export function indexParallelEdgesIndex(graph: Graph, options?: Partial<typeof DEFAULT_OPTIONS>): void {
  const opts = {
    ...DEFAULT_OPTIONS,
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

  let case1 = 0;
  let case2 = 0;
  let case3 = 0;

  // Store index attributes:
  for (const directedId in directedIndex) {
    const edges = directedIndex[directedId];
    const directedCount = edges.length;
    const undirectedCount = undirectedIndex[edgeUndirectedIDsMapping[directedId]].length;

    // If the edge is alone, in both side:
    if (directedCount === 1 && undirectedCount === 1) {
      case1++;
      const edge = edges[0];
      graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, null);
      graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, null);
    }

    // If the edge is alone, but there is at least one edge in the opposite direction:
    else if (directedCount === 1) {
      case2++;
      const edge = edges[0];
      graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, 0);
      graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, 1);
    }

    // If the edge is not alone:
    else {
      for (let i = 0; i < directedCount; i++) {
        case3++;
        const edge = edges[i];
        graph.setEdgeAttribute(edge, opts.edgeIndexAttribute, i);
        graph.setEdgeAttribute(edge, opts.edgeMaxIndexAttribute, directedCount);
      }
    }
  }
  console.log("case 1", case1);
  console.log("case 2", case2);
  console.log("case 3", case3);
}
