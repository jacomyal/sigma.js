import Graph from "graphology";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { wait } from "./_test-helpers";

interface SigmaTestContext {
  sigma: Sigma;
  graph: Graph;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function getNodeAtPosition(sigma: Sigma, position: Coordinates): string | null {
  const hit = sigma["getHitAtPosition"](position);
  return hit && hit.kind === "node" ? hit.key : null;
}

function getHoveredNodes(sigma: Sigma): string {
  return ["bottom", "top"].filter((n) => sigma.getNodeState(n).isHovered).join(",") || "-";
}

function movePointer(sigma: Sigma, { x, y }: Coordinates): void {
  sigma.getMouseLayer().dispatchEvent(
    new PointerEvent("pointermove", {
      pointerType: "mouse",
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    }),
  );
}

describe("Hovering overlapping nodes (regression #1558)", () => {
  beforeEach<SigmaTestContext>(async (context) => {
    const graph = new Graph();
    graph.addNode("bottom", { x: 0, y: 0, size: 20, color: "blue" });
    graph.addNode("top", { x: 24, y: 0, size: 20, color: "red" });

    const container = createElement("div", {
      width: "400px",
      height: "400px",
    }) as HTMLDivElement;
    document.body.append(container);

    context.sigma = new Sigma(graph, container, { settings: { autoRescale: false } });
    context.graph = graph;
    context.sigma.refresh();
  });

  afterEach<SigmaTestContext>(async ({ sigma }) => {
    sigma.kill();
    sigma.getContainer().remove();
  });

  // Validate first that the two nodes do overlap
  test<SigmaTestContext>("the test nodes overlap partially", async ({ sigma, graph }) => {
    const bottom = sigma.graphToViewport(graph.getNodeAttributes("bottom") as Coordinates);
    const top = sigma.graphToViewport(graph.getNodeAttributes("top") as Coordinates);
    const overlap = { x: (bottom.x + top.x) / 2, y: (bottom.y + top.y) / 2 };

    expect(getNodeAtPosition(sigma, overlap)).toBe("top");
    expect(getNodeAtPosition(sigma, bottom)).toBe("bottom");
    expect(getNodeAtPosition(sigma, top)).toBe("top");

    // Move "top", to make sure "bottom" also hits the overlap position:
    graph.mergeNodeAttributes("top", { x: 100, y: 100 });
    sigma.refresh();
    expect(getNodeAtPosition(sigma, overlap)).toBe("bottom");
  });

  const entries = [
    { name: "in the same frame", framesOnBottom: 0 },
    { name: "one frame later", framesOnBottom: 1 },
    { name: "two frames later", framesOnBottom: 2 },
  ];

  for (const { name, framesOnBottom } of entries) {
    test<SigmaTestContext>(`hover stays stable when entering the overlap from the bottom node, ${name}`, async ({
      sigma,
      graph,
    }) => {
      const bottom = sigma.graphToViewport(graph.getNodeAttributes("bottom") as Coordinates);
      const top = sigma.graphToViewport(graph.getNodeAttributes("top") as Coordinates);
      const overlap = { x: (bottom.x + top.x) / 2, y: (bottom.y + top.y) / 2 };

      // Hover state as seen by each rendered frame
      const frames: string[] = [];
      sigma.on("afterRender", () => frames.push(getHoveredNodes(sigma)));

      movePointer(sigma, bottom);
      for (let i = 0; i < framesOnBottom; i++) await nextFrame();
      movePointer(sigma, overlap);

      // Let the hover resolve, then watch a still pointer
      await wait(300);
      const settled = frames.length;
      for (let i = 0; i < 60; i++) await nextFrame();

      const hovered = getHoveredNodes(sigma);
      expect(hovered).toMatch(/^(bottom|top)$/);
      expect(frames.slice(settled), "hover flickers between both nodes").toEqual(
        frames.slice(settled).map(() => hovered),
      );
    });
  }
});
