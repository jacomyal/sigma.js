import { Meta, StoryObj } from "@storybook/html";

import basicPlay from "./basic";
import basicSource from "./basic?raw";
import geojsonPlay from "./geojson";
import geojsonSource from "./geojson?raw";
import template from "./index.html?raw";
import tilelayerPlay from "./tilelayer";
import tilelayerSource from "./tilelayer?raw";

const meta: Meta = {
  id: "layer-leaflet",
  title: "layer-leaflet",
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

export const otherTileLayer: Story = {
  name: "Other tile layer",
  render: () => template,
  play: tilelayerPlay,
  parameters: {
    storySource: {
      source: tilelayerSource,
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
