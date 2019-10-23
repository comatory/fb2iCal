const cheerio = require('cheerio')
const dayjs = require('dayjs')
const { parseDates } = require('../parser-utils')

const parseDate = (timeText) => {
  const parts = timeText.split('at')
  const datePart = parts[0] || null
  const timePart = parts[1] || null

  if (!datePart) {
    return {
      start: null,
      duration: null,
    }
  }

  const normalizedTimeString = `${datePart}${timePart || ''}`
  const startTime = dayjs(normalizedTimeString)

  const { start, duration } = parseDates(startTime, null)

  return {
    start,
    duration,
  }
}

const createLocationData = (streetText, areaText) => {
  const location = ([ streetText, areaText ])
    .filter(i => i)
    .join(', ') || ''

  return location.replace(/\r?\n|\r/g, ' ')
}

// NOTE: Fallback parser
// Attempt reading event data directly from DOM
const parseUsingDOM = (html, url) => {
  console.info('Fallback parser used')
  const $ = cheerio.load(html)
  const title = $('title').text()

  const $eventSummary = $('#event_summary')
  const $eventNode = $eventSummary ? $eventSummary.children()[1] : null

  const $timeNode = $eventNode ? $eventNode.childNodes[0] : null
  const $locationNode = $eventNode ? $eventNode.childNodes[1] : null

  const timeText = $timeNode ? $timeNode.attribs.title : ''

  const $locationBlock = $locationNode ? $($locationNode).find('td') : null
  const $locationBlockTDs = $locationBlock ? $locationBlock.children() : []
  const $streetBlock = $locationBlockTDs[1] || null
  const $areaBlock = $locationBlockTDs[2] || null

  const streetText = $streetBlock ? $($streetBlock).text() : ''
  const areaText = $areaBlock ? $($areaBlock).text() : ''

  const location = createLocationData(streetText, areaText)
  const { start, duration } = parseDate(timeText)

  const eventData = {
    location,
    start,
    duration,
    title,
    url,
  }

  if (!eventData.title || !eventData.start) {
    return null
  }

  return eventData
}

module.exports = parseUsingDOM
