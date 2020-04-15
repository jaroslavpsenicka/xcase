var path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
  resolve: {
    alias: {
      react: "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
