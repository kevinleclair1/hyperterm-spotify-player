var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: "commonjs"
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: 'css',
      },
      {
      test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
      loader: 'url'
    }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ],
  target: 'node',
  watch: true,
}