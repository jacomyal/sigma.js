import { Meta, StoryObj } from "@storybook/html";

import play from ".";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "events-shadowdom",
  title: "Examples",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "Events ShadowDom",
  render: () => template,
  play: play,
  parameters: {
    storySource: {
      source: source,
    },
  },
};
