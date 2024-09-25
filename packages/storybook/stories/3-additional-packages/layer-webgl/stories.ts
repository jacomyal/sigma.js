import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import ContourLinePlay from "./contours-highlight-group";
import ContourLineSource from "./contours-highlight-group?raw";
import metaballsPlay from "./contours-metaballs";
import metaballsSource from "./contours-metaballs?raw";
import plainContourLinePlay from "./contours-multi-levels";
import plainContourLineSource from "./contours-multi-levels?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "@sigma/layer-webgl",
  title: "Satellite packages/@sigma--layer-webgl",
};
export default meta;

type Story = StoryObj;

export const metaballs: Story = {
  name: "Metaballs",
  render: () => template,
  play: wrapStory(metaballsPlay),
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
  play: wrapStory(ContourLinePlay),
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
  play: wrapStory(plainContourLinePlay),
  args: {},
  parameters: {
    storySource: {
      source: plainContourLineSource,
    },
  },
};
