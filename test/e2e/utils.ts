import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { Tests } from "./suites";

// to avoid implicit any error
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require("./web/webpack.config");

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
          await page.exposeFunction("e2eTestScenario", test.scenario);

          const dimensions = test.dimensions || { width: 800, height: 600 };
          await page.setViewport(dimensions);

          test.scenario(page);

          // Taking the screenshot
          setTimeout(async () => {
            // Take the screenshot
            await page.screenshot({ path: path.resolve(`${folder}/${test.name}.${suffix}.png`) });
            console.log(`"${test.name}" saved in ${test.name}.${suffix}.png`);
            resolve();
          }, test.waitFor || 0);
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
