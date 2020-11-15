const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const destination = path.join(__dirname, 'dist')
const isDevelopment = Boolean(process.argv[2] && process.argv[2].includes('mode=development'))
const isFirebaseEnv = process.env.NODE_APP === 'firebase'
const firebaseConfigFilePath = path.join(__dirname, '.firebaserc')
const hasFirebaseConfig = fs.existsSync(firebaseConfigFilePath)

if (isFirebaseEnv && hasFirebaseConfig) {
  console.info('Prepare build for Firebase hosting')
}

const getFirebaseUrl = () => {
  const contents = fs.readFileSync(firebaseConfigFilePath)
  const rawContents = contents.toString()
  const json = JSON.parse(rawContents)
  const projectName = json.projects ? json.projects.default : null

  if (isDevelopment) {
    return `http://localhost:5001/${projectName}/uscentral-1/app`
  }

  return `${projectName}.web.app/app`
}

module.exports = {
  entry: path.join(__dirname, 'lib', 'static', 'index.js'),
  watch: isDevelopment && !isFirebaseEnv,
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
      serverURL: (isFirebaseEnv && hasFirebaseConfig) ? getFirebaseUrl() : '',
      inject: 'body',
    }),
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
}
