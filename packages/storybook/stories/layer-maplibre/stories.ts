import { Meta, StoryObj } from "@storybook/html";

import basicPlay from "./basic";
import basicSource from "./basic?raw";
import geojsonPlay from "./geojson";
import geojsonSource from "./geojson?raw";
import template from "./index.html?raw";

const meta: Meta = {
  id: "layer-maplibre",
  title: "layer-maplibre",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "Basic example",
  render: () => template,
  play: basicPlay,
  parameters: {
    storySource: {
      source: basicSource,
    },
  },
};

export const withAGeoJson: Story = {
  name: "Map interactions",
  render: () => template,
  play: geojsonPlay,
  parameters: {
    storySource: {
      source: geojsonSource,
    },
  },
};
