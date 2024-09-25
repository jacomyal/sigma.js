import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import fixedColorsPlay from "./fixed-colors";
import fixedColorsSource from "./fixed-colors?raw";
import fixedValuesPlay from "./fixed-values";
import fixedValuesSource from "./fixed-values?raw";
import template from "./index.html?raw";
import offsetsPlay from "./offsets";
import offsetsSource from "./offsets?raw";

const meta: Meta = {
  id: "@sigma/node-piechart",
  title: "Satellite packages/@sigma--node-piechart",
};
export default meta;

type Story = StoryObj;

export const fixedColors: Story = {
  name: "Fixed colors, varying values",
  render: () => template,
  play: wrapStory(fixedColorsPlay),
  args: {},
  parameters: {
    storySource: {
      source: fixedColorsSource,
    },
  },
};

export const fixedValues: Story = {
  name: "Fixed values, varying colors",
  render: () => template,
  play: wrapStory(fixedValuesPlay),
  args: {},
  parameters: {
    storySource: {
      source: fixedValuesSource,
    },
  },
};

export const offsets: Story = {
  name: "Varying offsets",
  render: () => template,
  play: wrapStory(offsetsPlay),
  args: {},
  parameters: {
    storySource: {
      source: offsetsSource,
    },
  },
};
