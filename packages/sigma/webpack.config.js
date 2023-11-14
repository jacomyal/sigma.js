const path = require("path");

let production = process.argv.indexOf("--mode");
production = production !== -1 ? process.argv[production + 1] === "production" : false;

const moduleConfig = {
  rules: [
    {
      test: /\.glsl$/,
      exclude: /node_modules/,
      loader: "raw-loader",
    },
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: "ts-loader",
    },
  ],
};

module.exports = [
  {
    name: "sigma",
    mode: production ? "production" : "none",
    entry: "./src/index-bundle.ts",
    output: {
      filename: production ? "sigma.min.js" : "sigma.js",
      path: path.join(__dirname, "build"),
      library: "Sigma",
      libraryTarget: "var",
    },
    resolve: {
      extensions: [".ts", ".js", ".glsl"],
    },
    module: moduleConfig,
  },
];
