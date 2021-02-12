const path = require("path");
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
// const dotenv = require('dotenv').config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-react-jsx", "@babel/plugin-syntax-class-properties"],
          },
        },
      },
      
      {
        test: /css?$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        use: ['file-loader']
    },
      {
        test: /\.jpg$/,
        use: "url-loader",
      },
    ],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.API_KEY': JSON.stringify('AIzaSyBVF_FX-NyW6u_DLm449hRY-saRzqcMZEM'),
    // }),
    new Dotenv()
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    publicPath: "/dist/",
    contentBase: path.join(__dirname, "public/"),
    historyApiFallback: true, 
    port: 8080,
  },
};
