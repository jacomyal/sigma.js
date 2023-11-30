import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import puppeteer, { Page } from "puppeteer";
import path from "path";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import Graph from "graphology";

import Sigma from "../../src/sigma";

// to avoid implicit any error
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require("./web/webpack.config");

declare global {
  const dependencies: TestDependencies;
}

export type Test = {
  name: string; // Name of the screenshot, without the extension like for example 'example-basic'
  waitFor?: number; // Time to wait in ms before to take the screenshot
  scenario: (page: Page) => Promise<void>;
  failureThreshold?: number; // between 0 and 1, it's a percent. By default, it's a small epsilon.
  dimensions?: { width: number; height: number };
};

export type Tests = Test[];

export type TestDependencies = {
  Graph: typeof Graph;
  Sigma: typeof Sigma;
  data: { [key: string]: Graph };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  programs: { [key: string]: any };
  container: HTMLElement;

  // Utils:
  rafNTimes: (fn: (step: number) => void, n: number) => Promise<void>;
};

export type TestReport = {
  name: string;
  records: number[];
  average: number;
};

function bindLogs(page: Page, prefix: string) {
  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    const cleanedArgs = [];
    for (let i = 0; i < msgArgs.length; ++i) {
      cleanedArgs.push(await msgArgs[i].jsonValue());
    }
    console.log(prefix, ...cleanedArgs);
  });
}

/**
 * Take the screenshots.
 *
 * @param {Array<Tests>} tests List of pages that should be taking in screenshot
 * @param {string} folder Path where to saved the screenshots
 * @param {string} suffix The filename will be suffixed with it
 */
export async function takeScreenshots(tests: Tests, folder: string, port = 8000, suffix = ""): Promise<void> {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--window-size=800,600", "--font-render-hinting=none", "--disable-font-subpixel-positioning"],
  });
  const testPageUrl = `http://localhost:${port}`;

  // for each pages
  await Promise.all(
    tests.map((test) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          // Open a new page
          const page = await browser.newPage();

          // Navigate to URL
          await page.goto(testPageUrl);

          const dimensions = test.dimensions || { width: 800, height: 600 };
          await page.setViewport(dimensions);

          // bindLogs(page, `[${test.name} -> page]`);
          test.scenario(page);

          // Taking the screenshot
          await page.screenshot({ path: path.resolve(`${folder}/${test.name}.${suffix}.png`) });
          console.log(`"${test.name}" saved in ${test.name}.${suffix}.png`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }),
  );

  // Close the browser
  await browser.close();
}

/**
 * Generate a benchmarks report.
 *
 * @param {Array<Tests>} tests List of pages that should be taking in screenshot
 * @param {number} runs Number of times to run each scenario
 * @param {boolean} headless Should the tests be executed in a headless browser?
 */
export async function getReport(tests: Tests, runs: number, headless: boolean, port = 8000): Promise<TestReport[]> {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: headless && "new",
    args: ["--window-size=800,600", "--font-render-hinting=none", "--disable-font-subpixel-positioning"],
  });
  const testPageUrl = `http://localhost:${port}`;
  const report: TestReport[] = [];

  await tests.reduce((promise, test) => {
    return promise.then(async () => {
      const records: number[] = [];
      for (let i = 0; i < runs; i++) {
        // Open a new page
        const page = await browser.newPage();

        // Navigate to URL
        await page.goto(testPageUrl);

        const dimensions = test.dimensions || { width: 800, height: 600 };
        await page.setViewport(dimensions);

        const t1 = Date.now();
        // bindLogs(page, `[${test.name} -> page]`);
        await test.scenario(page);
        const time = Date.now() - t1;
        records.push(time);

        await page.close();

        console.log(`[${test.name}] Run ${i + 1} / ${runs} (${time}ms)`);
      }

      const sum = records.reduce((a, b) => a + b, 0);
      const avg = sum / records.length;
      console.log(`Test "${test.name}" executed ${runs} times in ${sum}ms (average: ${avg}ms)`);
      report.push({
        name: test.name,
        records,
        average: avg,
      });
    });
  }, Promise.resolve());

  // Close the browser
  await browser.close();

  return report;
}

/**
 * Make a diff between two images.
 *
 * @param {string} image1 path to the first image
 * @param {string} image2 path to the second image
 * @param {string} diffFilename path for the diff image that will be generated
 * @returns An object with the number of pixel that are diff, and the percent of change
 */
export function imageDiff(image1: string, image2: string, diffFilename: string): { diff: number; percent: number } {
  const img1 = PNG.sync.read(fs.readFileSync(path.resolve(image1)));
  const img2 = PNG.sync.read(fs.readFileSync(path.resolve(image2)));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const nbPixelInDiff: number = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(path.resolve(diffFilename), PNG.sync.write(diff));

  return { diff: nbPixelInDiff, percent: nbPixelInDiff / (width * height) };
}

export function startExampleServer(port = 8000): Promise<WebpackDevServer> {
  return new Promise((resolve) => {
    const compiler = Webpack(webpackConfig);
    const devServerOptions = {
      port,
      host: "0.0.0.0",
      open: false,
      static: {
        directory: path.resolve(__dirname, "web"),
        serveIndex: true,
      },
    };

    const server = new WebpackDevServer(devServerOptions, compiler);

    server.startCallback(() => {
      resolve(server);
    });
  });
}
