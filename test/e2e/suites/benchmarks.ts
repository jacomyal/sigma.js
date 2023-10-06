import { Page } from "puppeteer";

import { Tests } from "../utils";

const tests: Tests = [
  {
    name: "n-renders-small-scene",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { arctic },
          Sigma,
          container,
          rafNTimes,
        } = dependencies;

        new Sigma(arctic, container);

        return rafNTimes(() => {
          // This simulates a layout iteration, that triggers a full reindex of the graph:
          arctic.forEachNode((node) => arctic.mergeNodeAttributes(node, { x: Math.random(), y: Math.random() }));
        }, 20);
      });
    },
  },
  {
    name: "n-refreshes-small-scene",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { arctic },
          Sigma,
          container,
          rafNTimes,
        } = dependencies;

        const sigma = new Sigma(arctic, container);
        const camera = sigma.getCamera();

        return rafNTimes(() => {
          // This simulates a user interaction, that triggers a render of the graph:
          camera.setState({ angle: camera.angle + 0.1 });
        }, 20);
      });
    },
  },
  {
    name: "n-renders-large-scene",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { arctic },
          Sigma,
          container,
          rafNTimes,
        } = dependencies;

        new Sigma(arctic, container);

        return rafNTimes(() => {
          // This simulates a layout iteration, that triggers a full reindex of the graph:
          arctic.forEachNode((node) => arctic.mergeNodeAttributes(node, { x: Math.random(), y: Math.random() }));
        }, 20);
      });
    },
    dimensions: {
      width: 2600,
      height: 2600,
    },
  },
  {
    name: "n-refreshes-large-scene",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { arctic },
          Sigma,
          container,
          rafNTimes,
        } = dependencies;

        const sigma = new Sigma(arctic, container);
        const camera = sigma.getCamera();

        return rafNTimes(() => {
          // This simulates a user interaction, that triggers a render of the graph:
          camera.setState({ angle: camera.angle + 0.1 });
        }, 20);
      });
    },
    dimensions: {
      width: 2600,
      height: 2600,
    },
  },
];

export default tests;
