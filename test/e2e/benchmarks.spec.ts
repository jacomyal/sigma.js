import assert from "assert";
import { readFileSync } from "fs";

import { TestReport } from "./utils";

describe("Compare reports", () => {
  if (!process.env.REFERENCE_REPORT) throw new Error("Missing env variable REFERENCE_REPORT");
  if (!process.env.NEW_REPORT) throw new Error("Missing env variable REFERENCE_REPORT");

  const referenceReport = JSON.parse(readFileSync(process.env.REFERENCE_REPORT, { encoding: "utf8" }));
  const newReport = JSON.parse(readFileSync(process.env.NEW_REPORT, { encoding: "utf8" }));

  const newReportIndex = (newReport.tests as TestReport[]).reduce(
    (iter, test) => ({ ...iter, [test.name]: test }),
    {},
  ) as Record<string, TestReport>;

  referenceReport.tests.forEach((test: TestReport) => {
    const newTest = newReportIndex[test.name];

    if (!newTest) return;
    it(`Performances for "${test.name}" should remain similar or better`, () => {
      assert(
        newTest.average <= test.average * 1.05,
        `Test "${test.name}" was recorded on average at ${test.average}ms, and now is at ${newTest.average}ms`,
      );
    });
  });
});
