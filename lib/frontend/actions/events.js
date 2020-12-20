import { postURL } from '../services'
import { parseStatusStore, requestStore } from '../stores'
import { Request } from '../records'
import { uuidv4, parseStartTimeFromiCalString } from '../utils'
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
    const dataUri = encodeURIComponent(text)
    const uri = `data:text/calendar;charset=utf-8,${dataUri}`

        // TODO: create download link
        // link.setAttribute('href', uri)
        // link.setAttribute('download', 'download.ics')
        // link.click()

        // input.value = ''

    const summaryMatch = text.match(/SUMMARY:.*/)[0]
    const summary = summaryMatch ? summaryMatch.replace(/SUMMARY:/, '') : ''
    const startTimeMatches = text.match(/DTSTART:.*/)
    const startTimeMatch = text.length > 0 ?
      (startTimeMatches[0] || '').replace(/DTSTART:/, '') :
      ''
    const startTime = parseStartTimeFromiCalString(startTimeMatch)

    // TODO: save record to a store
    // createRecord(uri, summary, startTime)

    parseStatusStore.set(null)
  } catch (err) {
    parseStatusStore.set(err)
  }
}

export const createEvent = async (url, { logger }) => {
  const html = await getEventHTML(url)
  const ics = await createICS(html, url, { logger })
}
