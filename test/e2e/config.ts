export type Tests = Array<{
  name: string; // Name of the screenshot, without the extension like for example 'example-basic'
  url: string; // Url of the page to take in screenshot
  waitFor?: number; // Time to wait in ms before to take the screenshot
}>;

export const tests: Tests = [
  { name: "drag", url: "http://localhost:8000/drag.html", waitFor: 2000 },
  { name: "gexf", url: "http://localhost:8000/gexf.html" },
  { name: "settings", url: "http://localhost:8000/settings.html" },
  { name: "tiny", url: "http://localhost:8000/tiny.html" },
  { name: "edge-labels", url: "http://localhost:8000/edge-labels.html" },
];
