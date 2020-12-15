const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.common')

const isDevelopment = Boolean(process.argv[2] && process.argv[2].includes('mode=development'))

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  watch: true,
})
