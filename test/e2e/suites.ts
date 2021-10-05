import { Page } from "puppeteer";
import Sigma from "../../src";
import { NodeDisplayData, EdgeDisplayData } from "../../src/types";
import Graph, { GraphConstructor, NodeKey, EdgeKey } from "graphology-types";

type TestDependencies = {
  Graph: GraphConstructor;
  Sigma: typeof Sigma;
  data: { [key: string]: Graph };
  container: HTMLElement;
};

declare global {
  const dependencies: TestDependencies;
}

export type Tests = Array<{
  name: string; // Name of the screenshot, without the extension like for example 'example-basic'
  waitFor?: number; // Time to wait in ms before to take the screenshot
  scenario: (page: Page) => Promise<void>;
  failureThreshold?: number; // between 0 and 1, it's a percent. By default it's 0.
}>;

export const tests: Tests = [
  {
    name: "single-node",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("test", { x: 0, y: 0, size: 10, color: "#1E90FF" });

        new Sigma(graph, container);
      });
    },
  },
  {
    name: "square",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("upper-left", { x: 0, y: 0, size: 10, label: "upper left" });
        graph.addNode("upper-right", { x: 10, y: 0, size: 10, label: "upper right" });
        graph.addNode("lower-left", { x: 0, y: 10, size: 10, label: "lower left" });
        graph.addNode("lower-right", { x: 10, y: 10, size: 10, label: "lower right" });

        graph.addEdge("upper-left", "upper-right", { type: "arrow", size: 5, label: "right" });
        graph.addEdge("upper-right", "lower-right", { type: "arrow", size: 5, label: "down" });
        graph.addEdge("lower-right", "lower-left", { type: "arrow", size: 5, label: "left" });
        graph.addEdge("lower-left", "upper-left", { type: "arrow", size: 5, label: "up" });

        graph.addEdge("upper-left", "lower-right", { color: "#f00" });
        graph.addEdge("upper-right", "lower-left", { color: "#f00" });

        new Sigma(graph, container, { renderEdgeLabels: true, labelRenderedSizeThreshold: -Infinity });
      });
    },
  },
  {
    name: "les-miserables",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { lesMiserables },
          Sigma,
          container,
        } = dependencies;

        new Sigma(lesMiserables, container);
      });
    },
  },
  {
    name: "arctic",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { arctic },
          Sigma,
          container,
        } = dependencies;

        new Sigma(arctic, container);
      });
    },
  },
  {
    name: "camera-state-unzoom-pan",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { lesMiserables },
          Sigma,
          container,
        } = dependencies;

        const renderer = new Sigma(lesMiserables, container);
        renderer.getCamera().setState({ ratio: 3, x: 0.8, y: 0.7 });
      });
    },
  },
  {
    name: "camera-state-zoom-pan",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { lesMiserables },
          Sigma,
          container,
        } = dependencies;

        const renderer = new Sigma(lesMiserables, container);
        renderer.getCamera().setState({ ratio: 1 / 3, x: 0.8, y: 0.7 });
      });
    },
  },
  {
    name: "reducers",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { lesMiserables },
          Sigma,
          container,
        } = dependencies;

        const nodeReducer = (key: NodeKey, attr: Partial<NodeDisplayData>) => {
          const data = attr as NodeDisplayData;
          return Object.assign({}, data, { color: (data.label || "").charCodeAt(0) % 2 === 0 ? "#1E90FF" : "#FF0000" });
        };

        const edgeReducer = (key: EdgeKey, attr: Partial<EdgeDisplayData>) => {
          const data = attr as EdgeDisplayData;
          return Object.assign({}, data, { color: +key % 2 === 0 ? "#FFFF00" : "#008000" });
        };

        new Sigma(lesMiserables, container, { nodeReducer, edgeReducer });
      });
    },
  },
];

// export const tests: Tests = [
//   { name: "drag", url: "http://localhost:8000/drag.html" },
//   { name: "gexf", url: "http://localhost:8000/gexf.html" },
//   { name: "settings", url: "http://localhost:8000/settings.html" },
//   {
//     name: "settings-mouse-zoom",
//     url: "http://localhost:8000/settings.html",
//     waitFor: 2000,
//     scenario: async (browser: Browser, page: Page): Promise<void> => {
//       await page.evaluate(() => {
//         const element = document.getElementsByClassName("sigma-mouse")[0];
//         const cEvent: Event & { clientX?: number; clientY?: number; deltaY?: number } = new Event("wheel");
//         cEvent.clientX = 0;
//         cEvent.clientY = 0;
//         cEvent.deltaY = -100;
//         element.dispatchEvent(cEvent);
//       });
//     },
//   },
//   { name: "tiny", url: "http://localhost:8000/tiny.html" },
//   { name: "edge-labels", url: "http://localhost:8000/edge-labels.html" },
//   {
//     name: "node-edge-state",
//     url: "http://localhost:8000/edge-labels.html",
//     waitFor: 2000,
//     scenario: async (browser: Browser, page: Page): Promise<void> => {
//       await page.evaluate(() => {
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const graph: Graph = window.graph;
//         graph.setNodeAttribute("Alice", "highlighted", true);
//         graph.setNodeAttribute("Bob", "size", 50);
//         graph.setNodeAttribute("Bob", "color", "#FF0000");
//         graph.setNodeAttribute("Deborah", "hidden", true);
//         graph.setEdgeAttribute("Alice", "Bob", "hidden", true);
//       });
//     },
//   },
// ];
