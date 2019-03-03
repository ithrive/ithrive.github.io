const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

const debug = process.env.NODE_ENV !== "production";

module.exports = {
  mode: process.env.NODE_ENV || "production",
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./_scripts/index.js",
  output: {
    path: __dirname,
    filename: "build/scripts.js"
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|woff2|eot)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "_includes/build/[name].css",
      chunkFilename: "[id].css"
    })
  ]
};