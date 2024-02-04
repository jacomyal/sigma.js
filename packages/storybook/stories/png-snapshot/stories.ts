import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import source from "./saveAsPNG?raw";
import play from "./index";

type StroyArgs = {};

const meta: Meta<StroyArgs> = {
  id: "png-snapshot",
  title: "Examples",
};
export default meta;

type Story = StoryObj<StroyArgs>;

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
