import type { Meta, StoryObj } from "@storybook/web-components";

import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "node-image",
  title: "node-image",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "All features",
  render: () => template,
  play,
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
