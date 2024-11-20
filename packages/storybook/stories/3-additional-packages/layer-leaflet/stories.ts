import { Meta, StoryObj } from "@storybook/html";

import { wrapStory } from "../../utils";
import basicPlay from "./basic";
import basicSource from "./basic?raw";
import geojsonPlay from "./geojson";
import geojsonSource from "./geojson?raw";
import template from "./index.html?raw";
import resizePlay from "./resize";
import resizeSource from "./resize?raw";
import tilelayerPlay from "./tilelayer";
import tilelayerSource from "./tilelayer?raw";

const meta: Meta = {
  id: "@sigma/layer-leaflet",
  title: "Satellite packages/@sigma--layer-leaflet",
};
export default meta;

type Story = StoryObj;

export const story: Story = {
  name: "Basic example",
  render: () => template,
  play: wrapStory(basicPlay),
  parameters: {
    storySource: {
      source: basicSource,
    },
  },
};

export const otherTileLayer: Story = {
  name: "Other tile layer",
  render: () => template,
  play: wrapStory(tilelayerPlay),
  parameters: {
    storySource: {
      source: tilelayerSource,
    },
  },
};

export const withAGeoJson: Story = {
  name: "Map interactions",
  render: () => template,
  play: wrapStory(geojsonPlay),
  parameters: {
    storySource: {
      source: geojsonSource,
    },
  },
};

export const resize: Story = {
  name: "Change dimensions",
  render: () => template,
  play: wrapStory(resizePlay),
  parameters: {
    storySource: {
      source: resizeSource,
    },
  },
};
