let path = require('path'),
  glob = require('glob');

const shaders = glob.sync(path.join(__dirname, 'src', 'rendering', 'webgl', 'shaders', '*.glsl'));

const entry = {};

shaders.forEach(function (p) {
  entry[path.basename(p, '.glsl')] = p;
});

module.exports = {
  mode: 'production',
  entry,
  output: {
    path: path.join(__dirname, 'rendering', 'webgl', 'shaders'),
    filename: '[name].glsl.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
    ],
  },
};
