const crawl = require('./crawler')
const parseUsingLDJSONData = require('./ldjson-parser')
const parseUsingDOM = require('./dom-parser')
const generateICS = require('./ics-generator')
const { createParserError, getNormalizedUrl } = require('../utils')

const retrieveICS = async (URLparameter, { logger }) => {
  const url = getNormalizedUrl(URLparameter)
  const html = await crawl(url, { logger })
  const LDJSONEventData = parseUsingLDJSONData(html, { logger })
  const rawEventData = LDJSONEventData || parseUsingDOM(html, { logger })

  if (!rawEventData) {
    throw createParserError()
    return
  }

  const eventData = {
    ...rawEventData,
    url: rawEventData.url || url,
  }

  const icsContent = await generateICS(eventData)
  return icsContent
}

module.exports = retrieveICS
