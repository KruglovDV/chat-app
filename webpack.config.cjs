const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './chat/index.js',
  output: {
    filename: 'chat.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, 'chat'),
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                "targets": "defaults"
              }],
              '@babel/preset-react'
            ]
          }
        }]
      }
    ]
  }
};