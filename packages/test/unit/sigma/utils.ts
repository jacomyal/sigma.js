import Graph, { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import choice from "pandemonium/choice";
import { validateGraph } from "sigma/utils";
import { describe, expect, test } from "vitest";

describe("validateGraph utils", () => {
  test("it should work on a valid graph", () => {
    // Create a valid random graph
    const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });
    randomLayout.assign(graph);

    // Test
    expect(() => {
      validateGraph(graph);
    }).not.toThrow();
  });
  test("it should throw an error if graph is not a valid graphology instance", () => {
    expect(() => {
      validateGraph(null as unknown as Graph);
      validateGraph(undefined as unknown as Graph);
      validateGraph({} as unknown as Graph);
    }).toThrow();
  });

  test("it should throw an error if a node is missing a coordinate", () => {
    // Create a valid random graph
    const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });
    randomLayout.assign(graph);

    // Get a random node, and remove its 'x' attribute
    const nodeKey = choice(graph.nodes());
    graph.removeNodeAttribute(nodeKey, "x");

    // Test
    expect(() => {
      validateGraph(graph);
    }).toThrow();
  });
});
