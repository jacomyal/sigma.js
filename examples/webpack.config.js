const HtmlWebpackPlugin = require('html-webpack-plugin');

const EXAMPLES = [
  {
    file: 'basic',
    title: 'Basic'
  },
  {
    file: 'advanced',
    title: 'Advanced'
  }
];

module.exports = EXAMPLES.map(example => {
  return {
    context: __dirname,
    entry: `./${example.file}.js`,
    output: {
      filename: `${example.file}.bundle.js`
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: `Sigma.js - ${example.title}`,
        filename: `${example.file}.html`
      })
    ]
  };
});
