import path from "path";
import { startExampleServer, takeScreenshots } from "./utils";
import { tests } from "./suites";

async function exec() {
  try {
    const server = await startExampleServer();
    await takeScreenshots(tests, path.resolve(`./test/e2e/screenshots`), 8000, "valid");
    server.stopCallback(() => {
      process.exit();
    });
  } catch (e) {
    console.log("Error on generating screenshots", e);
  } finally {
    process.exit();
  }
}

exec();
