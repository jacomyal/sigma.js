import { Meta, StoryObj } from "@storybook/html";
import Graph from "graphology";
import Sigma from "sigma";

import EdgeCurveProgram from "../index.ts";
import data from "./data.json";
import "./stage.css";

const createPictogramsStage = () => {
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

const meta: Meta<typeof createPictogramsStage> = {
  title: "edge-curve",
  render: () => createPictogramsStage(),
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof createPictogramsStage>;

export const ComparisonExample: Story = {
  name: "All features at once",
};
