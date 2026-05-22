/* global process */
import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests for sigma.js, two suites:
 *  - `examples/`   screenshots every website example (served by the website).
 *  - `regression/` per-bug scenarios (served by a Vite dev server).
 */
export default defineConfig({
  testDir: ".",
  snapshotPathTemplate: "{testFileDir}/snapshots/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4323",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        // Pin the WebGL stack to SwiftShader so snapshots are identical across machines (local dev, CI, contributors).
        // Without this, rendering goes through each host's GPU driver and alpha-heavy scenes diverge by a few percent
        // of pixels.
        launchOptions: {
          args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu"],
        },
      },
    },
  ],

  webServer: [
    {
      // Website dev server: hosts the documented examples at /embed/{id}/
      command: "npm run start --workspace=@sigma/website -- --port 4323",
      url: "http://localhost:4323",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      // Regression dev server: hosts the scenario host page at /?s={scenario}
      command: "npm run serve:regression -- --port 4324 --strictPort",
      url: "http://localhost:4324",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
