import type { StorybookConfig } from "@storybook/html-vite";
import { dirname, join } from "path";
import { mergeConfig } from "vite";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: ["../stories/**/stories.ts", "../../**/src/**/*.mdx", "../../**/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-storysource"),
  ],
  framework: getAbsolutePath("@storybook/html-vite"),
  typescript: {
    check: true,
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: ["../public"],
  logLevel: "debug",
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        preserveSymlinks: false,
      },
    });
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
