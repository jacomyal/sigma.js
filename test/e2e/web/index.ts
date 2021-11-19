// Dependencies
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "../../../src";

// Programs to test
import NodeProgram from "../../../src/rendering/webgl/programs/node";
import NodeFastProgram from "../../../src/rendering/webgl/programs/node.fast";
import getNodeImageProgram from "../../../src/rendering/webgl/programs/node.image";
import EdgeProgram from "../../../src/rendering/webgl/programs/edge";
import EdgeFastProgram from "../../../src/rendering/webgl/programs/edge.fast";
import EdgeArrowProgram from "../../../src/rendering/webgl/programs/edge.arrow";
import EdgeTriangleProgram from "../../../src/rendering/webgl/programs/edge.triangle";

// Useful data
import ARCTIC from "./resources/arctic.json";
import LES_MISERABLES from "./resources/les-miserables.json";

const arctic = Graph.from(ARCTIC as SerializedGraph);
const lesMiserables = Graph.from(LES_MISERABLES as SerializedGraph);

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
    data: { arctic, lesMiserables },
    programs: {
      NodeProgram,
      NodeFastProgram,
      getNodeImageProgram,
      EdgeProgram,
      EdgeFastProgram,
      EdgeArrowProgram,
      EdgeTriangleProgram,
    },
    container,
  },
});
