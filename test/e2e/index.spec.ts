import assert from "assert";
import path from "path";
import { imageDiff, startExampleServer, takeScreenshots } from "./utils";
import { tests } from "./suites";

// NOTE: --allow-uncaught does not seem to work...
process.on("uncaughtException", (error) => console.error(error));
process.on("unhandledRejection", (reason, error) => console.error(reason, error));

describe("Compare screenshots", () => {
  before(function (done) {
    // No mocha timeout, but there is a timeout of 30sec in puppeteer loading pages
    this.timeout(0);

    // starting the server with examples
    startExampleServer().then((server) => {
      console.log("~~~ Start generating screenshots ~~~");
      takeScreenshots(tests, path.resolve(`./test/e2e/screenshots`), 8000, "current").then(() => {
        console.log("~~~ End generating screenshots ~~~");
        console.log();
        // closing the server
        server.stopCallback(done);
      });
    });
  });

  tests.forEach((test) => {
    it(`Screenshots for "${test.name}" should be the same`, () => {
      const result = imageDiff(
        path.resolve(`./test/e2e/screenshots/${test.name}.valid.png`),
        path.resolve(`./test/e2e/screenshots/${test.name}.current.png`),
        path.resolve(`./test/e2e/screenshots/${test.name}.diff.png`),
      );
      assert(
        result.percent <= (test.failureThreshold || 0),
        `There is a diff over ${test.failureThreshold || 0} (${result.percent}) on ${test.name}, please check "${
          test.name
        }.diff.png"`,
      );
    });
  });
});
