import { uuidv4, parseStartTimeFromiCalString } from './app/utils'
import {
  getConfigStorage,
  getStorageContents,
  saveRecord,
} from './app/storage'
import logger from './app/logger'
import { extractEventDataFromHTML } from '../../lib/services/ics-retriever'
import generateICS from '../../lib/services/ics-generator'

import boot from '../frontend'

(() => {
  document.addEventListener('DOMContentLoaded', boot)

  const createRecord = (uri, summary, startTime) => {
    const id = uuidv4()
    const createdAt = new Date()

    saveRecord({
      id,
      link: uri,
      createdAt,
      startTime,
      title: summary,
    })
  }

  const configureLogger = (logger) => {
    if (!logger) {
      return
    }

    const prevStorage = getConfigStorage()
    const storageContents = getStorageContents(prevStorage)

    const shouldTrack = Boolean(storageContents.track)

    logger.setRemoteLogging(shouldTrack)
  }

  const clearStatuses = () => {
    document.querySelectorAll('.status-item').forEach((item) => {
      item.classList.remove('show')
    })
  }

  const setStatusDownloading = () => {
    clearStatuses()
    document.querySelector('#network').classList.add('show')
  }

  const setStatusParsing = () => {
    clearStatuses()
    document.querySelector('#parsing').classList.add('show')
  }

  const setStatusError = (err) => {
    clearStatuses()
    const error = document.querySelector('#error')
    error.innerText = err.toString()
    error.classList.add('show')
  }

  const setServiceWorkerStatus = (status) => {
    clearStatuses()
    const sw = document.querySelector('#service-worker')
    sw.innerText = status
    status ? sw.classList.add('show') : sw.classList.remove('show')
  }

  const pendingRequest = () => {
    input.disabled = true
    submitButton.disabled = true
    setStatusDownloading()
  }

  const finishedRequest = () => {
    input.disabled = false
    submitButton.disabled = false
    clearStatuses()
  }

  const handleError = (error) => {
    finishedRequest()
    setStatusError(error)
  }

  const postURL = (data) => {
    return new Promise((resolve, reject) => {
      fetch('/download/html/', {
        method: 'POST',
        headers: {
          'Accept': 'text/html, application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      }).then((response) => {
        if (response.status !== 200) {
          if (response.body.constructor === ReadableStream) {
            response.json().then((json) => reject(json.error || response.statusText))
            return
          }
          reject(response.statusText)
          return
        }
        finishedRequest()
        resolve(response)
      }).catch(reject)
    })
  }

  const form = document.querySelector('form')
  const submitButton = document.querySelector("#submit")
  const input = document.querySelector("#url")
  const link = document.querySelector("#current-download")

  if (window.navigator && window.navigator.serviceWorker) {
    const serviceWorker = window.navigator.serviceWorker
    serviceWorker.register('sw.js', {
      scope: './',
    }).then((registration) => {
      setServiceWorkerStatus(`Service worker registered with scope ${registration.scope}`)
      setTimeout(() => {
        setServiceWorkerStatus('')
      }, 4500)

      registration.addEventListener('updatefound', () => {
        console.info('Service worker will be updated...')
        const newWorker = registration.installing

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            newWorker.postMessage({ action: 'skipWaiting' })
          }
        })
      })
    }).catch((err) => {
      setServiceWorkerStatus(`Service worker error: ${err.toString()}`)
    })

    let refreshing
    serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) {
        return
      }
      window.location.reload()
      refreshing = true
    })
  }

  configureLogger(logger)

  const handleHTMLResponse = (html, url) => {
    try {
      setStatusParsing()

      const eventData = extractEventDataFromHTML(html, url, { logger })
      generateICS(eventData)
        .then((text) => {
          const dataUri = encodeURIComponent(text)
          const uri = `data:text/calendar;charset=utf-8,${dataUri}`

          link.setAttribute('href', uri)
          link.setAttribute('download', 'download.ics')
          link.click()

          input.value = ''

          const summaryMatch = text.match(/SUMMARY:.*/)[0]
          const summary = summaryMatch ? summaryMatch.replace(/SUMMARY:/, '') : ''
          const startTimeMatches = text.match(/DTSTART:.*/)
          const startTimeMatch = text.length > 0 ?
            (startTimeMatches[0] || '').replace(/DTSTART:/, '') :
            ''
          const startTime = parseStartTimeFromiCalString(startTimeMatch)

          createRecord(uri, summary, startTime)

          clearStatuses()
        })
        .catch((err) => {
          handleError(err)
        })
    } catch (err) {
      handleError(err)
    }
  }

  submitButton.addEventListener('click', (event) => {
    if (!form.reportValidity()) {
      return
    }

    event.preventDefault()

    const formData = new URLSearchParams()
    formData.set('url', input.value)

    pendingRequest()

    postURL(formData)
      .then((res) => {
        res.text()
          .then((response) => handleHTMLResponse(response, input.value))
          .catch((err) => {
            handleError(err)
          })
      })
      .catch((err) => {
        handleError(err)
      })
  })
})()
