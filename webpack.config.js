const path = require('path');

module.exports = {
  // The entry point of your application
  entry: './cart.js',
  
  // Where to output the bundled file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  
  // Configuration for webpack-dev-server
  devServer: {
    static: './dist',
  },
  
  // Set the mode to 'development' or 'production'
  mode: 'development',
};