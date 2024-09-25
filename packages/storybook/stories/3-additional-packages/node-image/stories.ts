import type { Meta, StoryObj } from "@storybook/web-components";

import { wrapStory } from "../../utils";
import template from "./index.html?raw";
import localImagesPlay from "./local-images";
import localImagesSource from "./local-images?raw";
import nodeImagesPlay from "./node-images";
import nodeImagesSource from "./node-images?raw";
import nodePictogramsPlay from "./node-pictograms";
import nodePictogramsBackgroundPlay from "./node-pictograms-background";
import nodePictogramsBackgroundSource from "./node-pictograms-background?raw";
import nodePictogramsSource from "./node-pictograms?raw";
import optionsShowcasePlay from "./options-showcase";
import optionsShowcaseSource from "./options-showcase?raw";

const meta: Meta = {
  id: "@sigma/node-image",
  title: "Satellite packages/@sigma--node-image",
};
export default meta;

type Story = StoryObj;

export const nodeImages: Story = {
  name: "NodeImageRenderer",
  render: () => template,
  play: wrapStory(nodeImagesPlay),
  args: {},
  parameters: {
    storySource: {
      source: nodeImagesSource,
    },
  },
};

export const nodePictograms: Story = {
  name: "NodePictogramRenderer",
  render: () => template,
  play: wrapStory(nodePictogramsPlay),
  args: {},
  parameters: {
    storySource: {
      source: nodePictogramsSource,
    },
  },
};

export const nodePictogramsWithBackground: Story = {
  name: "NodePictogramRenderer with background colors",
  render: () => template,
  play: wrapStory(nodePictogramsBackgroundPlay),
  args: {},
  parameters: {
    storySource: {
      source: nodePictogramsBackgroundSource,
    },
  },
};

export const localImages: Story = {
  name: "Displaying local images",
  render: () => template,
  play: wrapStory(localImagesPlay),
  args: {},
  parameters: {
    storySource: {
      source: localImagesSource,
    },
  },
};

export const optionsShowcase: Story = {
  name: "Options showcase",
  render: () => template,
  play: wrapStory(optionsShowcasePlay),
  args: {},
  parameters: {
    storySource: {
      source: optionsShowcaseSource,
    },
  },
};
