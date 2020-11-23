import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import puppeteer, { Browser, Page } from "puppeteer";
import assert from "assert";
import path from "path";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { Test } from "./config";

// To avoid "implicit any" error
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require("./../../examples/webpack.config");

/**
 * Take the screenshots.
 *
 * @param {Test} test Page that should be taking in screenshot
 * @param {string} folder Path where to saved the screenshots
 * @param {string} suffix The filename will be suffixed with it
 */
export async function takeScreenshot(browser: Browser, test: Test, folder: string, suffix = ""): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Open a new page
    const page: Page = await browser.newPage();

    // Navigate to URL
    await page.goto(test.url);
    console.log(`Page ${test.url} is loaded`);

    // Running the scenario (if needed)
    if (test.scenario) {
      console.log(`Running scenario for ${test.name}`);
      await test.scenario(browser, page);
    }

    // Taking the screenshot
    setTimeout(() => {
      console.log(`Generate screenshot for ${test.name} : ${test.url}`);
      // Take the screenshot
      page
        .screenshot({ path: path.resolve(`${folder}/${test.name}.${suffix}.png`) })
        .then(() => {
          console.log(`${test.url} saved in ${test.name}.${suffix}.png`);
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }, test.waitFor || 0);
  });
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

/**
 * Start the webpack dev server.
 */
export function startExampleServer(): Promise<WebpackDevServer> {
  return new Promise((resolve) => {
    const compiler = Webpack(webpackConfig);
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      open: false,
      stats: {
        colors: true,
      },
    });
    const server = new WebpackDevServer(compiler, devServerOptions);
    server.listen(8000, "127.0.0.1", () => {
      resolve(server);
    });
  });
}

export async function runTest(browser: Browser, test: Test): Promise<void> {
  await takeScreenshot(browser, test, "./test/e2e/screenshots/", "current");
  const result = imageDiff(
    path.resolve(`./test/e2e/screenshots/${test.name}.valid.png`),
    path.resolve(`./test/e2e/screenshots/${test.name}.current.png`),
    path.resolve(`./test/e2e/screenshots/${test.name}.diff.png`),
  );
  assert(
    result.percent <= (test.failureThreshold || 0),
    `There is a diff over ${test.failureThreshold || 0} on ${test.name}, please check "${test.name}.diff.png"`,
  );
}
