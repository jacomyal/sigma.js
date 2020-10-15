import path from "path";
import { startExampleServer, takeScreenshots } from "./utils";
import { tests } from "./config";

async function exec() {
  try {
    const server = await startExampleServer();
    await takeScreenshots(tests, path.resolve(`./test/e2e/screenshots`), "valid");
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
