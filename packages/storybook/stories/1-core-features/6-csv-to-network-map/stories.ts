import { Meta, StoryObj } from "@storybook/html";

import { wrapStory } from "../../utils";
import play from "./index";
import template from "./index.html?raw";
import source from "./index?raw";

const meta: Meta = {
  id: "csv-to-network-map",
  title: "Core library/Features showcases",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "From CSV to network maps",
  render: () => template,
  play: wrapStory(play),
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
