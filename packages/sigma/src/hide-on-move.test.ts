import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { describe, expect, test, vi } from "vitest";

import { simulateMouseEvent } from "./_test-helpers";

describe("hideLabelsOnMove", () => {
  test("node labels are not rendered while panning", async () => {
    const graph = new Graph();
    graph.addNode("n1", { x: 0, y: 0, size: 10, label: "Node 1" });
    graph.addNode("n2", { x: 100, y: 100, size: 10, label: "Node 2" });

    const container = createElement("div", { width: "300px", height: "300px" });
    document.body.append(container);

    const sigma = new Sigma(graph, container, { settings: { hideLabelsOnMove: true } });
    await new Promise((r) => requestAnimationFrame(r));

    const renderLabels = vi.spyOn(sigma["labelRenderer"], "renderWebGLLabels");
    const rendered = vi.fn();
    sigma.on("afterRender", rendered);

    const target = sigma.getMouseLayer();
    await simulateMouseEvent(target, "pointerdown", { x: 50, y: 50 });
    await simulateMouseEvent(target, "pointermove", { x: 80, y: 80 });
    await simulateMouseEvent(target, "pointermove", { x: 110, y: 110 });
    await new Promise((r) => requestAnimationFrame(r));

    expect(rendered).toHaveBeenCalled();
    expect(renderLabels).not.toHaveBeenCalled();

    await simulateMouseEvent(target, "pointerup", { x: 110, y: 110 });
    sigma.kill();
    container.remove();
  });
});
