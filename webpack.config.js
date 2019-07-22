const path = require("path");

module.exports = {
  entry: {
    app: ['babel-polyfill', "./packages/quantum.js"]
  },
  output: {
    path: path.resolve(__dirname, "build/production/"),
    filename: "app.bundle.js"
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ["@babel/preset-env", "@babel/preset-typescript"]
      }
    }]
  }
}