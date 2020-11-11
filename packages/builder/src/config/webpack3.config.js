module.exports = (config) => {
  let devMode = process.env.NODE_ENV !== 'production';
  const webpack = require('webpack')
  const WebpackBar = require("webpackbar");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const ManifestPlugin = require("webpack-manifest-plugin");
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

  const alias = require('./alias');
  const paths = require('./paths');

  return ({
    context: process.cwd(),
    entry: paths.ENTRY_FILE_NAME,
    output: {
      publicPath: paths.PUBLIC_URL,
      path: paths.DIST_PATH,
      filename: "[name].[hash].js",
    },
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    devtool: devMode ? "source-map" : undefined,
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': "VueRouter"
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: config.vueLoaderPath || 'vue-loader'
        },
        {
          test: /\.m?jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            "css-loader",
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            {
              loader: 'less-loader', options: {
                lessOptions: {
                  modules: true, 
                  javascriptEnabled: true
                }
              }
            },
          ]
        },
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
            },
            {
              loader: 'stylus-loader'
            },
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader'
            },
          ]
        },
        {
          test: /\.(png|jpg|gif|ttf|woff|woff2|svg|eot|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: { limit: 8192, outputPath: "image" }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.vue', '.js', 'jsx', '.tsx', '.svg', '.less'],
      alias: {
        ...(config.alias || alias),
      }
    },
    plugins: [
      new webpack.DefinePlugin(require('./clientEnv')()),
      (process.env.NODE_ENV === 'production' && process.env.COMPRESS !== 'none') && new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        parallel: true
      }),
      new CleanWebpackPlugin(),
      new ManifestPlugin(),
      new WebpackBar(),
    ].filter(Boolean),
  });
}