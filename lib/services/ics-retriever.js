const crawl = require('./crawler')
const parseHTML = require('./parser')
const generateICS = require('./ics-generator')
const { getNormalizedUrl } = require('../utils')

const retrieveICS = async (URLparameter) => {
  try {
    const url = getNormalizedUrl(URLparameter)
    const html = await crawl(url)
    const eventData = parseHTML(html)
    const icsFile = await generateICS(eventData)
    return icsFile
  } catch (err) {
    throw err
  }
}

module.exports = retrieveICS
