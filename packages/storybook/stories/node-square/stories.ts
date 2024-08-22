import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import mixedProgramsPlay from "./mixed-programs";
import mixedProgramsSource from "./mixed-programs?raw";

const meta: Meta = {
  id: "node-square",
  title: "node-square",
};
export default meta;

type Story = StoryObj;

export const mixedPrograms: Story = {
  name: "Mixed programs",
  render: () => template,
  play: mixedProgramsPlay,
  args: {},
  parameters: {
    storySource: {
      source: mixedProgramsSource,
    },
  },
};
