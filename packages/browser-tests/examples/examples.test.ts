import { expect, test } from "@playwright/test";

const EXAMPLES = [
  "core/events",
  "core/hover-search",
  "core/large-graph",
  "styling/edge-styles",
  "styling/label-rendering",
  "styling/label-styles",
  "styling/node-borders",
  "styling/node-images",
  "styling/node-piecharts",
  "styling/self-loops",
  "styling/alpha-blending",
];

for (const id of EXAMPLES) {
  test(`example "${id}" renders correctly`, async ({ page }) => {
    await page.goto(`/embed/${id}/?stage-only`);
    await page.waitForSelector("#sigma-container canvas", { timeout: 10000 });
    // Allow WebGL rendering to complete
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(`${id}.png`, {
      maxDiffPixelRatio: 0.001,
    });
  });
}
