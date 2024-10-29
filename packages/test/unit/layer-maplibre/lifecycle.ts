import bindMapLayer from "@sigma/layer-maplibre";
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
  nodes: [
    { key: "nantes", attributes: { x: 0, y: 0, lat: 47.2308, lng: 1.5566, size: 10, label: "Nantes" } },
    { key: "paris", attributes: { x: 0, y: 0, lat: 48.8567, lng: 2.351, size: 10, label: "Paris" } },
  ],
  edges: [{ source: "nantes", target: "paris" }],
};

interface SigmaTestContext {
  sigma: Sigma;
}

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  graph.import(GRAPH);
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.sigma = new Sigma(graph, container);
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("@sigma/layer-maplibre", () => {
  test<SigmaTestContext>("calling clean function multiple times should work", ({ sigma }) => {
    const { clean } = bindMapLayer(sigma, { mapOptions: { style: undefined } });

    expect(() => {
      clean();
      clean();
    }).not.to.throw();
  });
  test<SigmaTestContext>("clean the map should reset sigma settings to its previous value", ({ sigma }) => {
    const prevSettings = sigma.getSettings();

    const { clean } = bindMapLayer(sigma, { mapOptions: { style: undefined } });
    const settings = sigma.getSettings();

    clean();

    expect(prevSettings).not.toEqual(settings);
    expect(sigma.getSettings()).toEqual(prevSettings);
  });
});
