/* global __dirname */
import { expect, test } from "@playwright/test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SERVER = "http://localhost:4324";
const scenariosDir = join(__dirname, "scenarios");

interface Variant {
  label: string;
  query?: string;
  stage?: { width: number; height: number };
}

const DEFAULT_VARIANT: Variant[] = [{ label: "" }];

for (const file of readdirSync(scenariosDir)) {
  if (!file.endsWith(".ts")) continue;
  const name = file.slice(0, -3);

  const sidecar = join(scenariosDir, `${name}.variants.json`);
  const variants: Variant[] = existsSync(sidecar) ? JSON.parse(readFileSync(sidecar, "utf8")) : DEFAULT_VARIANT;

  for (const { label, query = "", stage } of variants) {
    test(label ? `${name} (${label})` : name, async ({ page }) => {
      if (stage) await page.setViewportSize(stage);
      await page.goto(`${SERVER}/?s=${name}${query ? `&${query}` : ""}`);
      await page.waitForSelector("html[data-ready]", { timeout: 15000 });
      await expect(page).toHaveScreenshot(label ? `${name}-${label}.png` : `${name}.png`, { maxDiffPixelRatio: 0.001 });
    });
  }
}
