var path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin')

const OUTPUT_DIR = path.resolve(__dirname, "dist");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: OUTPUT_DIR,
    filename: "xhypo-create.js"
  },
  devServer: {
    contentBase: OUTPUT_DIR,
    compress: true,
    port: 9000
  },
  devtool: "source-map",
  plugins: [
    new LoadablePlugin(),
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test: /\.css$/,
      use: [
        { loader: "react-web-component-style-loader" },
        { loader: "css-loader" }
      ]
    }, { 
      test: /\.(png|jpg|svg)$/, 
      loader: 'url-loader?limit=8192' 
    }]
  }
};
