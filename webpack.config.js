var path = require('path');

var production = !!~process.argv.indexOf('-p');

module.exports = {
  entry: './src/endpoint.js',
  output: {
    filename: production ? 'sigma.min.js' : 'sigma.js',
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
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
