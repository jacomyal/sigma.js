// Dependencies
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";

import Sigma from "../../../src";
import EdgeArrowProgram from "../../../src/rendering/programs/edge-arrow";
import EdgeLineProgram from "../../../src/rendering/programs/edge-line";
import EdgeRectangleProgram from "../../../src/rendering/programs/edge-rectangle";
import EdgeTriangleProgram from "../../../src/rendering/programs/edge-triangle";
// Programs to test
import NodeCircleProgram from "../../../src/rendering/programs/node-circle";
import NodePointProgram from "../../../src/rendering/programs/node-point";
// Useful data
import ARCTIC from "./resources/arctic.json";
import LARGE_GRAPH from "./resources/large-graph.json";
import LES_MISERABLES from "./resources/les-miserables.json";

// Utils:
const rafNTimes = (fn: (step: number) => void, n: number) => {
  return new Promise((globalResolve) => {
    let count = 0;

    function executeAndRequestFrame() {
      fn(count);

      count++;
      if (count < n) {
        requestAnimationFrame(() => executeAndRequestFrame());
      } else {
        globalResolve(undefined); // ou retournez tout autre résultat que vous souhaitez obtenir
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

globalize({
  dependencies: {
    Graph,
    Sigma,
    data: { arctic, lesMiserables, largeGraph },
    programs: {
      NodeCircleProgram,
      NodePointProgram,
      EdgeLineProgram,
      EdgeRectangleProgram,
      EdgeArrowProgram,
      EdgeTriangleProgram,
    },
    container,

    // Utils:
    rafNTimes,
  },
});
