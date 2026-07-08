import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ForceAtlas2GPULayout, StopReason } from "./index";

interface TestContext {
  graph: Graph;
  sigma: Sigma;
  layout: ForceAtlas2GPULayout | null;
}

const CLUSTERS = 2;
const NODES_PER_CLUSTER = 6;

/**
 * Two cliques, with initial positions interleaved on a circle, so the layout
 * actually has work to do to separate them.
 */
function buildClusteredGraph(): Graph {
  const graph = new Graph();

  for (let c = 0; c < CLUSTERS; c++)
    for (let i = 0; i < NODES_PER_CLUSTER; i++) {
      const index = i * CLUSTERS + c;
      const angle = (index / (CLUSTERS * NODES_PER_CLUSTER)) * 2 * Math.PI;
      graph.addNode(`n${c}-${i}`, { x: Math.cos(angle), y: Math.sin(angle), size: 5 });
    }

  for (let c = 0; c < CLUSTERS; c++)
    for (let i = 0; i < NODES_PER_CLUSTER; i++)
      for (let j = i + 1; j < NODES_PER_CLUSTER; j++) graph.addEdge(`n${c}-${i}`, `n${c}-${j}`);

  return graph;
}

function waitForStop(layout: ForceAtlas2GPULayout): Promise<StopReason> {
  return new Promise((resolve) => layout.once("stopped", ({ reason }) => resolve(reason)));
}

function waitForRender(sigma: Sigma): Promise<void> {
  return new Promise((resolve) => sigma.once("afterRender", () => resolve()));
}

function getPositions(graph: Graph): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  graph.forEachNode((node, { x, y }) => {
    positions[node] = { x, y };
  });
  return positions;
}

beforeEach<TestContext>(async (context) => {
  context.graph = buildClusteredGraph();
  const container = createElement("div", { width: "200px", height: "200px" });
  document.body.append(container);
  context.sigma = new Sigma(context.graph, container);
  context.layout = null;
});

afterEach<TestContext>(async ({ sigma, layout }) => {
  layout?.kill();
  sigma.kill();
  sigma.getContainer().remove();
});

