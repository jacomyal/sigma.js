import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
}

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  graph.addNode("a", { x: 0, y: 0 });
  graph.addNode("b", { x: 1, y: 1 });
  graph.addEdge("a", "b");
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.sigma = new Sigma(graph, container);
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("Sigma #addCustomLayerProgram method", () => {
  test<SigmaTestContext>("it should load the layer data and render it, without reprocessing unchanged graph data", async ({
    sigma,
  }) => {
    let processCount = 0;
    let cacheDataCount = 0;
    let renderCount = 0;
    sigma.on("beforeProcess", () => processCount++);

    sigma.addCustomLayerProgram("test", "nodes", () => ({
      render: () => renderCount++,
      kill: () => {},
      cacheData: () => cacheDataCount++,
    }));

    expect(cacheDataCount).toEqual(1);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(renderCount).toEqual(1);
    expect(processCount).toEqual(0);
  });
});
