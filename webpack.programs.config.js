let path = require('path'),
  glob = require('glob');

const shaders = glob.sync(
  path.join(__dirname, 'src', 'renderers', 'webgl', 'shaders', '*.glsl')
);

const entry = {};

shaders.forEach(function(p) {
  entry[path.basename(p, '.glsl')] = p;
});

module.exports = {
  mode: 'production',
  entry,
  output: {
    path: path.join(__dirname, 'renderers', 'webgl', 'shaders'),
    filename: '[name].glsl',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
