import WebpackDevServer from "webpack-dev-server";
import puppeteer, { Browser, Page } from "puppeteer";
import { runTest, startExampleServer } from "./utils";
import { tests, Test } from "./config";

let server: WebpackDevServer;
let browser: Browser;

before(function (done) {
  // Setting mocha timeout
  this.timeout(30000);
  // starting the server with examples
  console.log(`Starting server`);
  startExampleServer().then((svr: WebpackDevServer) => {
    server = svr;
    console.log(`Server is started`);
    // Launch the browser
    puppeteer.launch().then((brwsr: Browser) => {
      browser = brwsr;
      done();
    });
  });
});

after(function (done) {
  this.timeout(60000);
  // Stopping the server
  console.log(`Stopping the server`);
  server.close(() => {
    console.log(`Server is stopped`);
    browser.close();
    done();
  });
});

describe("E2E Tests", function () {
  this.timeout(30000);

  tests.map((test: Test) => {
    it(`Testing ${test.name}`, async () => {
      return await runTest(browser, test);
    });
  });
});
