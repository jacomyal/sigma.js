import { Meta, StoryObj } from "@storybook/html";
import Graph from "graphology";
import Sigma from "sigma";

import EdgeCurveProgram from "../index.ts";
import data from "./data/les-miserables.json";
import "./stage.css";

const createStage = () => {
  const stage = document.createElement("div");
  stage.classList.add("stage");

  const graph = new Graph();
  graph.import(data);

  new Sigma(graph, stage, {
    allowInvalidContainer: true,
    defaultEdgeType: "curve",
    edgeProgramClasses: {
      curve: EdgeCurveProgram,
    },
  });

  return stage;
};

const meta: Meta<typeof createStage> = {
  title: "edge-curve",
  render: () => createStage(),
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof createStage>;

export const BasicExample: Story = {
  name: "Basic example",
};
