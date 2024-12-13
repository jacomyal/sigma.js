import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import arrowHeadsPlay from "./arrow-heads";
import arrowHeadsSource from "./arrow-heads?raw";
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
  id: "@sigma/edge-curve",
  title: "Satellite packages/@sigma--edge-curve",
};
export default meta;

type Story = StoryObj;

export const basic: Story = {
  name: "Basic example",
  render: () => template,
  play: wrapStory(basicPlay),
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
  play: wrapStory(interactionsPlay),
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
  play: wrapStory(labelsPlay),
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
  play: wrapStory(parallelEdgesPlay),
  args: {},
  parameters: {
    storySource: {
      source: parallelEdgesSource,
    },
  },
};

export const arrowHeads: Story = {
  name: "Arrow heads",
  render: () => template,
  play: wrapStory(arrowHeadsPlay),
  args: {},
  parameters: {
    storySource: {
      source: arrowHeadsSource,
    },
  },
};
