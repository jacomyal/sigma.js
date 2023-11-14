const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: "raw-loader",
      },
    ],
  },
};
