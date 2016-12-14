var webpack = require('webpack');
var path = require('path');
require("babel-polyfill");

module.exports = {
  entry: ['babel-polyfill','./src/index.js'],
  output: {
    filename: 'userActions.js',
    path: path.join('dist')
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.jsx$/,
      loader: 'jsx-loader'
    },{
        test: /\.css$/,
        loader: "style-loader!css-loader?modules"
    }]
  },
};