import { defineConfig } from "vitest/config";

export default defineConfig({
  mode: "benchmark",
  test: {
    include: ["**/*.ts"],
    browser: {
      provider: "playwright",
      name: "chromium",
      enabled: true,
      headless: true,
    },
  },
});
