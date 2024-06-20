import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import {
  EdgeArrowProgram,
  EdgeLineProgram,
  EdgeRectangleProgram,
  EdgeTriangleProgram,
  NodeCircleProgram,
  NodePointProgram,
} from "sigma/rendering";

// Useful data
import ARCTIC from "../datasets/arctic.json";
import LARGE_GRAPH from "../datasets/large-graph.json";
import LES_MISERABLES from "../datasets/les-miserables.json";
import { BrowserTestDependencies } from "../helpers";

// Utils:
const rafNTimes = (fn: (step: number) => void, n: number): Promise<void> => {
  return new Promise((globalResolve) => {
    let count = 0;

    function executeAndRequestFrame() {
      fn(count);

      count++;
      if (count < n) {
        requestAnimationFrame(() => executeAndRequestFrame());
      } else {
        globalResolve(undefined);
      }
    }

    executeAndRequestFrame();
  });
};

// Data:
const arctic = Graph.from(ARCTIC as SerializedGraph);
const lesMiserables = Graph.from(LES_MISERABLES as SerializedGraph);
const largeGraph = Graph.from(LARGE_GRAPH as SerializedGraph);

const container = document.getElementById("container") as HTMLElement;

function globalize(variables: Record<string, unknown>): void {
  for (const key in variables) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window[key] = variables[key];
  }
}

const dependencies: BrowserTestDependencies = {
  Graph,
  Sigma,
  data: { arctic, lesMiserables, largeGraph },
  nodePrograms: {
    NodeCircleProgram,
    NodePointProgram,
    NodeImageProgram: createNodeImageProgram({ debounceTimeout: null }),
  },
  edgePrograms: {
    EdgeLineProgram,
    EdgeRectangleProgram,
    EdgeArrowProgram,
    EdgeTriangleProgram,
  },
  container,

  // Utils:
  rafNTimes,
};

globalize({
  dependencies,
});
