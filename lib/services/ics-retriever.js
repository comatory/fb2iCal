const parseUsingLDJSONData = require('./ldjson-parser')
const parseUsingDOM = require('./dom-parser')
const generateICS = require('./ics-generator')
const { createParserError, getNormalizedUrl } = require('../utils')

const extractEventDataFromHTML = (html, url, { logger }) => {
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

  return eventData
}

const retrieveICS = async (URLparameter, { logger, crawl }) => {
  const url = getNormalizedUrl(URLparameter)
  const html = await crawl(url, { logger })
  const eventData = extractEventDataFromHTML(html, url, { logger })
  const icsContent = await generateICS(eventData)

  return icsContent
}

module.exports = {
  retrieveICS,
  extractEventDataFromHTML,
}
