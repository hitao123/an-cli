const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OpenBroswerWebpackPlugin = require("open-browser-webpack-plugin");
const CleanWebpack = require('clean-webpack-plugin');
const autoprefixer = require("autoprefixer");

// replace localhost with 0.0.0.0 if you want to access
// your app from wifi or a virtual machine
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;
const sourcePath = path.join(__dirname);
const buildPath = path.resolve(path.join(__dirname, "dist"));

const stats = {
  assets: true,
  children: false,
  chunks: false,
  hash: false,
  modules: false,
  publicPath: false,
  timings: true,
  version: false,
  warnings: true,
  colors: true
};

module.exports = function() {
  const nodeEnv = process.env && process.env.NODE_ENV;
  const isProd = nodeEnv === "production";
  // 基础组件
  const plugins = [
    // setting production environment will strip out
    // some of the development code from the app
    // and libraries
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: isProd ? "vendor.[hash].js" : "vendor.js"
    }),
    // create css bundle
    new ExtractTextPlugin({
      filename: isProd ? "[name].[hash].css" : "[name].css",
      allChunks: true
    }),
    // create index.html
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: true,
      production: isProd,
      minify: isProd && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ];
  // 产线
  if (isProd) {
    plugins.push(
      new CleanWebpack(['./dist']),
      // minify remove some of the dead code
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      })
    );
  } else {
    // 开发环境
    plugins.push(
      // make hot reloading worknew
      new webpack.HotModuleReplacementPlugin(),
      // show module names instead of numbers in webpack stats
      new webpack.NamedModulesPlugin(),
      new OpenBroswerWebpackPlugin({ url: `http://localhost:${port}`}),
      // don't spit out any errors in compiled assets
      new webpack.NoEmitOnErrorsPlugin()
    );
  }

  const entryPoint = isProd
    ? "./src/index.js"
    : [
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        `webpack-dev-server/client?http://${host}:${port}`,
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        "webpack/hot/only-dev-server",
        // the entry point of our app
        "./src/index.js"
      ];

  return {
    devtool: isProd ? "false" : "eval-cheap-module-source-map",
    context: sourcePath,
    entry: {
      main: entryPoint,
      vendor: [
        'react',
        'react-dom',
        'redux',
        'react-router',
        'redux-thunk'
      ]
    },
    output: {
      path: buildPath,
      publicPath: "/",
      // Computing hashes is expensive and we don't need them in development
      filename: isProd ? "[name].[hash:8].js" : "[name].js",
      chunkFilename: isProd ? "[name].[chunkhash:8].js" : "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.(svg|jpe?g|png|ttf|woff2?)$/,
          include: sourcePath,
          use: {
            loader: "file-loader",
            options: {
              name: isProd
                ? "static/[name].[hash:8].[ext]"
                : "static/[name].[ext]"
            }
          }
        },
        {
          test: /\.less$/,
          include: sourcePath,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: "css-loader"
              },
              {
                loader: "postcss-loader",
                options: {
                  plugins: [autoprefixer],
                  sourceMap: true
                }
              },
              {
                loader: "less-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          })
        },
        {
          test: /\.(js|jsx)$/,
          include: sourcePath,
          exclude: /node_modules/,
          use: [
            // activate HMR for React
            {
              loader: "react-hot-loader"
            },
            {
              loader: "babel-loader",
              options: {
                presets: ["env", "react"]
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [
        ".json",
        ".js",
        ".jsx",
        ".less",
        ".css"
      ],
      // react-hot-loader 问题 后面可以切换到 react-hot-loader v3
      // https://github.com/gaearon/react-hot-loader/issues/417
      alias: {
        'react/lib/ReactMount': 'react-dom/lib/ReactMount'
      },
      modules: ["node_modules"],
      symlinks: false
    },
    plugins,
    performance: isProd && {
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
      hints: "warning"
    },
    stats: stats,
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      publicPath: "/",
      historyApiFallback: true,
      port: port,
      host: host,
      hot: !isProd,
      compress: isProd,
      stats: stats
    }
  };
};
