const path = require("path");

module.exports = {
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
        options: {
          configFile: path.resolve(__dirname, "../tsconfig.example.json"),
        },
      },
    ],
  },
};
