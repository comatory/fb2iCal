const { getNormalizedUrl } = require('../utils')
const crawl = require('../services/crawler')
const { retrieveICS } = require('../services/ics-retriever')

const downloadHTML = (logger) => (async (req, res, next) => {
  try {
    const { url } = req.body

    const facebookURL = getNormalizedUrl(url)
    const html = await crawl(facebookURL, { logger })

    res
      .contentType('text/html')
      .status(200)
      .send(Buffer.from(html, 'utf8'))
  } catch (err) {
    next(err)
  }
})

const download = (logger) => (async (req, res, next) => {
  try {
    const { url } = req.body

    const ics = await retrieveICS(url, {
      logger,
      crawl,
    })

    res
      .contentType('text/calendar')
      .status(200)
      .send(Buffer.from(ics, 'utf8'))
  } catch (err) {
    next(err)
  }
})

module.exports = {
  downloadHTML,
  download,
}
