const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".js", ".glsl"],
    alias: {
      "sigma/types": path.resolve(__dirname, "../src/types.ts"),
      "sigma/utils": path.resolve(__dirname, "../src/utils/"),
      "sigma/utils/animate": path.resolve(__dirname, "../src/utils/animate.ts"),
      "sigma/rendering/webgl/programs/edge": path.resolve(__dirname, "../src/rendering/webgl/programs/edge.ts"),
      "sigma/rendering/webgl/programs/edge.fast": path.resolve(
        __dirname,
        "../src/rendering/webgl/programs/edge.fast.ts",
      ),
      "sigma/rendering/webgl/programs/node.image": path.resolve(
        __dirname,
        "../src/rendering/webgl/programs/node.image.ts",
      ),
      "sigma/rendering/webgl/programs/common/node": path.resolve(
        __dirname,
        "../src/rendering/webgl/programs/common/node.ts",
      ),
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
