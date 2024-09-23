import type { Meta, StoryObj } from "@storybook/web-components";

import FitViewportToNodesPlay from "./fit-viewport-to-nodes";
import FitViewportToNodesSource from "./fit-viewport-to-nodes?raw";
import GetNodesInViewportPlay from "./get-nodes-in-viewport";
import GetNodesInViewportSource from "./get-nodes-in-viewport?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "utils",
  title: "utils",
};
export default meta;

type Story = StoryObj;

export const FitViewportToNodes: Story = {
  name: "Fit viewport to nodes",
  render: () => template,
  play: FitViewportToNodesPlay,
  args: {},
  parameters: {
    storySource: {
      source: FitViewportToNodesSource,
    },
  },
};

export const GetNodesInViewport: Story = {
  name: "Get nodes in viewport",
  render: () => template,
  play: GetNodesInViewportPlay,
  args: {},
  parameters: {
    storySource: {
      source: GetNodesInViewportSource,
    },
  },
};
