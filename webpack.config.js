const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/main.js", // Entry point
  output: {
    path: path.resolve(__dirname, "dist"), // Output folder
    filename: "bundle.js", // Output JavaScript file
    publicPath: "/", // Ensure assets are served correctly
  },
  mode: "development", // Switch to "production" for production builds
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          "css-loader", // Handles @import and url() in CSS
          "postcss-loader", // Processes Tailwind and Autoprefixer
        ],
      },
    ],
  },
  plugins: [
    // Apply CleanWebpackPlugin only in production mode
    ...(process.env.NODE_ENV === "production" ? [new CleanWebpackPlugin()] : []),
    new MiniCssExtractPlugin({
      filename: "styles.css", // Extracted CSS filename
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Use your existing index.html
    }),
    new Dotenv(), // Load environment variables from .env
  ],
  resolve: {
    extensions: [".js", ".json"], // Automatically resolve these extensions
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // Serve from dist folder
    },
    hot: true, // Enable hot module replacement
    port: 8080, // Port number
    historyApiFallback: true, // Handle client-side routing (SPAs)
    open: true, // Open the browser automatically
  },
};
