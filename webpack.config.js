const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'aframe-joysticks-movement-component.js',
    path: path.resolve(__dirname, 'dist'),
    library: "aframe-joysticks-movement-component",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      { test: /src\/\w*\.js$/, use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      } }
    ]
  },
  devServer: {
    publicPath: "/dist/"
  }
};