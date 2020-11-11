function build() {
  const dotEnv = require('dotenv');
  dotEnv.config()
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  
  const webpack = require('webpack');
  const fs = require('fs');
  const paths = require('../config/paths')
  const { resolve }= require('path')
  
  const createWebpackConfig = require('../config/webpack.micro.config');
  const createWebpack3Config = require('../config/webpack3.config.js');
  
  const cwd = process.cwd();
  
  function loadMicroConfig() {
    try {
      return require(resolve(cwd, '.microConfig.js'))
    } catch (error) {
      return {};
    }
  }

  function loadMicroAppConfig() {
    let config = {};
    try {
      config = loadMicroConfig()
    } catch (error) {}
    if (process.env.MICRO_APP_NAME) {
      config.appName = process.env.MICRO_APP_NAME;
    }
    if (process.env.MICRO_APP_VERSION) {
      config.version = process.env.MICRO_APP_VERSION;
    }
    const pkg = require(resolve(paths.MICRO_APP_PATH, './package.json'))
    if (!config.appName) {
      config.appName = pkg.name
    }
    if (!config.version) {
      config.version = pkg.version
    }
    return config;
  }
  const { APP_NAME } = require('@vuems/core')
  function replaceMainToExactName(file, name) {
    const filePath = resolve(paths.DIST_PATH, file)
    const content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, content.replace(new RegExp(APP_NAME, 'g'), name))
  }
  // 用户配置
  const config = loadMicroConfig();
  const configCreator = require('webpack/package.json').version.startsWith('3') ? createWebpack3Config : createWebpackConfig
  let webpackConfig = configCreator(config);
  if (config.configureWebpack && typeof config.configureWebpack === 'function') {
    webpackConfig = config.configureWebpack(webpackConfig)
  }
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (!err) {
      const statsData = stats.toJson();
      const hasError = stats.hasErrors();

      if (hasError) {
        return console.log(stats.toString('errors-only'))
      }
      const microAppConfig = loadMicroAppConfig();
      const data = {
        name: microAppConfig.appName,
        version: microAppConfig.version
      };
      Object.keys(statsData.assetsByChunkName).forEach(k => {
        if (k.match(/^main.*/)) {
          const mainChunk = statsData.assetsByChunkName[k];
          if (typeof mainChunk === 'string') {
            data.main = mainChunk;
          } else {
            data.main = mainChunk[0]
          }
        }
      });
      fs.writeFileSync(resolve(paths.DIST_PATH, 'microConfig.json'), JSON.stringify(data))
      const jsonpFileContent = `
;(function(global) {
  global['vue_micro_app_config'](${JSON.stringify(data)});
})(window);
      `;
      fs.writeFileSync(resolve(paths.DIST_PATH, 'microConfig.js'), jsonpFileContent);
      replaceMainToExactName(data.main, data.name);
    } else {
      console.error(err.message)
    }
  })
}

module.exports = build;
