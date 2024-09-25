import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import play from "./index";
import template from "./index.html?raw";
import source from "./saveAsPNG?raw";

const meta: Meta = {
  id: "png-snapshot",
  title: "Core library/Advanced use cases",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "PNG snapshot",
  render: () => template,
  play: wrapStory(play),
  args: {},
  parameters: {
    storySource: {
      source,
    },
  },
};
