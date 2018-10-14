var path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'public/javascripts/'),
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'bma'
  }
}
