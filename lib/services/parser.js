const dayjs = require('dayjs')
const cheerio = require('cheerio')
const { createParserError } = require('../utils')

// NOTE: Specific formatting for `ics` library
const parseDates = (startDate, endDate) => {
  const start = startDate ? [
    startDate.year(),
    startDate.month() + 1,
    startDate.date(),
    startDate.hour(),
    startDate.minute(),
  ] : (() => {
    const now = dayjs()

    return [
      now.year(),
      now.month() + 1,
      now.date()
    ]
  })()
  const diffInMinutes = endDate ?
    endDate.diff(startDate, 'minutes') :
    120

  const duration = { minutes: diffInMinutes }

  return {
    start,
    duration,
  }
}

const parseEventData = (eventData) => {
  const startDate = eventData.startDate && dayjs(eventData.startDate)
  const endDate = eventData.endDate && dayjs(eventData.endDate)
  const { start, duration } = parseDates(startDate, endDate)
  const { location } = eventData || {}
  const { address } = location || {}

  const locationStr = location ? [
    location.name || '',
    address.streetAddress || '',
    address.addressLocality || '',
    address.postalCode || '',
    address.addressCountry || '',
  ].join(' ') : ''
  const cleanedLocationStr = locationStr.replace(/\r?\n|\r/g, ' ')
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

const parseHTML = (html) => {
  try {
    // NOTE: Mobile web should have serialized
    // event info in one of the script tags
    const $ = cheerio.load(html)
    const $scripts = $('head script[type="application/ld+json"]')
    const rawData = $scripts.toArray().reduce((data, node) => {
      const firstNode = node.children[0]

      if (!firstNode || !firstNode.data) {
        return data
      }

      if (firstNode.data.startsWith('//<![CDATA')) {
        return firstNode.data
      }

      return data
    }, null)

    if (!rawData) {
      throw createParserError()
    }

    const eventData = JSON.parse(rawData.slice(12, -5))
    const data = parseEventData(eventData)

    return data
  } catch (err) {
    throw err
  }
}

module.exports = parseHTML
