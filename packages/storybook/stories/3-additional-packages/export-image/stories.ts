import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import OptionsPlay from "./available-options";
import OptionsSource from "./available-options?raw";
import CustomLayersAndRenderersPlay from "./custom-layers-and-renderers";
import CustomLayersAndRenderersSource from "./custom-layers-and-renderers?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "@sigma/export-image",
  title: "Satellite packages/@sigma--export-image",
};
export default meta;

type Story = StoryObj;

export const availableOptions: Story = {
  name: "Available options",
  render: () => template,
  play: wrapStory(OptionsPlay),
  args: {},
  parameters: {
    storySource: {
      source: OptionsSource,
    },
  },
};

export const customLayersAndRenderers: Story = {
  name: "Custom layers and renderers",
  render: () => template,
  play: wrapStory(CustomLayersAndRenderersPlay),
  args: {},
  parameters: {
    storySource: {
      source: CustomLayersAndRenderersSource,
    },
  },
};
