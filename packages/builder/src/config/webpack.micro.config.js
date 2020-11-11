module.exports = (config) => {
  let devMode = process.env.NODE_ENV !== 'production';
  const webpack = require('webpack')
  const WebpackBar = require("webpackbar");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const ManifestPlugin = require("webpack-manifest-plugin");
  const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack4');
  const alias = require('./alias');
  const paths = require('./paths');

  return ({
    mode: process.env.NODE_ENV || "development",
    entry: paths.ENTRY_FILE_NAME,
    target: 'web',
    output: {
      publicPath: paths.PUBLIC_URL,
      path: paths.DIST_PATH,
      filename: "[name].[hash].js",
      // libraryTarget: "umd",
      // library: 'micro'
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
          exclude: /node_modules/,
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
            // devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            // "postcss-loader"
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            // "css-loader",
            {
              loader: 'css-loader',
              options: {
                // modules: true,
                // localIndexName:"[name]__[local]___[hash:base64:5]"//配置class的名字
              },
            },
            // "postcss-loader",
            {
              loader: 'less-loader', options: {
                lessOptions: {
                  // modules: true, 
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
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new ManifestPlugin(),
      // new FriendlyErrorsWebpackPlugin({
      //   compilationSuccessInfo: {
      //     // messages: [`Your application is running at: http://${devConfig.host}:${devConfig.port}`]
      //     messages: ['Compile successfully']
      //   },
      //   clearConsole: false
      // }),
      new WebpackBar(),
      // new MiniCssExtractPlugin({
      //   filename: "css/[name].css",
      //   chunkFilename: "css/[id].css"
      // }),
    ],
    // optimization: {
    //   mergeDuplicateChunks: true,
    //   splitChunks: devMode
    //     ? {}
    //     : {
    //       chunks: "all",
    //       minSize: 20000,
    //       maxSize: 200000,
    //       minChunks: 1,
    //       maxAsyncRequests: 5,
    //       maxInitialRequests: 3,
    //       automaticNameDelimiter: "~",
    //       name: true,
    //       cacheGroups: {
    //         // venders: {
    //         //   test: /[\\/]node_modules[\\/]/,
    //         //   name: "venders",
    //         //   // filename: "[name].js",
    //         //   reuseExistingChunk: true,
    //         //   priority: -10,
    //         //   chunks: "all"
    //         // },
    //         default: {
    //           minChunks: 2,
    //           priority: -20,
    //           filename: "[name].js",
    //           reuseExistingChunk: true
    //         }
    //       }
    //     }
    // }
  });
  
}