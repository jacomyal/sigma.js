import assert from "assert";
import path from "path";
import { imageDiff, startExampleServer, takeScreenshots } from "./utils";
import { pages } from "./config";

before(function (done) {
  // No mocha timeout, but there is a timeout of 30sec in puppeteer loading pages
  this.timeout(0);

  // starting the server with examples
  startExampleServer().then((server) => {
    console.log("~~~ Start generating screenshots ~~~");
    takeScreenshots(pages, path.resolve(`./test/e2e/screenshots`), "current").then(() => {
      console.log("~~~ End generating screenshots ~~~");
      console.log();
      // closing the server
      server.close(done);
    });
  });
});

describe("Compare screenshots", () => {
  pages.forEach((page) => {
    it(`Screenshots for "${page.filename}" should be the same`, () => {
      const result = imageDiff(
        path.resolve(`./test/e2e/screenshots/${page.filename}.valid.png`),
        path.resolve(`./test/e2e/screenshots/${page.filename}.current.png`),
        path.resolve(`./test/e2e/screenshots/${page.filename}.diff.png`),
      );
      assert.deepEqual(
        result.diff,
        0,
        `There is a diff on files ${page.filename}, please check "${page.filename}.diff.png"`,
      );
    });
  });
});
