const path = require('path')

const distDir = process.env.MICRO_DIST_DIR || 'microDist';
const entryFilePath = process.env.ENTRY_FILE_PATH || './src/index.js'
const microDir = process.env.MICRO_APP_PATH || './'

const cwd = process.cwd();

module.exports = {
  PUBLIC_URL: process.env.PUBLIC_URL,
  MICRO_DIST_DIR: distDir,
  DIST_PATH: path.resolve(cwd, distDir),
  ENTRY_FILE_NAME: path.resolve(cwd, entryFilePath),
  MICRO_APP_PATH: path.resolve(cwd, microDir)
}