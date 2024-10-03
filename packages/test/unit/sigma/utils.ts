import Graph, { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import choice from "pandemonium/choice";
import { graphExtent, validateGraph } from "sigma/utils";
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

describe("graphExtent utils", () => {
  test("it should work on a classic graph with multiple nodes", () => {
    const graph = new Graph();
    graph.import({
      nodes: [
        { key: "n1", attributes: { x: 0, y: 0, size: 5 } },
        { key: "n2", attributes: { x: 40, y: 0, size: 5 } },
        { key: "n3", attributes: { x: 0, y: 40, size: 5 } },
        { key: "n4", attributes: { x: 40, y: 40, size: 5 } },
      ],
    });

    expect(graphExtent(graph)).toEqual({
      x: [0, 40],
      y: [0, 40],
    });
  });

  test("it should work on a graph with all nodes with same x", () => {
    const graph = new Graph();
    graph.import({
      nodes: [
        { key: "n1", attributes: { x: 20, y: 0, size: 5 } },
        { key: "n2", attributes: { x: 20, y: 40, size: 5 } },
      ],
    });

    expect(graphExtent(graph)).toEqual({
      x: [20, 20],
      y: [0, 40],
    });
  });

  test("it should work on a graph with all nodes with same y", () => {
    const graph = new Graph();
    graph.import({
      nodes: [
        { key: "n1", attributes: { x: 0, y: 20, size: 5 } },
        { key: "n2", attributes: { x: 40, y: 20, size: 5 } },
      ],
    });

    expect(graphExtent(graph)).toEqual({
      x: [0, 40],
      y: [20, 20],
    });
  });

  test("it should work on a graph with only one node", () => {
    const graph = new Graph();
    graph.import({
      nodes: [{ key: "n1", attributes: { x: 12, y: 34, size: 5 } }],
    });

    expect(graphExtent(graph)).toEqual({
      x: [12, 12],
      y: [34, 34],
    });
  });

  test("it should return some placeholder extents for empty graphs", () => {
    const graph = new Graph();

    expect(graphExtent(graph)).toEqual({
      x: [0, 1],
      y: [0, 1],
    });
  });
});
