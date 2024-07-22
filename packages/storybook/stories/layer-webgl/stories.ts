import type { Meta, StoryObj } from "@storybook/web-components";

import ContourLinePlay from "./contours-highlight-group";
import ContourLineSource from "./contours-highlight-group?raw";
import metaballsPlay from "./contours-metaballs";
import metaballsSource from "./contours-metaballs?raw";
import plainContourLinePlay from "./contours-multi-levels";
import plainContourLineSource from "./contours-multi-levels?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "layer-webgl",
  title: "layer-webgl",
};
export default meta;

type Story = StoryObj;

export const metaballs: Story = {
  name: "Metaballs",
  render: () => template,
  play: metaballsPlay,
  args: {},
  parameters: {
    storySource: {
      source: metaballsSource,
    },
  },
};

export const ContourLine: Story = {
  name: "Highlight groups of nodes",
  render: () => template,
  play: ContourLinePlay,
  args: {},
  parameters: {
    storySource: {
      source: ContourLineSource,
    },
  },
};

export const plainContourLine: Story = {
  name: "Multiple levels",
  render: () => template,
  play: plainContourLinePlay,
  args: {},
  parameters: {
    storySource: {
      source: plainContourLineSource,
    },
  },
};
