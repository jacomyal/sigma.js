var path = require('path');

var production = !!~process.argv.indexOf('-p');

var moduleConfig = {
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
};

module.exports = [
  {
    name: 'sigma',
    mode: 'production',
    entry: './src/endpoint.js',
    output: {
      filename: production ? 'sigma.min.js' : 'sigma.js',
      path: path.join(__dirname, 'build'),
      library: 'Sigma',
      libraryTarget: 'umd'
    },
    module: moduleConfig
  },
  {
    name: 'sigma-graphology',
    mode: 'production',
    entry: './src/sigma-graphology.js',
    output: {
      filename: production ? 'sigma-graphology.min.js' : 'sigma-graphology.js',
      path: path.join(__dirname, 'build')
    },
    module: moduleConfig
  }
];

