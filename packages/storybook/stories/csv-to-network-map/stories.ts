import { Meta, StoryObj } from "@storybook/html";

import template from "./index.html?raw";
import source from "./index?raw";
import play from "./index";

type StroyArgs = {};

const meta: Meta<StroyArgs> = {
  id: "csv-to-network-map",
  title: "Examples",
};
export default meta;

type Story = StoryObj<StroyArgs>;

export const story: Story = {
  name: "From CSV to network mapples",
  render: () => template,
  play,
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
