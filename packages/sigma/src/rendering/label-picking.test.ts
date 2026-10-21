import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { expect, test } from "vitest";

test.each(["node", "edge"] as const)("rendering %s labels does not produce WebGL errors", async (kind) => {
  const graph = new Graph();
  graph.addNode("n1", { x: 0, y: 0, size: 10, label: "Node 1" });
  graph.addNode("n2", { x: 100, y: 0, size: 10, label: "Node 2" });
  graph.addEdgeWithKey("e1", "n1", "n2", { label: "Edge 1" });

  const container = createElement("div", { width: "400px", height: "300px" });
  document.body.append(container);
  const sigma = new Sigma(graph, container, {
    settings: {
      renderLabels: kind === "node",
      renderEdgeLabels: kind === "edge",
      edgeLabelAnchors: "allNodes",
      labelRenderedSizeThreshold: 0,
      itemSizesReference: "screen",
    },
  });

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const labels = kind === "node" ? sigma.getNodeDisplayedLabels() : sigma.getEdgeDisplayedLabels();
    expect(labels.size).toBeGreaterThan(0);

    const gl = sigma.getWebGLContext();
    expect(gl.getError()).toBe(gl.NO_ERROR);
  } finally {
    sigma.kill();
    container.remove();
  }
});
