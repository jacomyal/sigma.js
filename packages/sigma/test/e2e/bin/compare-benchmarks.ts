import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import Mocha from "mocha";

const OPTIONS: OptionDefinition[] = [
  { name: "report", alias: "f", type: String },
  { name: "reference", alias: "c", type: String },
];

async function exec() {
  const options = commandLineArgs(OPTIONS);
  const reference = options.reference as string | undefined;
  const report = options.report as string | undefined;

  if (!report) throw new Error(`Cannot find report "${report}"`);
  if (!reference) throw new Error(`Cannot find reference report "${reference}"`);

  process.env.REFERENCE_REPORT = report;
  process.env.NEW_REPORT = reference;

  const mocha = new Mocha({
    require: ["ts-node/register"],
  });

  mocha.addFile(path.join(__dirname, "../benchmarks.spec.ts"));

  await new Promise((resolve, reject) => {
    mocha.run((failures) => {
      if (failures) reject(`At least one test failed (${failures} failure${failures > 1 ? "s" : ""})`);
      else resolve(undefined);
    });
  });
}

exec()
  .then(() => {
    process.exit();
  })
  .catch((e) => {
    console.error("Error on generating report:", e);
    process.exit(1);
  });
