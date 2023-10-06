import { writeFileSync } from "fs";
import commandLineArgs, { OptionDefinition } from "command-line-args";

import benchmarkTests from "../suites/benchmarks";
import { getReport, startExampleServer } from "../utils";

function addZeros(n: number) {
  return ("0" + n).substr(-2);
}
function getNowString() {
  const d = new Date();
  return (
    d.getFullYear() +
    addZeros(d.getMonth()) +
    addZeros(d.getDate()) +
    "-" +
    addZeros(d.getHours()) +
    addZeros(d.getMinutes()) +
    addZeros(d.getSeconds())
  );
}

const OPTIONS: OptionDefinition[] = [
  { name: "filename", alias: "f", type: String, defaultValue: `${getNowString()}-report.json` },
  { name: "runs", alias: "r", type: Number, defaultValue: 10 },
  { name: "noHeadless", type: Boolean, defaultValue: false },
];

async function exec() {
  const options = commandLineArgs(OPTIONS);
  const filename = (options.filename as string).replace(/\.json$/, "") + ".json";
  const headless = !options.noHeadless;
  const runs = +options.runs;
  const server = await startExampleServer();

  console.log(`\nRun benchmark scenarii`);
  const report = await getReport(benchmarkTests, runs, headless, 8000);
  server.stopCallback(() => {
    process.exit();
  });

  console.log(`\nSave benchmarks report at "reports/${filename}"`);
  writeFileSync(
    `${__dirname}/../reports/${filename}`,
    JSON.stringify({ date: new Date().toISOString(), headless, tests: report }, null, "  "),
    "utf8",
  );
}

exec()
  .then(() => {
    process.exit();
  })
  .catch((e) => {
    console.error("Error on generating report:", e);
    process.exit(1);
  });
