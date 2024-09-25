import { Meta, StoryObj } from "@storybook/html";

import { wrapStory } from "../../utils";
import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "cluster-label",
  title: "Core library/Advanced use cases",
};
export default meta;

type Story = StoryObj;
export const story: Story = {
  name: "Adding label on clusters",
  render: () => template,
  play: wrapStory(play),
  parameters: {
    storySource: {
      source,
    },
  },
};
