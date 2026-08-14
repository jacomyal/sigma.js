import { playwright } from "@vitest/browser-playwright";
import process from "node:process";
import { defineConfig, defineProject } from "vitest/config";

// 8 browser providers each add a SIGTERM listener
process.setMaxListeners(20);

// Packages with browser-mode unit tests (`*.test.ts`):
const UNIT_PACKAGES = [
  "sigma",
  "node-image",
  "node-border",
  "node-piechart",
  "utils",
  "layer-leaflet",
  "layer-maplibre",
  "layout-fa2-gpu",
];

// Packages with type tests (`*.test-d.ts`). Browser (Playwright) tests live in
// `packages/browser-tests` and run separately — not part of this config.
const TYPE_PACKAGES = ["sigma", "node-image", "node-border", "node-piechart"];

export default defineConfig({
  test: {
    projects: [
      ...UNIT_PACKAGES.map((pkg) =>
        defineProject({
          test: {
            name: pkg,
            root: `packages/${pkg}`,
            include: ["src/**/*.test.ts"],
            browser: {
              enabled: true,
              provider: playwright(),
              instances: [{ browser: "chromium", headless: true }],
            },
          },
        }),
      ),
      // Typecheck projects: no browser, isolated so `--project '!*:types'` can
      // skip them when only unit tests are wanted.
      ...TYPE_PACKAGES.map((pkg) =>
        defineProject({
          test: {
            name: `${pkg}:types`,
            root: `packages/${pkg}`,
            include: [],
            typecheck: {
              enabled: true,
              include: ["src/**/*.test-d.ts"],
              ignoreSourceErrors: true,
            },
          },
        }),
      ),
    ],
  },
});
