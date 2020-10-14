import assert from "assert";
import path from "path";
import { imageDiff, startExampleServer, takeScreenshots } from "./utils";
import { pages } from "./config";

before(function (done) {
  // compute the timeout ie. 1sec per screenshot + the waiting time + 10000 for the compilation time
  this.timeout(10000 + pages.map((page) => page.waitFor || 0).reduce((acc, current) => (acc += 1000 + current), 0));

  // starting the server with examples
  startExampleServer().then(() => {
    console.log("~~~ Start generating screenshots ~~~");
    takeScreenshots(pages, path.resolve(`./test/e2e/screenshots`), "current").then(() => {
      console.log("~~~ End generating screenshots ~~~");
      console.log();
      done();
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
