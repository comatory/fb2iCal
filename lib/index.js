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

const app = express()
const appLogger = createAppLogger({ dev: isDevelopment })

app.use(forceSecure)

// Server logs
app.use(createRouteLogger({ dev: isDevelopment }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser())

if (certEndpoint) {
  app.get(`/${certEndpoint}`, (req, res) => {
    res.status(200).send(certSecret)
  })
}

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/error', (req, res) => {
  const error = req.error || req.query.error || ''

  res
    .status(500)
    .render('error', { error })
})

app.get('/about', (req, res) => {
  res.render('about')
})

// NOTE: Capture all unkown URLs
app.get('*', (req, res) => {
  res.status(400).render('404')
})

app.use('/download', checkURLParameter)
app.use('/download', rateLimit())
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
