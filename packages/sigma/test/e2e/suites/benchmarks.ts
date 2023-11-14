import { Page } from "puppeteer";

import { Test, Tests } from "../utils";

const TIMES = 20;

const METHODS = ["refresh", "render"] as const;
type Method = (typeof METHODS)[number];

const SIZES = ["small", "medium", "large"] as const;
type Size = (typeof SIZES)[number];

const SCREEN_SIZES: Record<Size, number> = {
  small: 600,
  medium: 1600,
  large: 2600,
};
const GRAPHS: Record<Size, string> = {
  small: "lesMiserables",
  medium: "arctic",
  large: "largeGraph",
};

function getTest(method: Method, screenSize: Size, graphSize: Size): Test {
  const graphKey = GRAPHS[graphSize];
  const screenKey = SCREEN_SIZES[screenSize];

  return {
    name: `${method}-${screenSize}-scene-${graphSize}-graph`,
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(
        (method: string, graphKey: string, times: number) => {
          const { data, Sigma, container, rafNTimes } = dependencies;

          const graph = data[graphKey];
          const sigma = new Sigma(graph, container);
          const camera = sigma.getCamera();

          switch (method) {
            case "refresh":
              return rafNTimes(() => {
                // This simulates a layout iteration, that triggers a full reindex of the graph:
                graph.forEachNode((node) => graph.mergeNodeAttributes(node, { x: Math.random(), y: Math.random() }));
              }, times);
            case "render":
              return rafNTimes(() => {
                // This simulates a user interaction, that triggers a render of the graph:
                camera.setState({ angle: camera.angle + 0.1 });
              }, times);
          }
        },
        method,
        graphKey,
        TIMES,
      );
    },
    dimensions: {
      width: screenKey,
      height: screenKey,
    },
  };
}

const tests: Tests = METHODS.flatMap((method) =>
  SIZES.flatMap((screenSize) => SIZES.map((graphSize) => getTest(method, screenSize, graphSize))),
);

export default tests;
