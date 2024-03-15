import type { Meta, StoryObj } from "@storybook/web-components";

import basicPlay from "./basic";
import basicSource from "./basic?raw";
import template from "./index.html?raw";
import interactionsPlay from "./interactions";
import interactionsSource from "./interactions?raw";
import labelsPlay from "./labels";
import labelsSource from "./labels?raw";
import parallelEdgesPlay from "./parallel-edges";
import parallelEdgesSource from "./parallel-edges?raw";

const meta: Meta = {
  id: "edge-curve",
  title: "edge-curve",
};
export default meta;

type Story = StoryObj;

export const basic: Story = {
  name: "Basic example",
  render: () => template,
  play: basicPlay,
  args: {},
  parameters: {
    storySource: {
      source: basicSource,
    },
  },
};

export const interactions: Story = {
  name: "Interactions",
  render: () => template,
  play: interactionsPlay,
  args: {},
  parameters: {
    storySource: {
      source: interactionsSource,
    },
  },
};

export const labels: Story = {
  name: "Labels",
  render: () => template,
  play: labelsPlay,
  args: {},
  parameters: {
    storySource: {
      source: labelsSource,
    },
  },
};

export const parallelEdges: Story = {
  name: "Parallel edges",
  render: () => template,
  play: parallelEdgesPlay,
  args: {},
  parameters: {
    storySource: {
      source: parallelEdgesSource,
    },
  },
};
