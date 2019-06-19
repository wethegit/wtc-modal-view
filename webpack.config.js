const path = require('path');

module.exports = {
  target: 'web',
  entry: "./src/wtc-modal-view.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'wtc-modal-view.es5.js',
    library: 'WTCModalView'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: [["@babel/env", {
            "targets": {
              "browsers": ["last 2 versions", "ie >= 11"]
            },
            useBuiltIns: "usage"
          }]]
        }
      }
    ]
  }
}