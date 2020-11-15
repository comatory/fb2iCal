const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('serve-favicon')
const rateLimit = require('express-rate-limit')
const cors = require('cors')

const {
  error,
  notFound,
  download,
  downloadHTML,
} = require('../routes')

const {
  genericErrorHandler,
  checkURLParameter,
  forceSecure,
} = require('../middlewares')

const certEndpoint = process.env.CERT_ENDPOINT || ''
const certSecret = process.env.CERT_SECRET || ''
const enforceHTTPS = Boolean(process.env.ENFORCE_HTTPS)

const configureApplication = ({
  appLogger,
  errorLogger,
  routeLogger,
  corsOptions,
  rateLimitEnabled,
}) => {
  const pkg = require('../../package.json')
  const version = pkg.version

  const app = express()

  if (corsOptions) {
    app.use(cors(corsOptions))
  }

  // Force app to always redirect to HTTPS
  // use when you can't configure web server
  if (enforceHTTPS) {
    app.use(forceSecure)
  }

  // Server logs You can alternatively enable these to mimic logs created
  // by your web server
  if (routeLogger) {
    app.use(routeLogger)
  }

  if (errorLogger) {
    app.use(errorLogger)
  }

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '..', 'views'))
  app.set('trust proxy', 1)

  app.use(express.static(path.join(__dirname, '..', '..', 'dist')))
  // app.use(favicon(path.join(__dirname, '..', 'dist', 'favicon.ico')))
  app.use(bodyParser.urlencoded({ extended: true }))

  if (rateLimitEnabled) {
    const limiter = rateLimit({
      windowMs: 60 * 1000,
      max: 10,
    })

    app.use('/download/html', limiter)
    app.use('/download', limiter)
  }

  if (certEndpoint) {
    app.get(`/${certEndpoint}`, (req, res) => {
      res.status(200).send(certSecret)
    })
  }

  app.use('/download/html', checkURLParameter)
  app.use('/download', checkURLParameter)

  app.get('/error', error)

  app.get('/about', (req, res) => {
    res.render('about', { version })
  })

  // NOTE: Capture all unkown URLs
  app.get('*', notFound)

  app.post('/download/html', downloadHTML(appLogger || null))
  app.post('/download', download(appLogger || null))
 

  app.use(genericErrorHandler)

  return app
}

module.exports = {
  configureApplication,
}
