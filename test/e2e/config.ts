import { Browser, Page } from "puppeteer";

export interface Test {
  name: string; // Name of the screenshot, without the extension like for example 'example-basic'
  url: string; // Url of the page to take in screenshot
  waitFor?: number; // Time to wait in ms before to take the screenshot
  scenario?: (browser: Browser, page: Page) => Promise<void>;
  failureThreshold?: number; // between 0 and 1, it's a percent. By default it's 0.
}

export const tests: Array<Test> = [
  {
    name: "animations",
    url: "http://localhost:8000/animations.html?seed=foo",
    scenario: async (browser: Browser, page: Page): Promise<void> => {
      await page.evaluate(() => {
        return new Promise((resolve, reject) => {
          window.addEventListener("AnimationDone", resolve);
        });
      });
    },
  },
  { name: "basic", url: "http://localhost:8000/basic.html?seed=foo" },
  { name: "connected-components", url: "http://localhost:8000/components.html?seed=foo" },
  { name: "drag", url: "http://localhost:8000/drag.html?seed=foo" },
  { name: "dynamic-graph", url: "http://localhost:8000/dynamic.html?seed=foo" },
  { name: "events", url: "http://localhost:8000/events.html?seed=foo" },
  { name: "gexf", url: "http://localhost:8000/gexf.html?seed=foo" },
  { name: "force-atlas-2-layout", url: "http://localhost:8000/layout.html?seed=foo" },
  { name: "noverlap-layout", url: "http://localhost:8000/noverlap.html?seed=foo", failureThreshold: 0.00005 },
  { name: "performance", url: "http://localhost:8000/performance.html?seed=foo" },
  { name: "settings", url: "http://localhost:8000/settings.html?seed=foo" },
  {
    name: "settings-mouse-zoom",
    url: "http://localhost:8000/settings.html?seed=foo",
    waitFor: 2000,
    scenario: async (browser: Browser, page: Page): Promise<void> => {
      await page.evaluate(() => {
        const element: any = document.getElementsByClassName("sigma-mouse")[0];
        const cEvent: any = new Event("wheel");
        cEvent.clientX = 0;
        cEvent.clientY = 0;
        cEvent.deltaY = -100;
        element.dispatchEvent(cEvent);
      });
      return;
    },
  },
  { name: "tiny-graph", url: "http://localhost:8000/tiny.html?seed=foo" },
  { name: "edge-labels", url: "http://localhost:8000/edge-labels.html?seed=foo" },
  { name: "custom-nodes-renderer", url: "http://localhost:8000/custom-nodes.html?seed=foo" },
  {
    name: "camera-rotation ",
    url: "http://localhost:8000/rotation.html?seed=foo",
    scenario: async (browser: Browser, page: Page): Promise<void> => {
      await page.evaluate(() => {
        return new Promise((resolve, reject) => {
          window.addEventListener("RotationDone", resolve);
        });
      });
    },
  },
];
