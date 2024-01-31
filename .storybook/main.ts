import type { StorybookConfig } from "@storybook/html-vite";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: ["../packages/**/src/**/*.mdx", "../packages/**/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: "@storybook/html-vite",
  typescript: {
    check: true,
    skipBabel: false,
  },
  docs: {
    autodocs: "tag",
  },
  logLevel: "debug",
};
export default config;
