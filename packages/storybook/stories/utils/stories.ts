import type { Meta, StoryObj } from "@storybook/web-components";

import FitNodesToViewportPlay from "./fit-nodes-to-viewport";
import FitNodesToViewportSource from "./fit-nodes-to-viewport?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "utils",
  title: "utils",
};
export default meta;

type Story = StoryObj;

export const FitNodesToViewport: Story = {
  name: "Fit nodes to viewport",
  render: () => template,
  play: FitNodesToViewportPlay,
  args: {},
  parameters: {
    storySource: {
      source: FitNodesToViewportSource,
    },
  },
};
