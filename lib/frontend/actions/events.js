import { postURL } from '../services'
import { requestStore } from '../stores'
import { Request } from '../records'
import { uuidv4, parseStartTimeFromiCalString } from '../utils'
import { extractEventDataFromHTML } from '../../../lib/services/ics-retriever'
import generateICS from '../../../lib/services/ics-generator'

const getEventHTML = async (url) => {
  const formData = new URLSearchParams()
  formData.set('url', url)

  try {
    const request = new Request({ id: uuidv4() })
    requestStore.set(request)
    const response = await postURL(formData)
    const text = await response.text()
    return text
  } catch (error) {
    requestStore.update((prevRequest) => {
      prevRequest.error = error
      return prevRequest
    })
    return null
  }
}

const createICS = (html, url, { logger }) => {
  try {
    // TODO: set parsing status in UI

    const eventData = extractEventDataFromHTML(html, url, { logger })
    generateICS(eventData)
      .then((text) => {
        const dataUri = encodeURIComponent(text)
        const uri = `data:text/calendar;charset=utf-8,${dataUri}`
        console.log(`SUCCESS - uri: ${uri}`)

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

        // TODO: clear UI status
        // clearStatuses()
      })
      // TODO: catch errors
      .catch(alert)
  } catch (err) {
    // TODO: catch errors
    alert(err)
  }
}

export const createEvent = async (url, { logger }) => {
  const html = await getEventHTML(url)
  const ics = await createICS(html, url, { logger })
}
