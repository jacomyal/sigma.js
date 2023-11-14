#!/usr/bin/env node
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const kotatsu = require("kotatsu");
const { eachSeries } = require("async");

const outputDir = process.argv[2];

if (!outputDir) {
  console.error("Missing output directory!");
  process.exit(1);
}

rimraf.sync(outputDir);
fsExtra.mkdirSync(outputDir, { recursive: true });

function buildExample(name, callback) {
  console.log();
  console.log(`Building ${name}...`);

  const inputSubFolder = path.resolve(__dirname, name);
  const outputSubFolder = path.resolve(outputDir, name);

  fsExtra.mkdirSync(outputSubFolder);
  fsExtra.mkdirSync(path.resolve(outputSubFolder, "build"));
  fsExtra.copyFileSync(path.resolve(inputSubFolder, "index.html"), path.resolve(outputSubFolder, "index.html"));

  if (fsExtra.existsSync(path.resolve(inputSubFolder, "public"))) {
    fsExtra.copySync(path.resolve(inputSubFolder, "public"), outputSubFolder);
  }

  kotatsu.build(
    "front",
    {
      entry: path.resolve(inputSubFolder, "index.ts"),
      config: require("./webpack.config"),
      output: path.resolve(outputSubFolder, "build/bundle.js"),
      production: true,
    },
    callback,
  );
}

// List all examples:
const notExamples = new Set(["build", "node_modules"]);
const examples = fs
  .readdirSync("./", { withFileTypes: true })
  .filter(
    (dirent) =>
      dirent.isDirectory() &&
      !notExamples.has(dirent.name) &&
      fs.existsSync(path.resolve(__dirname, dirent.name, "index.ts")),
  )
  .map((dirent) => dirent.name);

eachSeries(
  examples,
  (name, next) => {
    buildExample(name, next);
  },
  (err) => {
    if (err) return console.error(err);

    console.log();
    console.log("Finished building examples!");
  },
);
