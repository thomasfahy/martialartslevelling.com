// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const { node } = require('webpack');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    // Specify the fallback options for missing core modules
    fallback: {
      fs: false,  // Exclude the 'fs' module from being bundled
      path: false,  // Exclude 'path'
      crypto: false,  // Exclude 'crypto'
      stream: false, 
      assert: false,
      async_hooks: false,
      "crypto": require.resolve("crypto-browserify"),
      "net": false, // `net` module is not needed in the browser; you can set it to false
      "tls": false,
      "os": false,
      "buffer": require.resolve("buffer/"),
      "process": require.resolve("process/browser"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "url": require.resolve("url"),
      "timers": require.resolve("timers-browserify"),
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "querystring": require.resolve("querystring-es3"),
      "http": require.resolve("stream-http"),
      "vm": require.resolve("vm-browserify")
    }
  },

  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/login.html",
      filename: 'login.html',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /express\/lib\/view\.js/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};