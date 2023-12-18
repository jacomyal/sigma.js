const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".js", ".glsl"],
    alias: {
      sigma: path.resolve(__dirname, "../sigma/src/"),
      "sigma/types": path.resolve(__dirname, "../sigma/src/types"),
      "sigma/utils": path.resolve(__dirname, "../sigma/src/utils"),
      "sigma/utils/animate": path.resolve(__dirname, "../sigma/src/utils/animate"),
      "sigma/utils/node-hover": path.resolve(__dirname, "../sigma/src/utils/node-hover"),
      "sigma/utils/node-labels": path.resolve(__dirname, "../sigma/src/utils/node-labels"),
      "sigma/utils/node-collisions": path.resolve(__dirname, "../sigma/src/utils/node-collisions"),
      "sigma/rendering": path.resolve(__dirname, "../sigma/src/rendering"),
      "sigma/rendering/program": path.resolve(__dirname, "../sigma/src/rendering/program"),
      "sigma/rendering/programs/edge-rectangle": path.resolve(__dirname, "../sigma/rendering/programs/edge-rectangle"),
      "sigma/rendering/programs/edge-line": path.resolve(__dirname, "../sigma/rendering/programs/edge-line"),
      "sigma/rendering/programs/node-image": path.resolve(__dirname, "../sigma/rendering/programs/node-image"),
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
