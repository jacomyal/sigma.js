const webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      path = require('path');

const EXAMPLES = {
  basic: {
    id: 'basic',
    title: 'Basic'
  },
  drag: {
    id: 'drag',
    title: 'Drag'
  },
  events: {
    id: 'events',
    title: 'Events'
  },
  gexf: {
    id: 'gexf',
    title: 'GEXF'
  },
  layout: {
    id: 'layout',
    title: 'Force Atlas 2 Layout'
  },
  performance: {
    id: 'performance',
    title: 'Performance'
  },
  animations: {
    id: 'animations',
    title: 'Animations'
  },
  tiny: {
    id: 'tiny',
    title: 'Tiny graph'
  }
};

const entry = {};

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.bundle.js',
      minChunks: 2
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'Sigma.js - Examples',
    template: path.join(__dirname, 'templates', 'index.ejs'),
    pages: Object.keys(EXAMPLES).map(key => EXAMPLES[key]),
    chunks: []
  })
];

for (const key in EXAMPLES) {
  const example = EXAMPLES[key];

  entry[key] = `./${example.id}.js`;

  plugins.push(new HtmlWebpackPlugin({
    filename: `${example.id}.html`,
    title: `Sigma.js - ${example.title} Example`,
    chunks: ['commons', key],
    template: path.join(__dirname, 'templates', 'default.ejs')
  }));
}

module.exports = {
  context: __dirname,
  entry,
  output: {
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(?:glsl|gexf)$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        loader: 'worker-loader'
      }
    ]
  },
  plugins,
  devServer: {
    port: 8000
  }
};
