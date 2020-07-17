const path = require('path')
const pkg = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const destination = path.join(__dirname, 'dist')
const isDevelopment = Boolean(process.argv[2] && process.argv[2].includes('mode=development'))

module.exports = {
  entry: path.join(__dirname, 'lib', 'static', 'index.js'),
  watch: isDevelopment,
  output: {
    filename: '[name].[hash].js',
    path: destination,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname, 'lib', 'static', '{*.ico,*.json,*.png,*.css}'), to: destination, flatten: true },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'lib', 'static', 'index.html'),
      version: pkg.version,
      inject: 'body',
    }),
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
}
