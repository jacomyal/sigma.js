const webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path');

const EXAMPLES = {
  animations: {
    id: 'animations',
    title: 'Animations',
  },
  basic: {
    id: 'basic',
    title: 'Basic',
  },
  components: {
    id: 'components',
    title: 'Connected Components',
  },
  drag: {
    id: 'drag',
    title: 'Drag',
  },
  dynamic: {
    id: 'dynamic',
    title: 'Dynamic graph (adding & removing items)',
  },
  events: {
    id: 'events',
    title: 'Events',
  },
  gexf: {
    id: 'gexf',
    title: 'GEXF',
  },
  layout: {
    id: 'layout',
    title: 'Force Atlas 2 Layout',
  },
  performance: {
    id: 'performance',
    title: 'Performance',
  },
  settings: {
    id: 'settings',
    title: 'Settings',
  },
  tiny: {
    id: 'tiny',
    title: 'Tiny graph',
  },
  edgeLabels: {
    id: 'edge-labels',
    title: 'Edge labels',
  },
  customNodes: {
    id: 'custom-nodes',
    title: 'Custom nodes renderer',
  },
};

const entry = {};

const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'Sigma.js - Examples',
    template: path.join(__dirname, 'templates', 'index.ejs'),
    pages: Object.keys(EXAMPLES).map((key) => EXAMPLES[key]),
    chunks: [],
  }),
];

for (const key in EXAMPLES) {
  const example = EXAMPLES[key];

  entry[key] = `./${example.id}.ts`;

  plugins.push(
    new HtmlWebpackPlugin({
      filename: `${example.id}.html`,
      title: `Sigma.js - ${example.title} Example`,
      chunks: ['commons', key],
      template: path.join(__dirname, 'templates', 'default.ejs'),
    }),
  );
}

module.exports = {
  mode: 'development',
  context: __dirname,
  entry,
  output: {
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.glsl', '.gefx'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(?:glsl|gexf)$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins,
  optimization: {
    splitChunks: {
      chunks: 'initial',
      minChunks: 2,
      name: 'commons',
    },
  },
  devServer: {
    port: 8000,
  },
};
