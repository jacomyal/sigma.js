import Graph from "graphology";
import Sigma from "sigma";
import { NodePointProgram } from "sigma/rendering";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
}

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  graph.addNode("a", { type: "circle", x: 0, y: 0 });
  graph.addNode("b", { type: "circle", x: 10, y: 10 });
  graph.addEdge("a", "b", { type: "arrow" });
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.sigma = new Sigma(graph, container);
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("Sigma settings management", () => {
  test<SigmaTestContext>("it should refresh when settings are updated", async ({ sigma }) => {
    let count = 0;
    sigma.on("beforeRender", () => count++);

    expect(count).toEqual(0);
    sigma.setSetting("minEdgeThickness", 10);
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(count).toEqual(1);
  });

  test<SigmaTestContext>("it should update programs when they're updated", ({ sigma }) => {
    sigma.setSetting("nodeProgramClasses", { point: NodePointProgram });
    expect(() => sigma.refresh()).toThrow();

    const graph = sigma.getGraph();
    graph.forEachNode((node) => graph.setNodeAttribute(node, "type", "point"));
    expect(() => sigma.refresh()).not.toThrow();
  });
});
