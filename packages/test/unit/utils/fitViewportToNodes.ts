import { getCameraStateToFitViewportToNodes } from "@sigma/utils";
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const GRAPH: Pick<SerializedGraph, "nodes" | "edges"> = {
  nodes: [
    { key: "n1", attributes: { x: 0, y: 0, size: 5 } },
    { key: "n2", attributes: { x: 40, y: 0, size: 5 } },
    { key: "n3", attributes: { x: 0, y: 40, size: 5 } },
    { key: "n4", attributes: { x: 40, y: 40, size: 5 } },
  ],
  edges: [
    { source: "n1", target: "n2" },
    { source: "n2", target: "n4" },
    { source: "n4", target: "n3" },
    { source: "n3", target: "n1" },
  ],
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

describe("@sigma/utils", () => {
  describe("getCameraStateToFitViewportToNodes", () => {
    test<SigmaTestContext>("it should return the default camera state when the given nodes cover the whole graph bounding box", ({
      sigma,
    }) => {
      const DEFAULT_CAMERA_STATE = {
        x: 0.5,
        y: 0.5,
        angle: 0,
        ratio: 1,
      };

      expect(getCameraStateToFitViewportToNodes(sigma, sigma.getGraph().nodes())).toEqual(DEFAULT_CAMERA_STATE);
      expect(getCameraStateToFitViewportToNodes(sigma, ["n1", "n4"])).toEqual(DEFAULT_CAMERA_STATE);
      expect(getCameraStateToFitViewportToNodes(sigma, ["n2", "n3"])).toEqual(DEFAULT_CAMERA_STATE);
    });

    test<SigmaTestContext>("it should throw when no node is given", ({ sigma }) => {
      expect(() => getCameraStateToFitViewportToNodes(sigma, [])).to.throw();
    });

    test<SigmaTestContext>("it should work with on single node", ({ sigma }) => {
      expect(getCameraStateToFitViewportToNodes(sigma, ["n4"])).toEqual({
        x: 1,
        y: 1,
        ratio: 1,
        angle: 0,
      });
    });

    test<SigmaTestContext>("it should work when sigma has a custom bounding box", ({ sigma }) => {
      sigma.getGraph().import({
        nodes: [
          { key: "n5", attributes: { x: 0, y: 80, size: 5 } },
          { key: "n6", attributes: { x: 40, y: 80, size: 5 } },
        ],
      });
      sigma.setCustomBBox({
        x: [0, 40],
        y: [0, 40],
      });

      expect(getCameraStateToFitViewportToNodes(sigma, ["n4"])).toEqual({
        x: 1,
        y: 1,
        ratio: 1,
        angle: 0,
      });
      expect(getCameraStateToFitViewportToNodes(sigma, ["n1", "n2", "n3", "n4"])).toEqual({
        x: 0.5,
        y: 0.5,
        ratio: 1,
        angle: 0,
      });
      expect(getCameraStateToFitViewportToNodes(sigma, ["n5", "n6"])).toEqual({
        x: 0.5,
        y: 2,
        ratio: 1,
        angle: 0,
      });
    });

    test<SigmaTestContext>("it should put a single node to the center of the viewport when called with only one node", ({
      sigma,
    }) => {
      const camera = sigma.getCamera();
      const graph = sigma.getGraph();
      const node = "n4";

      const newCameraState = getCameraStateToFitViewportToNodes(sigma, [node]);
      camera.setState(newCameraState);
      sigma.refresh();

      const nodeViewportPosition = sigma.graphToViewport(graph.getNodeAttributes(node) as Coordinates);
      expect(nodeViewportPosition).toEqual({ x: 50, y: 50 });
    });

    test<SigmaTestContext>("it should work when the graph has only one node (regression #1473)", ({ sigma }) => {
      const camera = sigma.getCamera();
      const graph = sigma.getGraph();
      const node = "n4";
      graph.dropNode("n1");
      graph.dropNode("n2");
      graph.dropNode("n3");
      sigma.refresh();

      const newCameraState = getCameraStateToFitViewportToNodes(sigma, [node]);
      camera.setState(newCameraState);
      sigma.refresh();

      const nodeViewportPosition = sigma.graphToViewport(graph.getNodeAttributes(node) as Coordinates);
      expect(camera.getState()).toEqual({
        x: 0.5,
        y: 0.5,
        ratio: 1,
        angle: 0,
      });
      expect(nodeViewportPosition).toEqual({ x: 50, y: 50 });
    });
  });
});
