import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import nodeBorderPlay from "./node-border";
import nodeBorderSource from "./node-border?raw";
import pixelsBorderPlay from "./pixels-border";
import pixelsBorderSource from "./pixels-border?raw";
import variableSizesPlay from "./variable-sizes";
import variableSizesSource from "./variable-sizes?raw";
import withImagesPlay from "./with-images";
import withImagesSource from "./with-images?raw";

const meta: Meta = {
  id: "node-border",
  title: "node-border",
};
export default meta;

type Story = StoryObj;

export const nodeBorder: Story = {
  name: "NodeBorderProgram",
  render: () => template,
  play: nodeBorderPlay,
  args: {},
  parameters: {
    storySource: {
      source: nodeBorderSource,
    },
  },
};

export const pixelsBorder: Story = {
  name: '"pixels" mode for border sizes',
  render: () => template,
  play: pixelsBorderPlay,
  args: {},
  parameters: {
    storySource: {
      source: pixelsBorderSource,
    },
  },
};

export const withImages: Story = {
  name: "Combined with images",
  render: () => template,
  play: withImagesPlay,
  args: {},
  parameters: {
    storySource: {
      source: withImagesSource,
    },
  },
};

export const variableSizes: Story = {
  name: "Variable border sizes",
  render: () => template,
  play: variableSizesPlay,
  args: {},
  parameters: {
    storySource: {
      source: variableSizesSource,
    },
  },
};
