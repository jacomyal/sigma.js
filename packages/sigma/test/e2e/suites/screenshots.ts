import { Page } from "puppeteer";

import { NodeDisplayData, EdgeDisplayData } from "../../../src/types";
import { Tests } from "../utils";

const tests: Tests = [
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
    name: "aspect-ratio-vertical-graph-horizontal-container",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("upper-left", { x: 0, y: 0, size: 10 });
        graph.addNode("upper-right", { x: 5, y: 0, size: 10 });
        graph.addNode("lower-left", { x: 0, y: 10, size: 10 });
        graph.addNode("lower-right", { x: 5, y: 10, size: 10 });

        graph.addEdge("upper-left", "lower-right", { size: 5, color: "#F00" });
        graph.addEdge("upper-right", "lower-left", { size: 5, color: "#F00" });

        new Sigma(graph, container);
      });
    },
    dimensions: { width: 800, height: 400 },
  },
  {
    name: "aspect-ratio-horizontal-graph-horizontal-container",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("upper-left", { x: 0, y: 0, size: 10 });
        graph.addNode("upper-right", { x: 10, y: 0, size: 10 });
        graph.addNode("lower-left", { x: 0, y: 5, size: 10 });
        graph.addNode("lower-right", { x: 10, y: 5, size: 10 });

        graph.addEdge("upper-left", "lower-right", { size: 5, color: "#F00" });
        graph.addEdge("upper-right", "lower-left", { size: 5, color: "#F00" });

        new Sigma(graph, container);
      });
    },
    dimensions: { width: 800, height: 400 },
  },
  {
    name: "aspect-ratio-horizontal-graph-vertical-container",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("upper-left", { x: 0, y: 0, size: 10 });
        graph.addNode("upper-right", { x: 10, y: 0, size: 10 });
        graph.addNode("lower-left", { x: 0, y: 5, size: 10 });
        graph.addNode("lower-right", { x: 10, y: 5, size: 10 });

        graph.addEdge("upper-left", "lower-right", { size: 5, color: "#F00" });
        graph.addEdge("upper-right", "lower-left", { size: 5, color: "#F00" });

        new Sigma(graph, container);
      });
    },
    dimensions: { width: 400, height: 800 },
  },
  {
    name: "aspect-ratio-vertical-graph-vertical-container",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("upper-left", { x: 0, y: 0, size: 10 });
        graph.addNode("upper-right", { x: 5, y: 0, size: 10 });
        graph.addNode("lower-left", { x: 0, y: 10, size: 10 });
        graph.addNode("lower-right", { x: 5, y: 10, size: 10 });

        graph.addEdge("upper-left", "lower-right", { size: 5, color: "#F00" });
        graph.addEdge("upper-right", "lower-left", { size: 5, color: "#F00" });

        new Sigma(graph, container);
      });
    },
    dimensions: { width: 400, height: 800 },
  },
  {
    name: "settings",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();

        graph.addNode("John", { x: 6, y: 4, size: 10 });
        graph.addNode("Mary", { x: 4, y: 2, size: 10 });
        graph.addNode("Sue", { x: 4, y: 6, size: 10 });

        graph.addEdge("John", "Mary", { size: 5 });
        graph.addEdge("Mary", "Sue", { size: 5 });
        graph.addEdge("Sue", "John", { size: 5 });

        new Sigma(graph, container, { defaultNodeColor: "#7FFFD4", defaultEdgeColor: "#AA4A44" });
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
    name: "custom-zoomToSizeRatioFunction",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { lesMiserables },
          Sigma,
          container,
        } = dependencies;

        const renderer = new Sigma(lesMiserables, container, {
          zoomToSizeRatioFunction: (x) => x,
        });
        renderer.getCamera().setState({ ratio: 3, x: 0.8, y: 0.7 });
      });
    },
  },
  {
    name: "camera-state-rotation",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const {
          data: { arctic },
          Sigma,
          container,
        } = dependencies;

        const renderer = new Sigma(arctic, container);
        renderer.getCamera().setState({ angle: 30 });
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

        const nodeReducer = (key: string, attr: Partial<NodeDisplayData>) => {
          const data = attr as NodeDisplayData;
          return Object.assign({}, data, { color: (data.label || "").charCodeAt(0) % 2 === 0 ? "#1E90FF" : "#FF0000" });
        };

        const edgeReducer = (key: string, attr: Partial<EdgeDisplayData>) => {
          const data = attr as EdgeDisplayData;
          return Object.assign({}, data, { color: +key % 2 === 0 ? "#FFFF00" : "#008000" });
        };

        new Sigma(lesMiserables, container, { nodeReducer, edgeReducer });
      });
    },
  },
  // {
  //   name: "les-miserables-mouse-wheel",
  //   waitFor: 2000,
  //   scenario: async (page: Page): Promise<void> => {
  //     await page.evaluate(() => {
  //       const {
  //         data: { lesMiserables },
  //         Sigma,
  //         container,
  //       } = dependencies;

  //       new Sigma(lesMiserables, container);

  //       const element = document.getElementsByClassName("sigma-mouse")[0];
  //       const cEvent: Event & { clientX?: number; clientY?: number; deltaY?: number } = new Event("wheel");
  //       cEvent.clientX = 0;
  //       cEvent.clientY = 0;
  //       cEvent.deltaY = -100;
  //       element.dispatchEvent(cEvent);
  //     });
  //   },
  // },
  {
    name: "node-edge-state",
    waitFor: 2000,
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph({ type: "directed" });

        graph.addNode("Alice", {
          label: "Alice",
          x: -2,
          y: 1,
          color: "#FF0",
          size: 10,
        });

        graph.addNode("Bob", {
          label: "Bob",
          x: 1,
          y: 2,
          color: "#00F",
          size: 5,
        });

        graph.addNode("Charles", {
          label: "Charles",
          x: 2,
          y: -1,
          color: "#00F",
          size: 5,
        });

        graph.addNode("Deborah", {
          label: "Deborah",
          x: -1,
          y: -2,
          color: "#00F",
          size: 5,
        });

        graph.addEdge("Alice", "Bob", {
          label: "likes to play with",
          size: 1,
        });

        graph.addEdge("Bob", "Charles", {
          label: "likes to be with",
          color: "#fc0",
          size: 2,
        });

        graph.addEdge("Charles", "Deborah", {
          label: "likes to talk with",
          color: "#CCC",
          size: 3,
        });

        graph.addEdge("Deborah", "Alice", {
          label: "likes to talk with",
          color: "#000",
          size: 20,
        });

        new Sigma(graph, container, {
          defaultEdgeType: "arrow",
          defaultEdgeColor: "#888",
          renderEdgeLabels: true,
        });

        graph.setNodeAttribute("Alice", "highlighted", true);
        graph.setNodeAttribute("Bob", "size", 50);
        graph.setNodeAttribute("Bob", "color", "#FF0000");
        graph.setNodeAttribute("Deborah", "hidden", true);
        graph.setEdgeAttribute("Alice", "Bob", "hidden", true);
      });
    },
  },
  {
    name: "programs",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container, programs } = dependencies;
        const {
          NodeCircleProgram,
          NodePointProgram,
          EdgeRectangleProgram,
          EdgeLineProgram,
          EdgeArrowProgram,
          EdgeTriangleProgram,
        } = programs;

        const graph = new Graph();
        graph.addNode("n1", { x: 30, y: 120, size: 15, label: "Node 1", type: "node", color: "#ffcc00" });
        graph.addNode("n2", { x: 120, y: -30, size: 15, label: "Node 2", type: "fast", color: "#00ffcc" });
        graph.addNode("n3", { x: -30, y: -120, size: 15, label: "Node 3", type: "image", color: "#cc00ff" });
        graph.addNode("n4", {
          x: -120,
          y: 30,
          size: 15,
          label: "Node 4",
          type: "image",
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABfCAYAAACOTBv1AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA1CSURBVHic7Z1rdFXlmcd/z3tObuRKIkVuScjgSTBFq4i6XGoh0uWH6RJJSGVmEFGxttKlVbFVZ4qsdurQcrEqOrRa6EiLxZCAuPqBlkHs2FFbB7w0hRMpkAShUsg95HbOfuZDQsxhn5CTk3P2CSG/T8mz3/3+3/Osd7/7vT5bGIYoK011fmWOEcujfvIFChCZBpqJkoaQAiQDaUAT0IrSgtCEcBrVQ6riFRdeS01VjrewWlhpxfZX2ZFYF+As1Z6SPGCugbkKRUBWpPJWaBZ4T0V2I7I7+2DZPgGNVP7hElPnH/PMv9LC3AVyB+hEB6U/BbYarFcmV23/0EHdABx3/rGC+VmWJUtAFgNXOK0fhI9AXzFGfzH54PbTTgo75vyj04snGL95FPR+IMUp3UHQgrDB7zZrp1aW/c0Jwag7v9ZTOknxPwlyD5AYbb0I0A78HOl6Otu783g0haLmfJ09211zImuZKN+nu1dyodGqyJqWOHm6sLKsMxoCUXF+jWfBTaAvADPOl06jVYDI8pFiluVUlb0d6Ywj+tsrC0vj0zqtH6vwYKTzjjGKyrPN8fLdSD4FEXNQtackT2ArcE2k8hx+6B8tcS3M9ZYdiURuJhKZ1F62oFhgHyPa8QByrVFrX62neH4kchuy82s8JY+o6DYgPQLluRDIUKS8xlPy8FAzCtv5ClLtWbASWMvIat9DQYB1tfklz+oQfntYN+rs2e7a41kvAUvCFR4xiG6aMqHu67J3r2+wtw665itI7adZP2XU8d2o3F1zPGtTOE/AoJ1fk1/yI4R7BnvfSEZg0TFPydNh3Bc6NZ7iR0HWDFbkYkFFH87xVvwk1PQhO7/2spISFcoGc89FiIVIcbZ32+uhJA7JkYenF+e4/bIPyBxS0S4OGiwxV4cyEBuwza8sLI13+2Ubo44PlQyj1quVhaXxAyUc0PlpPms1I37kGnGuS+2yVg2U6LzNTrWn9EbB+v1A6UYJiqI6O/uTit/3l6Dfmq+zZ7sFaz2jjg8XQWT9+zO/Htdfgn6dX3s88yHgyqgU6+JhxriW0w/0dzFore5e+rMOMjzXWi80miyXFuQeqDhx7oWgNV/V+ldGHR8WQTYDpbl88t1gaW01v3uXgRzmwljsHqbYFkjbfF1dU/OO7Pysr9FW87u3d4w6fmjY6nRSXFycbf4/INWxgvlZfsscEUiNZtEGgzt3IonXFxJ/hQd33kRcl2Rg0qPXIjY9/xrNr/wmGlm3uonPnVj16qmzBnffq+o394jE3vEyJpGUBbeQXDKHuIJcZ7UT+u0ZDpVkH513As+cNQQ6X7gzWsqhIHFuUpd8ldT7bo9q7Y4VCovp4/zeNv/otJKrGGCfTTSJL8xj/OtrSF++aEQ6HkDgS7X5Jb37U3trvjGxq/XJX5vL2O/di8SH9shreyeIDK6JsBSr5czAeXd0hZ5nGFiwCPgO9DhfQWq7t2lHVTgYaQ8sIP2hhf1e17YO2v/3I9r2vE/nfi/+k3VYzd1ONGnJuMZnknB1AYlF15B4/QwksZ/JRIHGZ7bQsmVXNH5GyIiykB7nC0D1tNLLxViVThck9d7byPjO4qDX9Ew7zZveoHnjTqyWtpDyM2nJpC6dR+rif0SSEoJkqtQ/9TNatv5uKMUeMi4xBZO8ZV4DYIxV5HQBkopmkfFY8Jau7bfvcXzuMhqf2xqy4wGsplYa123hxFe+Rdve/7MnECFjxVISrvtiuMWOCH7LmgM9L1yFOU6Kuy7NInPVMpBzBiOqNK1/jVMPrsE63Rh2/v6/13Pqm6tofnmH7Zq4XWStfQiTlhx2/kNGuv1tlJUG+LKT2mOfvDtoj6b++y/T+PxroBF491hKw+pf0rB6s+2Sa9xYMh5fMnSNsNEiBTHV+ZU5RPDw2UAkXHs5Sbdeb7O3vLorKi/D5pdfp3XHWzZ78vzZxOXnRFwvNOSSI9OLs40LX76Tsmn3F9tsnZWHafj3jVHTrF+xga5DxwKNRkj/1teipjkQLp96jIVxzPnunAkk3vglm71x9WbU54+arnZ00bj2VzZ70i3X4Bo3Nmq658OIyTdi4Zjzk+fdbLO1/+FD2t/5OOrabXv+RMe+g4FGl4sxt90Ude1gKOSb7pPdzpD45attttatu52Sp/U1u1awJ9ERlMsMqCP7cSQ5ifjpUwP1O7toe/sDJ+QBuvv+/sAoAAkzpyNul2Nl6EXIMqgzJwXj/mESuALXbjreP4C2hj6IGipWfTOdHx0KsElCHO7sSx0rQ68upJieIBJRx50zwWbzVTty1jiArhrbOjbuXHvZoo0iaQaHVq2CjSj9J+uckA7A+nu9zRaL0a6iqQZIckJMEuyzjVZTqxPSAfjrW2w2SXJ+yVpgjAEcaXS1w358NRaLJq6x9gdd2zscL4fCGQM0OyEWrJbHYoBjxmXYbFaj80+gIM0Gxf4cRgFf9fB40cUFe/HXOv/iF7TJIDQ5Idb110/BHziFkDCzAEl25JUDgMlMI35G4JhSO7pi0utSaDYgjnQ5tLWNzr8EHtaQ+DiSbnJuhJk0Z6Z9rLH/INoZ3XXboCh1BqxPnNJrf2ufzZZ8x1eckiel1K7V/tZ+x/T7oiJVRkWqnBJs3fk/NlviDVeQeEP0o30l3TKL+Ks8gUZLOfObiEdyCQlBvcZgeZ0S9FWfoD3IXE768kVRnV+RhDjSH/kXm73td+/h/8z5gR6Agtf4cTvmfICmDRU2W3xhHhn/Fr1z1WN/8A3ipk0ONKrS9FN7WZwizmeqTI63sBpwLKpex5/+wpld79jsKf90Kyn/fGvE9VKXziN5nn2JurViL52VhyOuFwoKJyccLqs1wkpLhb1Oijf8cBNWg31sN3bFUtIfvMO+qyEcXIaMx+4Muj3Ff6qBhjX2hXWnEHhTQA2AKG86Ke7/rI66J16w71IQIW1ZKZesfwzXJfaRaKi4xmcybsMTpC6dF0Tcom75s1h1jgxvgqIqb0LPvh1LrT1OF6Btz/vU/+DnQa8lzb2WCbtf6N40mzom5DxNWjLpyxcx4bfrSbz5qqBp6v/jF44sW54P49Y90LNdUEFqPSW1wCSnCxLSXs13+u7VrO+dJzLpKbi+kEnCzHySimaRcP2M/jfPqtLw4800b9wZjZ8RMgLVU6rKc6Fno6yA1nQHp3vE6cI0vbgN/8l6xq5YGtRxkpRAUtEskopm9doGu0tZ2zqo+94GzrxhH2fEgF+f/ePzsbbL2hSTogCt2/6bkwuftO+t6QdJjA/Z8V0HjvJZ6ePDxfFgTO8eloBuRY2n5ANiePBZ3C5SlnyVtPtux2QMbYHNf6qBpv8sp+XVXbZF85gh7Mv2ls88+6878KpuBomZ89Xnp/nl12nZsouUBUWMmT+H+MunDnxjHzo//ITW7Xtp3f5md/M0jFA0oH8bUPNrC0szrS7raMBpxBjH3HXnXErCdV8k4crLcOdOxDU+s7cHZDWfwf+30/iOnqBjv5eOd/+M79OTsSvs+WnShITcnI+39C4i29xak1+yGmW5s+Ua+QismlJV/kRfm+0QtN9t1tIdxvxzYv6Biwsc4UyH33rmXLPN+T2B+wNHP8PhAyMXMpb8bNpft9vaw+AhX6TraT1nYX006E7YNPrj5UfBLgR1frZ353GBp6JbposDVVb09xmQfoMdTZl4+nkgZl/SGSF8nD3p9Iv9XezX+bJ3r09FlzHa3IeLZSxz//liLJ83umCOt+IPQMgRUkfpg7Bu8qEy+6pRHwYM7dgcZx4H/WPkSnVR8O7JlKwnB0oUUifmeF5pts9t7Wc0sGko1PuN/+qpB3ccHShhSFHEJx4uqwHuBYbJDNXwIMjL0FKLu0JxPAwihHt2VfkOFX005JJdBJzbbKjycM6h8jdCvX9Q8fNzvBU/ERgwTO1IJ2j3T/hhziflzw0mn0EPXHuWHF+iuxkaBRDYPLmq/K7BzsIM+ssRAjpl4ulvIBqzla9hhbJxcpW5O5zpr7CnbBSkxrPgKUEv2mkIEZ6b7C3/drjzjkOeL6vOL/62qKyLRF4XEJYqDw+2jT+XiDisxlNyO7ARCHrO5wL5AGWo1CF6d7a3Ysh7UCLmkyMFt+e6LLMV5NpI5TkMedfn0oV5ByqqI5FZRL6NCDD14I6jzXGum+iOG3meNvCCnKdTkLUnU7NujpTjIUqtwdGCBTcYS19kBMTfV/jAZZkHBpokC4fRL0H3T6MKT2VPOP1COJ/eC4WovwePTi+e4LLkcVXuw6HT7kNCOCMWL/nizapof4jesU7I4am3jXe54x9B9JvDKUr5WXqOZr7Y4bfWBVvsjgaO9wBrC0sztcu6S2GxQIwiDX2OwH6FzRJn/mtKZZmjB7Ri2v2uLSidYal1Z0+I2ymOCQs1asmvxe3fnH1g+58d07UVY5hQ7SnJA+YauFGhiIieFdBTgrxribyNyO7sg2X7hsNWpGHj/L4oyJHpxdkun3qMmHyFAiAP+AKQCpICmkJ3L6oJpEXRZoEW4CRwGDigalX53VI19UBFzXBw9rn8P3DiYqyQm2r2AAAAAElFTkSuQmCC",
          color: "#ccff00",
        });

        graph.addEdge("n1", "n2", { type: "edge", size: 30 });
        graph.addEdge("n2", "n3", { type: "fast", size: 30 });
        graph.addEdge("n3", "n4", { type: "arrow", size: 30 });
        graph.addEdge("n4", "n1", { type: "triangle", size: 30 });

        new Sigma(graph, container, {
          nodeProgramClasses: {
            node: NodeCircleProgram,
            fast: NodePointProgram,
            image: NodeCircleProgram, // createNodeImageProgram(),
          },
          edgeProgramClasses: {
            edge: EdgeRectangleProgram,
            fast: EdgeLineProgram,
            arrow: EdgeArrowProgram,
            triangle: EdgeTriangleProgram,
          },
        });
      });
    },
  },
  {
    name: "force-labels",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("upper-left", { x: 0, y: 0, size: 5, label: "upper left", forceLabel: true });
        graph.addNode("upper-right", { x: 10, y: 0, size: 5, label: "upper right", forceLabel: true });
        graph.addNode("lower-left", { x: 0, y: 10, size: 5, label: "lower left" });
        graph.addNode("lower-right", { x: 10, y: 10, size: 15, label: "lower right" });

        graph.addEdge("upper-left", "upper-right", { type: "arrow", size: 5, label: "right" });
        graph.addEdge("upper-right", "lower-right", { type: "arrow", size: 5, label: "down" });
        graph.addEdge("lower-right", "lower-left", { type: "arrow", size: 5, label: "left", forceLabel: true });
        graph.addEdge("lower-left", "upper-left", { type: "arrow", size: 5, label: "up", forceLabel: true });

        new Sigma(graph, container, { renderEdgeLabels: true, labelRenderedSizeThreshold: 10 });
      });
    },
  },
  {
    name: "kill",
    scenario: async (page: Page): Promise<void> => {
      await page.evaluate(() => {
        const { Graph, Sigma, container } = dependencies;

        const graph = new Graph();
        graph.addNode("test", { x: 0, y: 0, size: 10, color: "#1E90FF" });

        const sigma = new Sigma(graph, container);
        sigma.kill();
      });
    },
  },
];

export default tests;
