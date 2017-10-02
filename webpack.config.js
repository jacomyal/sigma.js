var path = require('path');

var production = !!~process.argv.indexOf('-p');

module.exports = {
  entry: {
    sigma: './src/endpoint.js'
  },
  output: {
    filename: production ? '[name].min.js' : '[name].js',
    path: path.join(__dirname, 'build'),
    library: 'Sigma',
    libraryTarget: 'umd'
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
        exclude: /node_modules(?!\/gl-matrix)/,
        loader: 'babel-loader'
      }
    ]
  }
};
