#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const { eachSeries } = require("async");
const kotatsu = require("kotatsu");

const outputDir = process.argv[2];

if (!outputDir) {
  console.error("Missing output directory!");
  process.exit(1);
}

rimraf.sync(outputDir);
fs.mkdirSync(outputDir, { recursive: true });

const examples = require("./examples.json");

function buildExample(name, callback) {
  console.log();
  console.log(`Building ${name}...`);

  const inputSubFolder = path.resolve(__dirname, name);
  const outputSubFolder = path.resolve(outputDir, name);

  fs.mkdirSync(outputSubFolder);
  fs.mkdirSync(path.resolve(outputSubFolder, "build"));
  fs.copyFileSync(path.resolve(inputSubFolder, "index.html"), path.resolve(outputSubFolder, "index.html"));

  if (fs.existsSync(path.resolve(inputSubFolder, "public"))) {
    fs.mkdirSync(path.resolve(outputSubFolder, "public"));
    fs.copySync(path.resolve(inputSubFolder, "public"), path.resolve(outputSubFolder, "public"));
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

eachSeries(
  examples,
  (example, next) => {
    buildExample(example.name, next);
  },
  (err) => {
    if (err) return console.error(err);

    console.log();
    console.log("Finished building examples!");
  },
);
