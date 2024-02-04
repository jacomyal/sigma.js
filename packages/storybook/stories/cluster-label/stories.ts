import { Meta, StoryObj } from "@storybook/html";

import template from "./index.html?raw";
import source from "./index?raw";
import play from "./index";

type StroyArgs = {};

const meta: Meta<StroyArgs> = {
  id: "cluster-label",
  title: "Examples",
};
export default meta;

type Story = StoryObj<StroyArgs>;
export const story: Story = {
  name: "Adding label on clusters",
  render: () => template,
  play: play,
  parameters: {
    storySource: {
      source,
    },
  },
};
