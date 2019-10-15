const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const crawl = require('./crawler')
const parseHTML = require('./parser')

const port = process.env.PORT || 3000
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser())

app.get('/', (req, res) => {
  res.render('index')
})

app.get('*', (req, res) => {
  res.render('404')
})

app.post('/download', async (req, res) => {
  const { url } = req.body

  try {
    const html = await crawl(url)
    const data = parseHTML(html)
    console.log(data)
  } catch (err) {
    console.error(err)
    return res.render('error', { error: err.toString() })
  }

  return res.render('download', { url })
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
