import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
}

function nextRender(sigma: Sigma): Promise<void> {
  return new Promise<void>((resolve) => sigma.once("afterRender", () => resolve()));
}

describe("Edge label programs", () => {
  beforeEach<SigmaTestContext>((context) => {
    const graph = new Graph();
    graph.addNode("a", { x: 0, y: 0 });
    graph.addNode("b", { x: 1, y: 1 });
    graph.addEdgeWithKey("ab", "a", "b", { label: "edge" });
    const container = createElement("div", { width: "100px", height: "100px" });
    document.body.append(container);

    context.sigma = new Sigma(graph, container, {
      edgeReducer: (_key, data) => ({ ...data, labelVisibility: "visible" }),
    });
  });

  afterEach<SigmaTestContext>(({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  test<SigmaTestContext>("they should render edge labels enabled after construction", async ({ sigma }) => {
    expect(sigma.getEdgeDisplayedLabels().size).toEqual(0);

    sigma.setSettings({ renderEdgeLabels: true });
    await nextRender(sigma);
    expect([...sigma.getEdgeDisplayedLabels()]).toEqual(["ab"]);
  });

  test<SigmaTestContext>("they should render edge labels again after a WebGL context restore", async ({ sigma }) => {
    sigma.setSettings({ renderEdgeLabels: true });
    await nextRender(sigma);

    const loseContext = sigma.getWebGLContext().getExtension("WEBGL_lose_context")!;
    const lost = vi.fn();
    const restored = vi.fn();
    sigma.on("webglContextLost", lost);
    sigma.on("webglContextRestored", restored);

    loseContext.loseContext();
    await vi.waitFor(() => expect(lost).toHaveBeenCalledOnce());

    const rendered = nextRender(sigma);
    loseContext.restoreContext();
    await vi.waitFor(() => expect(restored).toHaveBeenCalledOnce());
    await rendered;
    expect([...sigma.getEdgeDisplayedLabels()]).toEqual(["ab"]);
  });

  test<SigmaTestContext>("they should not prevent killing sigma before edge labels are ever rendered", ({ sigma }) => {
    expect(() => sigma.kill()).not.toThrow();
  });
});
