var path = require('path');

module.exports = {
  entry: {
    'node.vert': './src/renderers/webgl/shaders/node.vert.glsl',
    'edge.vert': './src/renderers/webgl/shaders/edge.vert.glsl',
    'edge.fast.vert': './src/renderers/webgl/shaders/edge.fast.vert.glsl',
    'node.frag': './src/renderers/webgl/shaders/node.frag.glsl',
    'edge.frag': './src/renderers/webgl/shaders/edge.frag.glsl',
    'edge.fast.frag': './src/renderers/webgl/shaders/edge.fast.frag.glsl'
  },
  output: {
    path: path.join(__dirname, 'renderers', 'webgl', 'shaders'),
    filename: '[name].glsl'
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
