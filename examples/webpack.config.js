const HtmlWebpackPlugin = require('html-webpack-plugin'),
      path = require('path');

const EXAMPLES = [
  {
    file: 'basic',
    title: 'Basic'
  },
  {
    file: 'gexf',
    title: 'Gexf'
  },
  {
    file: 'markov',
    title: 'Markov'
  },
  {
    file: 'naive-layout',
    title: 'Naive Layout'
  }
];

module.exports = EXAMPLES.map(example => {
  return {
    context: __dirname,
    entry: `./${example.file}.js`,
    output: {
      filename: `${example.file}.bundle.js`
    },
    devtool: false,
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
      new HtmlWebpackPlugin({
        title: `Sigma.js - ${example.title}`,
        filename: `${example.file}.html`,
        template: path.join(__dirname, 'templates', 'default.ejs')
      })
    ]
  };
});
