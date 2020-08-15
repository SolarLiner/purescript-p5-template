//@ts-check
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleNomodulePlugin = require("webpack-module-nomodule-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const modernTerser = new TerserPlugin({
  cache: true,
  parallel: true,
  sourceMap: true,
  terserOptions: {
    ecma: 8,
    safari10: true,
  },
});
/**
 * @returns {webpack.Configuration}
 * @param {'modern' | 'legacy'} mode
 */
function makeConfig(mode) {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === "production";
  const isWatch =
    process.argv.some((a) => a.includes("--watch")) ||
    process.argv[0].includes("webpack-dev-server");
  const plugins = [];
  const baseDir = path.resolve(__dirname, "./");
  const distDir = path.resolve(__dirname, "./dist");

  if (isProduction) plugins.push(new ModuleNomodulePlugin(mode));
  else plugins.push(new webpack.HotModuleReplacementPlugin());

  return {
    mode: isProduction ? "production" : "development",
    devtool: "source-map",
    entry: { main: "./index.js" },
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
      chunkFilename: isProduction
        ? `[name]-[contenthash].${mode}.js'`
        : `[name].${mode}.js`,
      path: distDir,
      publicPath: "/",
    },
    optimization: {
      splitChunks: { chunks: "initial" },
      minimizer: mode === "legacy" ? undefined : [modernTerser],
    },
    plugins: [
      new HtmlWebpackPlugin({ inject: true, title: "PureScript + p5.js = 💖" }),
      ...plugins.filter(Boolean),
    ],
    module: {
      rules: [
        {
          test: /\.purs$/,
          loader: "purs-loader",
          options: {
            spago: true,
            watch: isWatch,
          },
        },
      ],
    },
  };
}

module.exports =
  process.env.NODE_ENV === "production"
    ? [makeConfig("modern"), makeConfig("legacy")]
    : makeConfig("modern");
