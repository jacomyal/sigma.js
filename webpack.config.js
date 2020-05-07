const path = require('path');

const production = !!~process.argv.indexOf('-p');

const moduleConfig = {
  rules: [
    {
      test: /\.glsl$/,
      exclude: /node_modules/,
      loader: 'raw-loader'
    },
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    }
  ]
};

module.exports = [
  {
    name: 'sigma',
    mode: 'production',
    entry: './src/endpoint.ts',
    output: {
      filename: production ? 'sigma.min.js' : 'sigma.js',
      path: path.join(__dirname, 'build'),
      library: 'Sigma',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.ts', '.js', 'glsl']
    },
    module: moduleConfig
  },
  {
    name: 'sigma-graphology',
    mode: 'production',
    entry: './src/sigma-graphology.ts',
    output: {
      filename: production ? 'sigma-graphology.min.js' : 'sigma-graphology.js',
      path: path.join(__dirname, 'build')
    },
    resolve: {
      extensions: ['.ts', '.js', 'glsl']
    },
    module: moduleConfig
  }
];
