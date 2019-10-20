const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('serve-favicon')

const crawl = require('./crawler')
const parseHTML = require('./parser')
const generateICS = require('./ics')
const { genericErrorHandler, checkFBURL } = require('./middlewares')

const port = process.env.PORT
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')))
app.use(bodyParser())

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/error', (req, res) => {
  const error = req.error || req.query.error || ''

  res
    .status(500)
    .render('error', { error })
})

app.get('/download', (req, res) => {
  res
    .status(200)
    .render('download')
})

// NOTE: Capture all unkown URLs
app.get('*', (req, res) => {
  res.status(400).render('404')
})

app.use('/download', checkFBURL)
app.post('/download', async (req, res) => {
  const { url } = req.body

  try {
    const html = await crawl(url)
    const data = parseHTML(html)
    const ics = await generateICS(data)

    if (ics) {
      return res
        .contentType('text/calendar')
        .send(200, new Buffer(ics, 'utf8'))
    }
  } catch (err) {
    return next(err)
  }
})

app.use(genericErrorHandler)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
