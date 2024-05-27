import type { Meta, StoryObj } from "@storybook/web-components";

import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

type StoryArgs = {
  nodesAlpha: number;
  edgesAlpha: number;
};

const meta: Meta<StoryArgs> = {
  id: "nodes-edges-opacity",
  title: "Examples",
  argTypes: {
    nodesAlpha: {
      name: "Nodes alpha",
      defaultValue: 0.5,
      control: { type: "number", step: "0.05", min: "0", max: "1" },
    },
    edgesAlpha: {
      name: "Edges alpha",
      defaultValue: 0.5,
      control: { type: "number", step: "0.05", min: "0", max: "1" },
    },
  },
};
export default meta;

type Story = StoryObj<StoryArgs>;

export const story: Story = {
  name: "Display nodes and edges with opacity",
  render: () => template,
  play,
  args: {
    nodesAlpha: 0.5,
    edgesAlpha: 0.5,
  },
  parameters: {
    storySource: {
      source,
    },
  },
};
