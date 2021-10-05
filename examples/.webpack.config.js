/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const EXAMPLES = require("./.examples.json");
/* eslint-enable @typescript-eslint/no-var-requires */

let production = process.argv.indexOf("--mode");
production = production !== -1 ? process.argv[production + 1] === "production" : false;

const entry = {};

const plugins = [
  new HtmlWebpackPlugin({
    filename: "index.html",
    title: "Sigma.js - Examples",
    template: path.join(__dirname, "templates", "index.ejs"),
    pages: Object.keys(EXAMPLES).map((key) => EXAMPLES[key]),
    chunks: [],
  }),
];

for (const key in EXAMPLES) {
  const example = EXAMPLES[key];

  entry[key] = `./${example.id}.ts`;

  plugins.push(
    new HtmlWebpackPlugin({
      filename: `${example.id}.html`,
      title: `Sigma.js - ${example.title} Example`,
      chunks: ["commons", key],
      template: path.join(__dirname, "templates", "default.ejs"),
    }),
  );
}

module.exports = {
  mode: production ? "production" : "development",
  context: __dirname,
  entry,
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../website/www/demos"),
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".glsl", ".gexf"],
    alias: {
      sigma: path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: { configFile: "tsconfig.example.json" },
      },
      {
        test: /\.(?:glsl|gexf)$/,
        exclude: /node_modules/,
        loader: "raw-loader",
      },
    ],
  },
  plugins,
  optimization: {
    splitChunks: {
      chunks: "initial",
      minChunks: 2,
      name: "commons",
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 8000,
  },
};
