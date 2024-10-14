import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "fit-sizes-to-positions",
  title: "Core library/Advanced use cases",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "Customize how sigma handles sizes and positions",
  render: () => template,
  play: wrapStory(play),
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
