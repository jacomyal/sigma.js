import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { bench, describe } from "vitest";

import MEDIUM_GRAPH from "../datasets/arctic.json";
import LARGE_GRAPH from "../datasets/large-graph.json";
import SMALL_GRAPH from "../datasets/les-miserables.json";
import { rafNTimes } from "../helpers";

const TIMES = 20;
const METHODS = ["refresh", "render"] as const;
const SIZES = ["small", "medium", "large"] as const;
type Size = (typeof SIZES)[number];

const SCREEN_SIZES: Record<Size, number> = {
  small: 600,
  medium: 1600,
  large: 2600,
};
const GRAPHS = {
  small: SMALL_GRAPH as SerializedGraph,
  medium: MEDIUM_GRAPH as SerializedGraph,
  large: LARGE_GRAPH as SerializedGraph,
};

describe("Benchmarks", () => {
  METHODS.forEach((method) =>
    SIZES.forEach((screenSize) =>
      SIZES.forEach((graphSize) => {
        bench(`${method}-${screenSize}-scene-${graphSize}-graph`, async () => {
          const container = document.createElement("div");
          document.body.append(container);
          const size = SCREEN_SIZES[screenSize];
          container.style.width = `${size}px`;
          container.style.height = `${size}px`;
          const graph = new Graph();
          graph.import(GRAPHS[graphSize] as SerializedGraph);
          const sigma = new Sigma(graph, container);
          const camera = sigma.getCamera();

          switch (method) {
            case "refresh":
              return rafNTimes(() => {
                // This simulates a layout iteration, that triggers a full reindex of the graph:
                graph.forEachNode((node) => graph.mergeNodeAttributes(node, { x: Math.random(), y: Math.random() }));
              }, TIMES);
            case "render":
              return rafNTimes(() => {
                // This simulates a user interaction, that triggers a render of the graph:
                camera.setState({ angle: camera.angle + 0.1 });
              }, TIMES);
          }
        });
      }),
    ),
  );
});
