import type { Meta, StoryObj } from "@storybook/web-components";

import template from "./index.html?raw";
import nodePieChartPlay from "./node-piechart";
import nodePieChartSource from "./node-piechart?raw";

const meta: Meta = {
  id: "node-piechart",
  title: "node-piechart",
};
export default meta;

type Story = StoryObj;

export const nodePieChart: Story = {
  name: "NodePieChartProgram",
  render: () => template,
  play: nodePieChartPlay,
  args: {},
  parameters: {
    storySource: {
      source: nodePieChartSource,
    },
  },
};