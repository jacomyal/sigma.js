let path = require("path"),
  glob = require("glob");

const shaders = glob.sync(path.join(__dirname, "src/rendering/programs/**/*.glsl"));

const entry = {};

shaders.forEach(function (p) {
  entry[path.join(path.basename(path.dirname(p)), path.basename(p, ".glsl"))] = p;
});

module.exports = {
  mode: "production",
  entry,
  output: {
    path: path.join(__dirname, "rendering/programs"),
    filename: "[name].glsl.js",
    libraryTarget: "commonjs2",
  },
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
