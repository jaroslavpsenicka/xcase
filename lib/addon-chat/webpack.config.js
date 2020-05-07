var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin')

const OUTPUT_DIR = path.resolve(__dirname, "dist");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    // path: OUTPUT_DIR,
    filename: "addon-chat.js",
    publicPath: '/'
  },
  devServer: {
    publicPath: "/",
    contentBase: OUTPUT_DIR,
    hot: true,
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
