import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import source from "./index?raw";
import play from "./index";

type StroyArgs = {};

const meta: Meta<StroyArgs> = {
  id: "use-reducers",
  title: "Examples",
};
export default meta;

type Story = StoryObj<StroyArgs>;

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
