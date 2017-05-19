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
  }
];

module.exports = EXAMPLES.map(example => {
  return {
    context: __dirname,
    entry: `./${example.file}.js`,
    output: {
      filename: `${example.file}.bundle.js`
    },
    devtool: 'eval-source-map',
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
