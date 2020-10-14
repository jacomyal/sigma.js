import path from "path";
import { takeScreenshots } from "./utils";
import { pages } from "./config";

async function exec() {
  await takeScreenshots(pages, path.resolve(`./test/e2e/screenshots`), "valid");
  process.exit();
}

exec();
