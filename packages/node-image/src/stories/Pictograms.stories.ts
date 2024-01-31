import { createPictogramsStage } from "./Pictograms";

export default {
  title: "node-image/Pictograms",
  render: () => createPictogramsStage(),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
};

export const Default = {};
