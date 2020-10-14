export type Pages = Array<{
  url: string; // Url of the page to take in screenshot
  filename: string; // Name of the screenshot, without the extension like for example 'example-basic'
  waitFor?: number; // Time to wait in ms before to take the screenshot
}>;

export const pages: Pages = [
  { url: "http://localhost:8000/drag.html", filename: "drag", waitFor: 2000 },
  { url: "http://localhost:8000/gexf.html", filename: "gexf" },
  { url: "http://localhost:8000/settings.html", filename: "settings" },
  { url: "http://localhost:8000/tiny.html", filename: "tiny" },
  { url: "http://localhost:8000/edge-labels.html", filename: "edge-labels" },
];
