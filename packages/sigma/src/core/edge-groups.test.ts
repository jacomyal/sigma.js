import Graph from "graphology";
import { describe, expect, test } from "vitest";

import { EdgeGroupIndex } from "./edge-groups";

function buildIndex(graph: Graph) {
  const counts: Record<string, { index: number; count: number }> = {};
  const index = new EdgeGroupIndex(graph, (edges, count) => {
    edges.forEach((edge, i) => (counts[edge] = { index: i, count }));
  });
  index.rebuild();
  return counts;
}

describe("EdgeGroupIndex #rebuild", () => {
  test("it should report single edges as groups of one", () => {
    const graph = new Graph({ multi: true, type: "directed" });
    graph.mergeEdgeWithKey("ab", "a", "b");
    graph.mergeEdgeWithKey("bc", "b", "c");

    expect(buildIndex(graph)).toEqual({ ab: { index: 0, count: 1 }, bc: { index: 0, count: 1 } });
  });

  test("it should keep edges of the same direction adjacent, canonical direction first", () => {
    const graph = new Graph({ multi: true, type: "directed" });
    graph.mergeEdgeWithKey("ab1", "a", "b");
    graph.mergeEdgeWithKey("ba1", "b", "a");
    graph.mergeEdgeWithKey("ba2", "b", "a");
    graph.mergeEdgeWithKey("ab2", "a", "b");

    expect(buildIndex(graph)).toEqual({
      ab1: { index: 0, count: 4 },
      ab2: { index: 1, count: 4 },
      ba1: { index: 2, count: 4 },
      ba2: { index: 3, count: 4 },
    });
  });
});
