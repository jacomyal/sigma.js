import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { hoverNode } from "./_test-helpers";

function getLoseContext(gl: WebGL2RenderingContext) {
  return gl.getExtension("WEBGL_lose_context")!;
}

interface SigmaTestContext {
  sigma: Sigma;
  loseContext: ReturnType<typeof getLoseContext>;
}

const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
  nodes: [
    { key: "n1", attributes: { x: 0, y: 0, size: 10, color: "blue", label: "N1" } },
    { key: "n2", attributes: { x: 50, y: 50, size: 10, color: "red", label: "N2" } },
  ],
  edges: [{ source: "n1", target: "n2" }],
};

describe("Sigma WebGL context loss", () => {
  beforeEach<SigmaTestContext>(async (context) => {
    const graph = new Graph();
    graph.import(GRAPH);
    const container = createElement("div", { width: "300px", height: "300px" });
    document.body.append(container);
    context.sigma = new Sigma(graph, container);
    context.loseContext = getLoseContext(context.sigma.getWebGLContext());
  });

  afterEach<SigmaTestContext>(async ({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  test<SigmaTestContext>('it should emit "webglContextLost" and keep working as a no-op while lost', async ({
    sigma,
    loseContext,
  }) => {
    const lost = vi.fn();
    sigma.on("webglContextLost", lost);

    loseContext.loseContext();
    await vi.waitFor(() => expect(lost).toHaveBeenCalledOnce());

    expect(sigma.getWebGLContext().isContextLost()).toBe(true);
    expect(() => sigma.refresh()).not.toThrow();
  });

  test<SigmaTestContext>('it should emit "webglContextRestored", rebuild GPU resources and render again', async ({
    sigma,
    loseContext,
  }) => {
    const lost = vi.fn();
    const restored = vi.fn();
    const rendered = vi.fn();
    sigma.on("webglContextLost", lost);
    sigma.on("webglContextRestored", restored);

    loseContext.loseContext();
    // The browser only restores a canceled loss, so wait for sigma's handler
    await vi.waitFor(() => expect(lost).toHaveBeenCalledOnce());

    sigma.on("afterRender", rendered);
    loseContext.restoreContext();
    await vi.waitFor(() => expect(restored).toHaveBeenCalledOnce());
    await vi.waitFor(() => expect(rendered).toHaveBeenCalled());

    // Picking works again: hover resolution reads the rebuilt picking framebuffer
    await hoverNode(sigma, "n1");
  });
});