describe("ForceAtlas2GPULayout", () => {
  test<TestContext>("it should run the requested iterations, stop, and backport positions", async ({
    graph,
    sigma,
  }) => {
    const initialPositions = getPositions(graph);
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });

    const stopped = waitForStop(layout);
    layout.start(100);
    expect(layout.isRunning()).toBe(true);

    const reason = await stopped;
    expect(reason).toBe("iterations");
    expect(layout.isRunning()).toBe(false);
    expect(layout.getTotalIterations()).toBe(100);

    let movedCount = 0;
    graph.forEachNode((node, { x, y }) => {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
      const initial = initialPositions[node];
      if (Math.hypot(x - initial.x, y - initial.y) > 1e-6) movedCount++;
    });
    expect(movedCount).toBeGreaterThan(0);

    layout.kill();
  }, 20000);

  test<TestContext>("it should separate the two clusters", async ({ graph, sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });

    const stopped = waitForStop(layout);
    layout.start(300);
    await stopped;

    const positions = getPositions(graph);
    let intraSum = 0;
    let intraCount = 0;
    let interSum = 0;
    let interCount = 0;
    const nodes = graph.nodes();
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = positions[nodes[i]];
        const b = positions[nodes[j]];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const sameCluster = nodes[i].split("-")[0] === nodes[j].split("-")[0];
        if (sameCluster) {
          intraSum += distance;
          intraCount++;
        } else {
          interSum += distance;
          interCount++;
        }
      }

    expect(intraSum / intraCount).toBeLessThan(interSum / interCount);

    layout.kill();
  }, 20000);

  test<TestContext>("it should leave sigma's rendered positions consistent with graphology", async ({
    graph,
    sigma,
  }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });

    const stopped = waitForStop(layout);
    layout.start(100);
    await stopped;

    // The final backport schedules a regular sigma refresh; wait for it:
    await waitForRender(sigma);

    const normalizationFunction = sigma.getNormalizationFunction();
    graph.forEachNode((node, { x, y }) => {
      const displayData = sigma.getNodeDisplayData(node);
      expect(displayData).toBeDefined();
      const normalized = normalizationFunction({ x, y });
      expect(displayData!.x).toBeCloseTo(normalized.x, 5);
      expect(displayData!.y).toBeCloseTo(normalized.y, 5);
    });

    layout.kill();
  }, 20000);

  test<TestContext>("it should stop when the graph structure changes", async ({ graph, sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 5 });

    layout.start();
    expect(layout.isRunning()).toBe(true);

    // Let the layout actually iterate at least once:
    await waitForRender(sigma);

    const stopped = waitForStop(layout);
    graph.addNode("intruder", { x: 0, y: 0, size: 5 });
    const reason = await stopped;

    expect(reason).toBe("structure");
    expect(layout.isRunning()).toBe(false);
    // The intruder is unknown to the interrupted run, but must not break the
    // final backport:
    expect(graph.getNodeAttribute("intruder", "x")).toBe(0);

    layout.kill();
  }, 20000);

  test<TestContext>("it should support explicit quad-tree depth and theta", async ({ graph, sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, {
      iterationsPerFrame: 20,
      quadTreeDepth: 5,
      quadTreeTheta: 0.5,
    });

    const stopped = waitForStop(layout);
    layout.start(100);
    const reason = await stopped;

    expect(reason).toBe("iterations");
    graph.forEachNode((_node, { x, y }) => {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
    });

    layout.kill();
  }, 20000);

  test<TestContext>("it should be re-startable", async ({ sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });

    let stopped = waitForStop(layout);
    layout.start(50);
    await stopped;

    stopped = waitForStop(layout);
    layout.start(50);
    await stopped;

    expect(layout.getTotalIterations()).toBe(100);

    layout.kill();
  }, 20000);

  test<TestContext>("it should not move fixed nodes, while others still move", async ({ graph, sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });
    const FIXED_NODE = "n0-0";
    const initialPositions = getPositions(graph);

    layout.setNodeFixed(FIXED_NODE, true);
    expect(layout.isNodeFixed(FIXED_NODE)).toBe(true);

    const stopped = waitForStop(layout);
    layout.start(150);
    await stopped;

    // The fixed node did not move (up to the float32 GPU round-trip):
    expect(graph.getNodeAttribute(FIXED_NODE, "x")).toBeCloseTo(initialPositions[FIXED_NODE].x, 4);
    expect(graph.getNodeAttribute(FIXED_NODE, "y")).toBeCloseTo(initialPositions[FIXED_NODE].y, 4);

    // Its neighbors did:
    let movedCount = 0;
    graph.forEachNode((node, { x, y }) => {
      if (node === FIXED_NODE) return;
      const initial = initialPositions[node];
      if (Math.hypot(x - initial.x, y - initial.y) > 1e-3) movedCount++;
    });
    expect(movedCount).toBeGreaterThan(0);

    layout.kill();
  }, 20000);

  test<TestContext>('it should run an exact iterations count in "auto" mode too', async ({ sigma }) => {
    // Default settings: iterationsPerFrame is "auto":
    const layout = new ForceAtlas2GPULayout(sigma);

    const stopped = waitForStop(layout);
    layout.start(120);
    await stopped;

    expect(layout.getTotalIterations()).toBe(120);
    expect(layout.getCurrentIterationsPerFrame()).toBeGreaterThanOrEqual(1);
    expect(layout.getCurrentIterationsPerFrame()).toBeLessThanOrEqual(layout.getSettings().maxIterationsPerFrame);

    layout.kill();
  }, 20000);

  test<TestContext>("it should run headless with an iterations budget", async ({ graph, sigma }) => {
    const initialPositions = getPositions(graph);
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });

    const reason = await layout.run({ iterations: 100 });

    expect(reason).toBe("iterations");
    expect(layout.isRunning()).toBe(false);
    expect(layout.getTotalIterations()).toBe(100);

    let movedCount = 0;
    graph.forEachNode((node, { x, y }) => {
      const initial = initialPositions[node];
      if (Math.hypot(x - initial.x, y - initial.y) > 1e-6) movedCount++;
    });
    expect(movedCount).toBeGreaterThan(0);

    layout.kill();
  }, 20000);

  test<TestContext>("it should run headless with a duration budget", async ({ sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 5 });

    const start = performance.now();
    const reason = await layout.run({ duration: 300 });

    expect(reason).toBe("duration");
    expect(performance.now() - start).toBeGreaterThanOrEqual(300);
    expect(layout.getTotalIterations()).toBeGreaterThan(0);

    layout.kill();
  }, 20000);

  test<TestContext>("it should not break sigma once killed", async ({ sigma }) => {
    const layout = new ForceAtlas2GPULayout(sigma, { iterationsPerFrame: 20 });

    const stopped = waitForStop(layout);
    layout.start(20);
    await stopped;

    layout.kill();
    expect(() => layout.kill()).not.toThrow();
    expect(() => layout.start()).toThrow();
    expect(() => sigma.refresh()).not.toThrow();
  }, 20000);
});
