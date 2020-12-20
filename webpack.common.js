const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const destination = path.join(__dirname, 'dist')
const isFirebaseEnv = process.env.NODE_APP === 'firebase'
const firebaseConfigFilePath = path.join(__dirname, '.firebaserc')
const hasFirebaseConfig = fs.existsSync(firebaseConfigFilePath)

if (isFirebaseEnv && hasFirebaseConfig) {
  console.info('Prepare build for Firebase hosting')
}

module.exports = {
  entry: path.join(__dirname, 'lib', 'frontend', 'index.js'),
  output: {
    filename: '[name].[hash].js',
    path: destination,
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: [ '.mjs', '.js', '.svelte' ],
    mainFields: [ 'svelte', 'browser', 'module', 'main' ],
  },
  module: {
    rules: [
      {
        test: /\.(svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
      },
    ],
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
    new MiniCssExtractPlugin(),
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
}
