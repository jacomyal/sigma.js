import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/html-vite";
import { mergeConfig } from "vite";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: ["../packages/**/src/**/*.mdx", "../packages/**/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: getAbsolutePath("@storybook/html-vite"),
  typescript: {
    check: true,
    skipBabel: false,
  },
  docs: {
    autodocs: "tag",
  },
  logLevel: "debug",
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        preserveSymlinks: true,
      },
    });
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
