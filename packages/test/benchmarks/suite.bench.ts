import { MultiGraph } from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import { bench, describe } from "vitest";

import MEDIUM_GRAPH from "../datasets/arctic.json";
import LARGE_GRAPH from "../datasets/large-graph.json";
import SMALL_GRAPH from "../datasets/les-miserables.json";

const ITERATIONS = 20;
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

METHODS.forEach((method) => {
  describe(`Benchmarking method "${method}"`, () => {
    SIZES.forEach((screenSize) =>
      SIZES.forEach((graphSize) => {
        const size = SCREEN_SIZES[screenSize];

        const container = document.createElement("div");
        document.body.append(container);
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;

        const graph = new MultiGraph();
        graph.import(GRAPHS[graphSize] as SerializedGraph);

        const sigma = new Sigma(graph, container);
        const camera = sigma.getCamera();
        bench(
          `${screenSize} scene, ${graphSize} graph`,
          () => {
            switch (method) {
              case "refresh":
                // This simulates a layout iteration, that triggers a full reindex of the graph:
                graph.forEachNode((node) => graph.mergeNodeAttributes(node, { x: Math.random(), y: Math.random() }));
                break;
              case "render":
                // This simulates a user interaction, that triggers a render of the graph:
                camera.setState({ angle: camera.angle + 0.1 });
                break;
            }
          },
          { iterations: ITERATIONS },
        );
      }),
    );
  });
});
