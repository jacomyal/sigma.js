import { defineWorkspace } from "vitest/config";

// Packages with browser-mode unit tests (`*.test.ts`):
const UNIT_PACKAGES = [
  "sigma",
  "node-image",
  "node-border",
  "node-piechart",
  "utils",
  "layer-leaflet",
  "layer-maplibre",
];

// Packages with type tests (`*.test-d.ts`). Each lives in the package whose
// public types it asserts. Browser (Playwright) tests live in
// `packages/browser-tests` and run separately — not part of this workspace.
const TYPE_PACKAGES = ["sigma", "node-image", "node-border", "node-piechart"];

export default defineWorkspace([
  ...UNIT_PACKAGES.map((pkg) => ({
    test: {
      name: pkg,
      root: `packages/${pkg}`,
      include: ["src/**/*.test.ts"],
      browser: {
        provider: "playwright",
        name: "chromium",
        enabled: true,
        headless: true,
      },
    },
  })),
  // Typecheck runs in its own project (no browser) so `vitest typecheck` and
  // `vitest run` stay independent.
  ...TYPE_PACKAGES.map((pkg) => ({
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
  })),
]);
