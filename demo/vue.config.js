const webpack = require('webpack');
const { getClientEnv } = require('../packages/core/lib')

module.exports = {
  configureWebpack() {
    return {
      plugins: [
        new webpack.DefinePlugin(getClientEnv())
      ]
    }
  }
}