/* global __dirname */
import { expect, test } from "@playwright/test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const SERVER = "http://localhost:4324";
const scenariosDir = join(__dirname, "scenarios");

for (const file of readdirSync(scenariosDir)) {
  if (!file.endsWith(".ts")) continue;
  const name = file.slice(0, -3);

  test(name, async ({ page }) => {
    await page.goto(`${SERVER}/?s=${name}`);
    await page.waitForSelector("html[data-ready]", { timeout: 15000 });
    await expect(page).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.001 });
  });
}
