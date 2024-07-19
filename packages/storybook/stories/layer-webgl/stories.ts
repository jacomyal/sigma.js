import type { Meta, StoryObj } from "@storybook/web-components";

import ContourLinePlay from "./contour-line";
import ContourLineSource from "./contour-line?raw";
import template from "./index.html?raw";
import metaballsPlay from "./metaballs";
import metaballsSource from "./metaballs?raw";
import plainContourLinePlay from "./plain-contour-lines";
import plainContourLineSource from "./plain-contour-lines?raw";

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
  name: "Contour lines",
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
  name: "Plain contour lines",
  render: () => template,
  play: plainContourLinePlay,
  args: {},
  parameters: {
    storySource: {
      source: plainContourLineSource,
    },
  },
};
