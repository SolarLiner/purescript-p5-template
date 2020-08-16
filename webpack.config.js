//@ts-check
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ClosurePlugin = require("closure-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * @returns {webpack.Configuration}
 */
function makeConfig() {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === "production";
  const isWatch =
    process.argv.some((a) => a.includes("--watch")) ||
    process.argv[0].includes("webpack-dev-server");
  const plugins = [new webpack.ProgressPlugin()];
  const baseDir = path.resolve(__dirname, "./");
  const distDir = path.resolve(__dirname, "./dist");

  if (!isProduction) plugins.push(new webpack.HotModuleReplacementPlugin());

  return {
    mode: isProduction ? "production" : "development",
    devtool: "source-map",
    entry: { main: "./src/Main.purs" },
    context: baseDir,
    devServer: {
      contentBase: distDir,
      port: 8080,
      historyApiFallback: true,
      hot: true,
      inline: true,
      publicPath: "/",
      clientLogLevel: "none",
      open: true,
      overlay: true,
    },
    stats: "normal",
    output: {
      filename: isProduction ? `[name].[hash:5].js` : `[name].js`,
      chunkFilename: isProduction ? `[name].chunk.[hash:5].js'` : `[name].js`,
      path: distDir,
      publicPath: "/",
    },
    optimization: {
      splitChunks: { chunks: "initial" },
      concatenateModules: false,
      minimizer: [
        new ClosurePlugin(
          { mode: "AGGRESSIVE_BUNDLE" },
          { languageOut: "ECMASCRIPT5" }
        ),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ inject: true, title: "PureScript + p5.js = 💖" }),
      ...plugins.filter(Boolean),
    ],
    module: {
      rules: [
        {
          test: /\.purs$/,
          loaders: [
            {
              loader: "purs-loader",
              options: {
                spago: true,
                bundle: true,
                watch: isWatch,
                pscBundleArgs: {
                  module: "Main",
                  main: "Main",
                },
              },
            },
          ],
        },
      ],
    },
  };
}

module.exports = makeConfig();
