import type { Meta, StoryObj } from "@storybook/web-components";

import fixedColorsPlay from "./fixed-colors";
import fixedColorsSource from "./fixed-colors?raw";
import fixedSizesPlay from "./fixed-sizes";
import fixedSizesSource from "./fixed-sizes?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "node-piechart",
  title: "node-piechart",
};
export default meta;

type Story = StoryObj;

export const fixedColors: Story = {
  name: "Fixed colors, varying sizes",
  render: () => template,
  play: fixedColorsPlay,
  args: {},
  parameters: {
    storySource: {
      source: fixedColorsSource,
    },
  },
};

export const fixedSizes: Story = {
  name: "Fixed sizes, varying colors",
  render: () => template,
  play: fixedSizesPlay,
  args: {},
  parameters: {
    storySource: {
      source: fixedSizesSource,
    },
  },
};
