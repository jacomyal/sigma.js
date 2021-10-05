// Dependencies
import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "../../../src";

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

globalize({ dependencies: { Graph, Sigma, data: { arctic, lesMiserables }, container } });
