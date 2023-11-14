const path = require("path");

module.exports = {
  mode: "development",
  context: __dirname,
  entry: path.resolve(__dirname, "./index.ts"),
  output: {
    filename: "bundle.js",
    path: __dirname,
  },
  resolve: {
    extensions: [".ts", ".js", ".glsl"],
    alias: {
      sigma: path.resolve(__dirname, "../src/index.ts"),
    },
  },
  module: {
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
  },
};
