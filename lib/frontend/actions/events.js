import { postURL } from '../services'
import { eventStore, parseStatusStore, requestStore } from '../stores'
import { Request } from '../records'
import {
  uuidv4,
  parseStartTimeFromiCalString,
  promptDownload,
  encodeIcalString,
} from '../utils'
import { extractEventDataFromHTML } from '../../../lib/services/ics-retriever'
import generateICS from '../../../lib/services/ics-generator'

const getEventHTML = async (url) => {
  const formData = new URLSearchParams()
  formData.set('url', url)

  try {
    const request = new Request({
      id: uuidv4(),
      url,
    })
    requestStore.set(request)
    const response = await postURL(formData)
    const text = await response.text()

    requestStore.set(null)
    return text
  } catch (error) {
    requestStore.update((prevRequest) => {
      prevRequest.error = error
      return prevRequest
    })
    return null
  }
}

const createICS = async (html, url, { logger }) => {
  try {
    parseStatusStore.set('Parsing event data...')

    const eventData = extractEventDataFromHTML(html, url, { logger })
    const text = await generateICS(eventData)
    const dataUri = encodeIcalString(text)
    const uri = `data:text/calendar;charset=utf-8,${dataUri}`

    const summaryMatch = text.match(/SUMMARY:.*/)[0]
    const summary = summaryMatch ? summaryMatch.replace(/SUMMARY:/, '') : ''
    const startTimeMatches = text.match(/DTSTART:.*/)
    const startTimeMatch = text.length > 0 ?
      (startTimeMatches[0] || '').replace(/DTSTART:/, '') :
      ''
    const startTime = parseStartTimeFromiCalString(startTimeMatch)

    eventStore.setCalculation({
      id: uuidv4(),
      link: uri,
      createdAt: new Date(),
      startTime,
      title: summary,
    })

    parseStatusStore.set(null)

    promptDownload(uri)
  } catch (err) {
    parseStatusStore.set(err)
    throw err
  }
}

export const createEvent = async (url, { logger }) => {
  try {
    const html = await getEventHTML(url)
    const ics = await createICS(html, url, { logger })
  } catch(error) {
    logger.log({
      message: error.toString(),
      level: 'error',
      service: 'parser',
    })
  }
}
