const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const webpack = require('webpack');

module.exports = {
  target: 'web',
  mode: "development",
  entry: {
    index: "./src/javascript/index.js",
    login: "./src/javascript/login.js",
    signup: "./src/javascript/signup.js"
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      assert: false,
      async_hooks: false,
      "crypto": require.resolve("crypto-browserify"),
      "net": false,
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

  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the 'dist' folder
    },
    open: true, // Automatically open the browser
    port: 3001, // You can change the port number
    hot: true, // Enable hot module replacement
    watchFiles: ["./src/**/*.html"], // Watch for changes in HTML files
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/login.html",
      filename: 'login.html',
      chunks: ["login"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/signup.html",
      filename: 'signup.html',
      chunks: ["login"],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /express\/lib\/view\.js/,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
