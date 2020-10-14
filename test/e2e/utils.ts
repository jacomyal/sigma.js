import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { Pages } from "./config";

// to avoid implicit any error
import webpackConfig = require("./../../examples/webpack.config");

/**
 * Take the screenshots.
 *
 * @param {Array<Pages>} pages List of pages that should be taking in screenshot
 * @param {string} folder Path where to saved the screenshots
 * @param {string} suffix The filename will be suffixed with it
 */
export async function takeScreenshots(pages: Pages, folder: string, suffix = ""): Promise<void> {
  // Launch the browser
  const browser = await puppeteer.launch();

  // for each pages
  await Promise.all(
    pages.map((item) => {
      return new Promise(async (resolve, reject) => {
        try {
          // Open a new page
          const page = await browser.newPage();
          // Navigate to URL
          await page.goto(item.url);
          // Taking the screenshot
          setTimeout(async () => {
            // Take the screenshot
            await page.screenshot({ path: path.resolve(`${folder}/${item.filename}.${suffix}.png`) });
            console.log(`${item.url} saved in ${item.filename}.${suffix}.png`);
            resolve();
          }, item.waitFor || 0);
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

export function startExampleServer(): Promise<void> {
  return new Promise((resolve) => {
    const compiler = Webpack(webpackConfig);
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      open: true,
      stats: {
        colors: true,
      },
    });
    const server = new WebpackDevServer(compiler, devServerOptions);
    server.listen(8000, "127.0.0.1", () => {
      resolve();
    });
  });
}
