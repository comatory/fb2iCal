const cheerio = require('cheerio')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

const { parseDates } = require('../parser-utils')

dayjs.extend(utc)

const parseEventData = (eventData) => {
  const startDate = eventData.startDate ?
    dayjs(eventData.startDate) :
    dayjs.utc(new Date())
  const endDate = eventData.endDate && dayjs.utc(eventData.endDate)
  const { start, duration } = parseDates(startDate, endDate)
  const { location } = eventData || {}
  const { address } = location || {}

  const locationName = location ? location.name : ''
  const addressStr = address ? [
    address.streetAddress || '',
    address.addressLocality || '',
    address.postalCode || '',
    address.addressCountry || '',
  ].join(' ') : ''
  const locationStr = [
    locationName,
    addressStr,
  ].join(' ')
  const cleanedLocationStr = locationStr.trim().replace(/\r?\n|\r/g, ' ')
  const title = eventData.name || ''
  const url = eventData.url || ''
  const description = eventData.description || ''

  return {
    start,
    duration,
    location: cleanedLocationStr,
    title,
    url,
    description,
  }
}

const parseUsingLDJSONData = (html, { logger }) => {
  if (logger) {
    logger.log({
      message: 'Parsing using LDJSON parser',
      level: 'info',
      service: 'parser',
    })
  }

  // NOTE: Mobile web should have serialized
  // event info in one of the script tags
  const $ = cheerio.load(html)
  const $scripts = $('head script[type="application/ld+json"]')
  const rawData = $scripts.toArray().reduce((data, node) => {
    const firstNode = node.children[0]

    if (!firstNode || !firstNode.data) {
      return data
    }

    // NOTE: Handle prefix
    if (firstNode.data.startsWith('//<![CDATA')) {
      return firstNode.data.slice(12, -5)
    }

    if (firstNode.data) {
      return firstNode.data.trim()
    }

    return data
  }, null)

  if (!rawData) {
    return null
  }

  const eventData = JSON.parse(rawData)
  const data = parseEventData(eventData)

  return data
}

module.exports = parseUsingLDJSONData
