const webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      path = require('path');

const template = path.join(__dirname, 'templates', 'default.ejs');

module.exports = {
  context: __dirname,
  entry: {
    basic: './basic.js',
    events: './events.js',
    gexf: './gexf.js',
    naiveLayout: './naive-layout.js'
  },
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
        test: /\.(?:vert|frag|gexf)$/,
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
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.bundle.js',
      minChunks: 2
    }),
    new HtmlWebpackPlugin({
      filename: 'basic.html',
      title: 'Sigma.js - Basic Example',
      template,
      chunks: ['commons', 'basic']
    }),
    new HtmlWebpackPlugin({
      filename: 'events.html',
      title: 'Sigma.js - Events Example',
      template,
      chunks: ['commons', 'events']
    }),
    new HtmlWebpackPlugin({
      filename: 'gexf.html',
      title: 'Sigma.js - GEXF Example',
      template,
      chunks: ['commons', 'gexf']
    }),
    new HtmlWebpackPlugin({
      filename: 'naive-layout.html',
      title: 'Sigma.js - Naive Layout Example',
      template,
      chunks: ['commons', 'naiveLayout']
    })
  ]
};
