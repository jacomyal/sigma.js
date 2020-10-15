import path from "path";
import { startExampleServer, takeScreenshots } from "./utils";
import { pages } from "./config";

async function exec() {
  try {
    const server = await startExampleServer();
    await takeScreenshots(pages, path.resolve(`./test/e2e/screenshots`), "valid");
    server.close(() => {
      process.exit();
    });
  } catch (e) {
    console.log("Error on generating screenshots", e);
  } finally {
    process.exit();
  }
}

exec();
