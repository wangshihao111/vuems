const path = require('path');

const cwd = process.cwd();

let alias = {
  '@': path.resolve(cwd, './src'),
  'utils': path.resolve(cwd, './utils'),
  'components': path.resolve(cwd, './components'),
  'services': path.resolve(cwd, './services')
}

module.exports = alias;
