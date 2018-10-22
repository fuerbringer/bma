var path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'public/javascripts/'),
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'bma'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
