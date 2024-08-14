const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    m: './src/sideload/monaco.js',
    w: './src/sideload/monaco-worker.js',
  },
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
    ],
  },
  mode: 'production',
  optimization: {
    splitChunks: false,
  },
  plugins: [new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })],
};
