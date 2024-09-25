import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import template from "./index.html?raw";
import mixedProgramsPlay from "./mixed-programs";
import mixedProgramsSource from "./mixed-programs?raw";

const meta: Meta = {
  id: "@sigma/node-square",
  title: "Satellite packages/@sigma--node-square",
};
export default meta;

type Story = StoryObj;

export const mixedPrograms: Story = {
  name: "Mixed programs",
  render: () => template,
  play: wrapStory(mixedProgramsPlay),
  args: {},
  parameters: {
    storySource: {
      source: mixedProgramsSource,
    },
  },
};
