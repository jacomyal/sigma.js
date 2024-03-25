import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import nodeBorderPlay from "./node-border";
import nodeBorderSource from "./node-border?raw";
import pixelsBorderPlay from "./pixels-border";
import pixelsBorderSource from "./pixels-border?raw";

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
