/**
 * Regression tests for the `autoRescale` setting.
 *
 * "once" bug: after a window resize, the graph appeared massively zoomed in,
 * with node sizes out of proportion. Resizes trigger a full refresh, which
 * was resetting the extent to a dummy [0, 1] square, and since "once" skips
 * recomputation after the initial fit, the dummy extent leaked into the
 * normalization. The frozen extent must survive full refreshes. Only
 * swapping the graph unfreezes it now, so the new graph gets its own
 * initial fit.
 *
 * `false` bug (#1491): the extent was re-centered on the nodes' bounding box
 * on every process cycle, so adding or moving a node beyond the bbox shifted
 * the whole view. The mapping is now a constant: 1 graph unit = 1 pixel,
 * origin at the viewport center.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { Settings } from "sigma/settings";
import { createElement } from "sigma/utils";
import { describe, expect, test } from "vitest";

function createSigma(graph: Graph, settings: Partial<Settings> = { autoRescale: "once" }): Sigma {
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  return new Sigma(graph, container, { settings });
}

describe('autoRescale: "once"', () => {
  test("the frozen extent survives a full refresh", () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10 });
    graph.addNode("n2", { x: 100, y: 100, size: 10 });
    graph.addEdge("n1", "n2");

    const sigma = createSigma(graph);

    const before = sigma.graphToViewport({ x: 100, y: 100 });

    // Same code path as the window "resize" handler:
    sigma.refresh();

    const after = sigma.graphToViewport({ x: 100, y: 100 });
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);

    sigma.kill();
    sigma.getContainer().remove();
  });

  test("setGraph unfreezes the extent so the new graph gets its own fit", () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10 });
    graph.addNode("n2", { x: 1, y: 1, size: 10 });

    const sigma = createSigma(graph);

    const bigger = new Graph();
    bigger.addNode("n1", { x: 0, y: 0, size: 10 });
    bigger.addNode("n2", { x: 1000, y: 1000, size: 10 });
    sigma.setGraph(bigger);

    // With the old frozen extent (spanning 1 unit), (1000, 1000) would map
    // ~1000 viewport widths away. With a proper re-fit it stays in view.
    const { width, height } = sigma.getDimensions();
    const position = sigma.graphToViewport({ x: 1000, y: 1000 });
    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.x).toBeLessThanOrEqual(width);
    expect(position.y).toBeGreaterThanOrEqual(0);
    expect(position.y).toBeLessThanOrEqual(height);

    sigma.kill();
    sigma.getContainer().remove();
  });
});

describe("autoRescale: false", () => {
  test("graph coordinates are pixels, with the origin at the viewport center", () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10 });

    const sigma = createSigma(graph, { autoRescale: false });

    // 100x100 container, y axis pointing up:
    const origin = sigma.graphToViewport({ x: 0, y: 0 });
    expect(origin.x).toBeCloseTo(50);
    expect(origin.y).toBeCloseTo(50);
    const right = sigma.graphToViewport({ x: 10, y: 0 });
    expect(right.x).toBeCloseTo(60);
    expect(right.y).toBeCloseTo(50);
    const up = sigma.graphToViewport({ x: 0, y: 10 });
    expect(up.x).toBeCloseTo(50);
    expect(up.y).toBeCloseTo(40);

    sigma.kill();
    sigma.getContainer().remove();
  });

  test("adding a node outside the bounding box does not shift the view", () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10 });
    graph.addNode("n2", { x: 20, y: 20, size: 10 });

    const sigma = createSigma(graph, { autoRescale: false });

    const before = sigma.graphToViewport({ x: 0, y: 0 });

    graph.addNode("n3", { x: -500, y: 300, size: 10 });
    sigma.refresh();

    const after = sigma.graphToViewport({ x: 0, y: 0 });
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);

    sigma.kill();
    sigma.getContainer().remove();
  });
});
