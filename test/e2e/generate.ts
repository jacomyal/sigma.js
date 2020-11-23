import path from "path";
import puppeteer, { Browser } from "puppeteer";
import { startExampleServer, takeScreenshot } from "./utils";
import { tests } from "./config";

async function exec() {
  try {
    const server = await startExampleServer();
    // Launch the browser
    const browser: Browser = await puppeteer.launch();
    // Take screenshots
    await Promise.all(
      tests.map(async (test) => {
        return await takeScreenshot(browser, test, path.resolve(`./test/e2e/screenshots`), "valid");
      }),
    );

    server.close(() => {
      browser.close();
      process.exit();
    });
  } catch (e) {
    console.log("Error on generating screenshots", e);
  } finally {
    process.exit();
  }
}

exec();
