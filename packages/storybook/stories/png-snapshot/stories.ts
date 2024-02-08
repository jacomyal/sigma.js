import type { Meta, StoryObj } from "@storybook/web-components";

import play from "./index";
import template from "./index.html?raw";
import source from "./saveAsPNG?raw";

const meta: Meta = {
  id: "png-snapshot",
  title: "Examples",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: " PNG snapshot",
  render: () => template,
  play,
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
