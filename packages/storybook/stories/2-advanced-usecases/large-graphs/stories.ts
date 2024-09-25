import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

type StoryArgs = {
  order: number;
  size: number;
  clusters: number;
  edgesRenderer: "edges-default" | "edges-fast";
};

const meta: Meta<StoryArgs> = {
  id: "large-graphs",
  title: "Core library/Advanced use cases",
  argTypes: {
    order: {
      name: "Number of nodes",
      defaultValue: 5000,
      control: { type: "number", step: "100", min: "100" },
    },
    size: {
      name: "Number of edges",
      defaultValue: 10000,
      control: { type: "number", step: "100", min: "100" },
    },
    clusters: {
      name: "Number of clusters",
      defaultValue: 3,
      control: { type: "number", step: "1", min: "1" },
    },
    edgesRenderer: {
      name: "Edges renderer",
      defaultValue: "edge-default",
      options: ["edges-default", "edges-fast"],
      control: {
        type: "radio",
      },
    },
  },
};
export default meta;

type Story = StoryObj<StoryArgs>;

export const story: Story = {
  name: "Performances showcase",
  render: () => template,
  play: wrapStory(play),
  args: {
    order: 5000,
    size: 1000,
    clusters: 3,
    edgesRenderer: "edges-default",
  },
  parameters: {
    storySource: {
      source,
    },
  },
};
