const webpack = require('webpack')
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

const isDev = process.env.NODE_ENV === 'development'
console.log(`Detected dev mode? ${isDev}`)

if (isFirebaseEnv && hasFirebaseConfig) {
  console.info('Prepare build for Firebase hosting')
}

module.exports = {
  entry: path.join(__dirname, 'lib', 'frontend', 'index.js'),
  output: {
    filename: '[name].[fullhash].js',
    path: destination,
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: [ '.mjs', '.js', '.svelte' ],
    mainFields: [ 'svelte', 'browser', 'module', 'main' ],
    fallback: {
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      buffer:  require.resolve('buffer/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: false,
            hotReload: isDev,
            dev: isDev,
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'lib', 'static', 'index.html'),
      version: pkg.version,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname, 'lib', 'static', 'favicon.ico'), to: destination },
        { from: path.join(__dirname, 'lib', 'static', 'manifest.json'), to: destination },
        { from: path.join(__dirname, 'lib', 'static', 'style.css'), to: destination },
        { from: path.join(__dirname, 'lib', 'static', 'icon-180.png'), to: destination },
        { from: path.join(__dirname, 'lib', 'static', 'icon-192.png'), to: destination },
        { from: path.join(__dirname, 'lib', 'static', 'icon-512.png'), to: destination },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
    })
  ],
}
