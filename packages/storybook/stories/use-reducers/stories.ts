import type { Meta, StoryObj } from "@storybook/web-components";

import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "use-reducers",
  title: "Examples",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "Use node and edge reducers",
  render: () => template,
  play,
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
