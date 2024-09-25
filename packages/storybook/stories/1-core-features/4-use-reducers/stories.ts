import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "use-reducers",
  title: "Core library/Features showcases",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "Use node and edge reducers",
  render: () => template,
  play: wrapStory(play),
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
