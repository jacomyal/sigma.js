import { expect, test } from "@playwright/test";

interface ExampleCase {
  id: string;
  waitFor?: number;
  // Extra URL params, and the screenshot name suffix they map to:
  query?: string;
  variant?: string;
}

const EXAMPLES: (string | ExampleCase)[] = [
  // Get started
  "get-started/quickstart",
  "get-started/load-a-dataset",
  "get-started/style-the-graph",
  "get-started/add-interactivity",

  // Core
  "core/camera-control",
  "core/custom-sizes",
  "core/events",
  "core/hover-search",
  "core/large-graph",
  "core/viewport-utilities",

  // Styling
  "styling/alpha-blending",
  "styling/backdrop-styles",
  "styling/custom-node-shape",
  "styling/edge-extremities",
  "styling/edge-label-styles",
  // Zoomed on the curved "above" edge, with the camera upside down:
  { id: "styling/edge-label-styles", query: "camera=0.278,0.5,0.2,3.1416", variant: "upright" },
  { id: "styling/edge-label-styles", query: "camera=0.278,0.5,0.2,3.1416&keepUpright=false", variant: "not-upright" },
  "styling/edge-styles",
  "styling/label-attachments",
  "styling/label-rendering",
  "styling/label-styles",
  "styling/node-borders",
  "styling/node-colors-sizes",
  "styling/node-hover-styles",
  "styling/node-images",
  "styling/node-piecharts",
  "styling/node-shapes",
  "styling/parallel-edges",
  "styling/self-loops",

  // WebGL layers
  "webgl-layers/heatmap",
  "webgl-layers/highlight-group",
  "webgl-layers/multi-levels",

  // Cookbook
  "cookbook/bipartite-network",
  "cookbook/cluster-labels",

  // The canvas only appears after a synchronous 600-iteration ForceAtlas2 run:
  { id: "cookbook/csv-to-network", waitFor: 30000 },

  // Homepage
  { id: "homepage/demo", waitFor: 30000 },
];

for (const example of EXAMPLES) {
  const { id, waitFor = 10000, query, variant } = typeof example === "string" ? { id: example } : example;
  const name = variant ? `${id}-${variant}` : id;

  test(`example "${name}" renders correctly`, async ({ page }) => {
    if (waitFor > 10000) test.slow();
    await page.goto(`/embed/${id}/?stage-only${query ? `&${query}` : ""}`);
    await page.waitForSelector("#sigma-container canvas", { timeout: waitFor });
    // Keep the Astro dev toolbar out of the screenshots:
    await page.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });
    // Allow WebGL rendering to complete
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: 0.001,
    });
  });
}
