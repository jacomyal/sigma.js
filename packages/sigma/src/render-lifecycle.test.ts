/**
 * Regression tests for the render() lifecycle.
 *
 * "coincide": process() and refreshState() both fire in the same frame. This
 * happens when graph mutations (e.g. moving a node during drag) trigger
 * needToProcess while state changes (e.g. clearing selection on drag start)
 * trigger needToRefreshState. Both run inside the same render() call:
 * process() first, then refreshState(). The final display data must reflect
 * the state changes — not silently discard them.
 *
 * "unchanged frame": render() is called again with nothing changed (e.g. an
 * animation loop driving a shader uniform). It must not redo work whose
 * inputs (label text, positions, camera) haven't changed.
 *
 * "pending refresh": a scheduled full refresh clears indices at once, but
 * only reprocesses items on the next frame. Picking must keep resolving
 * items in between.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { describe, expect, test } from "vitest";

import { findPickingPosition } from "./_test-helpers";

describe("Render lifecycle", () => {
  test("state changes are applied when graph mutations and state changes coincide", async () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10 });
    graph.addNode("n2", { x: 1, y: 1, size: 10 });
    graph.addEdge("n1", "n2");

    const container = createElement("div", { width: "100px", height: "100px" });
    document.body.append(container);

    const sigma = new Sigma(graph, container, {
      customNodeState: { isSelected: false },
      customGraphState: { selectionSize: 0 },
      styles: {
        nodes: [
          { color: "#666", size: 10 },
          {
            when: (_attrs, state, graphState) => !!graphState.selectionSize && !state.isSelected,
            then: { color: "#ccc" },
          },
          { whenState: "isSelected", then: { color: "#ff0000" } },
        ],
      },
    });

    // Select n1
    sigma.setNodeState("n1", { isSelected: true });
    sigma.setGraphState({ selectionSize: 1 });
    await new Promise((r) => requestAnimationFrame(r));

    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#ff0000");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#ccc");

    // Simulate drag-start of an unselected node:
    // 1. Clear selection (state change → needToRefreshState)
    // 2. Mutate graph attribute (→ graph listener → needToProcess)
    // Both happen in the same synchronous block, coalescing into one render.
    sigma.setNodeState("n1", { isSelected: false });
    sigma.setGraphState({ selectionSize: 0 });
    graph.setNodeAttribute("n2", "x", 2);

    // Wait for the coalesced render
    await new Promise((r) => requestAnimationFrame(r));

    // Both nodes should be back to default color
    expect(sigma.getNodeDisplayData("n1")?.color).toBe("#666");
    expect(sigma.getNodeDisplayData("n2")?.color).toBe("#666");

    sigma.kill();
    container.remove();
  });

  test("does not re-upload the label buffer on an unchanged frame", async () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10, label: "Hello" });

    const container = createElement("div", { width: "100px", height: "100px" });
    document.body.append(container);

    const sigma = new Sigma(graph, container, { settings: { DEBUG_logRenderStats: true } });

    // Simulate an animation loop calling render() again with nothing changed
    // (e.g. only a shader uniform driving an animated edge).
    sigma.scheduleRender();
    await new Promise((r) => requestAnimationFrame(r));

    const { labelProgram } = sigma["internals"];
    expect(labelProgram.debugStats.bufferUploadBytes).toBe(0);

    sigma.kill();
    container.remove();
  });

  test("an edge stays pickable between a scheduled full refresh and the next render", async () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0 });
    graph.addNode("n2", { x: 100, y: 100 });
    graph.addNode("n3", { x: 200, y: 0 });
    graph.addEdgeWithKey("e12", "n1", "n2");
    graph.addEdgeWithKey("e23", "n2", "n3");

    const container = createElement("div", { width: "200px", height: "200px" });
    document.body.append(container);

    const sigma = new Sigma(graph, container, { settings: { enableEdgeEvents: true } });
    await new Promise((r) => requestAnimationFrame(r));

    const internals = sigma["internals"];
    const position = findPickingPosition(sigma, "edge", "e12")!;
    expect(position).not.toBeNull();
    expect(internals.getHitAtPosition(position)).toEqual({ kind: "edge", key: "e12" });

    sigma.scheduleRefresh();

    expect(internals.getHitAtPosition(position)).toEqual({ kind: "edge", key: "e12" });

    sigma.kill();
    container.remove();
  });
});
