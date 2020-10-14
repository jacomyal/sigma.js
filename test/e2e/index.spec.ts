import assert from "assert";
import path from "path";
import { imageDiff, takeScreenshots } from "./utils";
import { pages } from "./config";

before(function (done) {
  // compute the timeout ie. 1sec per screenshot + the waiting time
  this.timeout(pages.map((page) => page.waitFor || 0).reduce((acc, current) => (acc += 1000 + current), 0));

  console.log("~~~ Start generating screenshots ~~~");
  takeScreenshots(pages, path.resolve(`./test/e2e/screenshots`), "current").then(() => {
    console.log("~~~ End generating screenshots ~~~");
    console.log();
    done();
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
