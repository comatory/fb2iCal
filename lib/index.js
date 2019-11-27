const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('serve-favicon')
const rateLimit = require('express-rate-limit')

const retrieveICS = require('./services/ics-retriever')
const {
  genericErrorHandler,
  checkURLParameter,
  forceSecure,
  createRouteLogger,
  createErrorLogger,
} = require('./middlewares')
const { createAppLogger } = require('./utils')

const port = process.env.PORT
const certEndpoint = process.env.CERT_ENDPOINT || ''
const certSecret = process.env.CERT_SECRET || ''
const isDevelopment = process.env.NODE_ENV === 'development'
const enforceHTTPS = Boolean(process.env.ENFORCE_HTTPS)

const app = express()
const appLogger = createAppLogger({ dev: isDevelopment })
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
})
const pkg = require('../package.json')
const version = pkg.version || ''

// Force app to always redirect to HTTPS
// use when you can't configure web server
if (enforceHTTPS) {
  app.use(forceSecure)
}

// Server logs
// You can alternatively enable these to mimic logs created
// by your web server
if (isDevelopment) {
  app.use(createRouteLogger({ dev: isDevelopment }))
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('trust proxy', 1)

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.urlencoded({ extended: true }))

if (certEndpoint) {
  app.get(`/${certEndpoint}`, (req, res) => {
    res.status(200).send(certSecret)
  })
}

app.get('/', (req, res) => {
  res.render('index', { version })
})

app.get('/error', (req, res) => {
  const error = req.error || req.query.error || ''

  res
    .status(500)
    .render('error', { error })
})

app.get('/about', (req, res) => {
  res.render('about', { version })
})

// NOTE: Capture all unkown URLs
app.get('*', (req, res) => {
  res.status(400).render('404')
})

app.use('/download', limiter)
app.use('/download', checkURLParameter)
app.post('/download', async (req, res, next) => {
  try {
    const { url } = req.body

    const ics = await retrieveICS(url, {
      logger: appLogger,
    })

    res
      .contentType('text/calendar')
      .status(200)
      .send(new Buffer(ics, 'utf8'))
  } catch (err) {
    next(err)
  }
})

app.use(createErrorLogger({ dev: isDevelopment }))
app.use(genericErrorHandler)

app.listen(port)
