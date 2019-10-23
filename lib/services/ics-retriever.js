const crawl = require('./crawler')
const parseUsingLDJSONData = require('./ldjson-parser')
const parseUsingDOM = require('./dom-parser')
const generateICS = require('./ics-generator')
const { createParserError, getNormalizedUrl } = require('../utils')

const retrieveICS = async (URLparameter) => {
  try {
    const url = getNormalizedUrl(URLparameter)
    const html = await crawl(url)
    const LDJSONEventData = parseUsingLDJSONData(html)
    const eventData = LDJSONEventData || parseUsingDOM(html, url)

    if (!eventData) {
      throw createParserError()
      return
    }

    const icsFile = await generateICS(eventData)
    return icsFile
  } catch (err) {
    throw err
  }
}

module.exports = retrieveICS
