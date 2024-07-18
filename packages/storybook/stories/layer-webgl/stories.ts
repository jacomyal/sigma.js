import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import metaballsPlay from "./metaballs";
import metaballsSource from "./metaballs?raw";

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
