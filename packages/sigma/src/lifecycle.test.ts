import { EventEmitter } from "events";
import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
}

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.sigma = new Sigma(graph, container);
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("Sigma #kill method", () => {
  test<SigmaTestContext>("it should unbind all event listeners", ({ sigma }) => {
    const dispatcher = sigma as EventEmitter;

    const EVENT = "custom-event";
    let count = 0;
    dispatcher.addListener(EVENT, () => count++);

    dispatcher.emit(EVENT);
    expect(count).toEqual(1);

    sigma.kill();
    dispatcher.emit(EVENT);
    expect(count).toEqual(1);
  });

  test<SigmaTestContext>("it should do nothing when called multiple times", ({ sigma }) => {
    expect(() => {
      sigma.kill();
      sigma.kill();
    }).not.toThrow();
  });

  test<SigmaTestContext>('it should emit a "kill" event only the first time it\'s called', ({ sigma }) => {
    let count = 0;
    sigma.addListener("kill", () => count++);
    sigma.kill();
    sigma.kill();
    expect(count).toBe(1);
  });

  test<SigmaTestContext>("it should empty the container", ({ sigma }) => {
    sigma.kill();
    expect(sigma.getContainer().children.length).toBe(0);
  });

  test("it should cancel the refresh queued by an edge label atlas update", async () => {
    const graph = new Graph();
    graph.addNode("a", { x: 0, y: 0 });
    graph.addNode("b", { x: 1, y: 1 });
    graph.addEdge("a", "b", { label: "edge" });
    const container = createElement("div", { width: "100px", height: "100px" });
    document.body.append(container);

    // The first render generates the label glyphs, which queues a refresh
    const sigma = new Sigma(graph, container, {
      settings: { renderEdgeLabels: true },
      edgeReducer: (_key, data) => ({ ...data, labelVisibility: "visible" }),
    });
    sigma.kill();
    container.remove();

    const refresh = vi.spyOn(sigma, "refresh").mockImplementation(() => sigma);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(refresh).not.toHaveBeenCalled();
  });
});
