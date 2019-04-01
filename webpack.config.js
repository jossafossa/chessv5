/* global __dirname */
module.exports = {
  entry: __dirname + '/js/raw/index.js',
  output: {
    path: __dirname + '/js',
    publicPath: '/js/',
    filename: 'main.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets=es2015' }
    ]
  }
}
