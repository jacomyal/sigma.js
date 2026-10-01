import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
}

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  graph.addNode("n1", { x: 0, y: 0, size: 10 });
  graph.addNode("n2", { x: 1, y: 1, size: 10 });
  graph.addEdge("n1", "n2", { size: 1 });

  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.graph = graph;
  context.sigma = new Sigma(graph, container);
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("Sigma state management", () => {
  describe("Node state", () => {
    test<SigmaTestContext>("getNodeState returns default state for new nodes", ({ sigma }) => {
      const state = sigma.getNodeState("n1");
      expect(state.isHovered).toBe(false);
      expect(state.isHidden).toBe(false);
      expect(state.isHighlighted).toBe(false);
    });

    test<SigmaTestContext>("setNodeState updates node state", ({ sigma }) => {
      sigma.setNodeState("n1", { isHighlighted: true });
      const state = sigma.getNodeState("n1");
      expect(state.isHighlighted).toBe(true);
      expect(state.isHovered).toBe(false);
    });

    test<SigmaTestContext>("setNodeState merges partial state", ({ sigma }) => {
      sigma.setNodeState("n1", { isHighlighted: true });
      sigma.setNodeState("n1", { isHidden: true });
      const state = sigma.getNodeState("n1");
      expect(state.isHighlighted).toBe(true);
      expect(state.isHidden).toBe(true);
    });

    test<SigmaTestContext>("setNodeState with isHovered updates hoveredNode tracking", ({ sigma }) => {
      sigma.setNodeState("n1", { isHovered: true });
      const state = sigma.getNodeState("n1");
      expect(state.isHovered).toBe(true);

      // Setting another node as hovered should clear the previous one
      sigma.setNodeState("n2", { isHovered: true });
      expect(sigma.getNodeState("n1").isHovered).toBe(false);
      expect(sigma.getNodeState("n2").isHovered).toBe(true);
    });

    test<SigmaTestContext>("setNodesState batch updates multiple nodes", ({ sigma }) => {
      sigma.setNodesState(["n1", "n2"], { isHighlighted: true });
      expect(sigma.getNodeState("n1").isHighlighted).toBe(true);
      expect(sigma.getNodeState("n2").isHighlighted).toBe(true);
    });

    test<SigmaTestContext>("setNodeState normalizes non-string keys (regression #1454)", ({ sigma, graph }) => {
      graph.addNode(3, { x: 2, y: 2, size: 10 });

      // @ts-expect-error passing a number where a string is expected, on purpose
      sigma.setNodeState(3, { isHighlighted: true });
      expect(sigma.getNodeState("3").isHighlighted).toBe(true);

      // @ts-expect-error same as above
      expect(sigma.getNodeState(3).isHighlighted).toBe(true);
    });
  });

  describe("Edge state", () => {
    test<SigmaTestContext>("getEdgeState returns default state for edges", ({ sigma, graph }) => {
      const edgeKey = graph.edges()[0];
      const state = sigma.getEdgeState(edgeKey);
      expect(state.isHovered).toBe(false);
      expect(state.isHidden).toBe(false);
      expect(state.isHighlighted).toBe(false);
    });

    test<SigmaTestContext>("setEdgeState updates edge state", ({ sigma, graph }) => {
      const edgeKey = graph.edges()[0];
      sigma.setEdgeState(edgeKey, { isHighlighted: true });
      const state = sigma.getEdgeState(edgeKey);
      expect(state.isHighlighted).toBe(true);
    });

    test<SigmaTestContext>("setEdgeState with isHovered updates hoveredEdge tracking", ({ sigma, graph }) => {
      const edgeKey = graph.edges()[0];
      sigma.setEdgeState(edgeKey, { isHovered: true });
      expect(sigma.getEdgeState(edgeKey).isHovered).toBe(true);
    });

    test<SigmaTestContext>("setEdgeState normalizes non-string keys (regression #1454)", ({ sigma, graph }) => {
      graph.addNode("n3", { x: 2, y: 2, size: 10 });
      graph.addEdgeWithKey(7, "n1", "n3", { size: 1 });

      // @ts-expect-error passing a number where a string is expected, on purpose
      sigma.setEdgeState(7, { isHighlighted: true });
      expect(sigma.getEdgeState("7").isHighlighted).toBe(true);

      // @ts-expect-error same as above
      expect(sigma.getEdgeState(7).isHighlighted).toBe(true);
    });
  });

  describe("Graph state", () => {
    test<SigmaTestContext>("getGraphState returns default state", ({ sigma }) => {
      const state = sigma.getGraphState();
      expect(state.isIdle).toBe(true);
      expect(state.isPanning).toBe(false);
      expect(state.isZooming).toBe(false);
      expect(state.isDragging).toBe(false);
      expect(state.hasHovered).toBe(false);
      expect(state.hasHighlighted).toBe(false);
    });

    test<SigmaTestContext>("setGraphState updates graph state", ({ sigma }) => {
      sigma.setGraphState({ isPanning: true });
      const state = sigma.getGraphState();
      expect(state.isPanning).toBe(true);
      expect(state.isIdle).toBe(false);
    });

    test<SigmaTestContext>("graph state hasHovered updates when node is hovered", ({ sigma }) => {
      expect(sigma.getGraphState().hasHovered).toBe(false);
      sigma.setNodeState("n1", { isHovered: true });
      expect(sigma.getGraphState().hasHovered).toBe(true);
    });

    test<SigmaTestContext>("graph state hasHighlighted updates when node is highlighted", ({ sigma }) => {
      expect(sigma.getGraphState().hasHighlighted).toBe(false);
      sigma.setNodeState("n1", { isHighlighted: true });
      expect(sigma.getGraphState().hasHighlighted).toBe(true);
    });
  });

  describe("State cleanup", () => {
    test<SigmaTestContext>("node state is cleared when node is removed", ({ sigma, graph }) => {
      sigma.setNodeState("n1", { isHighlighted: true });
      expect(sigma.getNodeState("n1").isHighlighted).toBe(true);

      graph.dropNode("n1");
      sigma.refresh();

      // Getting state for removed node returns fresh default
      const state = sigma.getNodeState("n1");
      expect(state.isHighlighted).toBe(false);
    });

    test<SigmaTestContext>("edge state is cleared when edge is removed", ({ sigma, graph }) => {
      const edgeKey = graph.edges()[0];
      sigma.setEdgeState(edgeKey, { isHighlighted: true });
      expect(sigma.getEdgeState(edgeKey).isHighlighted).toBe(true);

      graph.dropEdge(edgeKey);
      sigma.refresh();

      // Getting state for removed edge returns fresh default
      const state = sigma.getEdgeState(edgeKey);
      expect(state.isHighlighted).toBe(false);
    });
  });
});
