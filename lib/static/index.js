import { noJS, uuidv4, parseStartTimeFromiCalString, useStorage } from './app/utils'
import {
  migrateRecord,
  getStorage,
  getStorageContents,
  updateStorage,
  saveRecord,
  deleteRecord,
} from './app/storage'
import logger from './app/logger'
import { extractEventDataFromHTML } from '../../lib/services/ics-retriever'
import generateICS from '../../lib/services/ics-generator'

(() => {
  if (!window.fetch || !window.Promise || !window.URLSearchParams || !window.crypto) {
    console.warn('JS features not available.')
    return
  }

  const showTable = () => {
    list.classList.remove('hidden')
  }

  const deleteTableRow = (id, row) => {
    deleteRecord(id)

    if (!useStorage()) {
      return
    }

    row.remove()
  }

  const insertTableRow = ({ id, link, createdAt, startTime, title }) => {
    showTable()

    const newRow = document.createElement('tr')

    const startTimeCol = document.createElement('td')
    startTimeCol.innerText = startTime ?
      new Date(startTime).toLocaleString() :
      'N/A\xa0\xa0\xa0\xa0\xa0'

    const downloadEl = document.createElement('a')
    downloadEl.setAttribute('href', link)
    downloadEl.innerText = title

    const titleCol = document.createElement('td')
    titleCol.appendChild(downloadEl)

    const deleteEl = document.createElement('a')
    deleteEl.setAttribute('href', 'javascript:void(0)')
    deleteEl.innerText = '✖︎'
    deleteEl.classList.add('delete-record')
    deleteEl.addEventListener('click', (event) => {
      event.preventDefault()
      deleteTableRow(id, newRow)
    })

    const actionCol = document.createElement('td')
    actionCol.classList.add('actions')
    actionCol.appendChild(deleteEl)

    newRow.appendChild(startTimeCol)
    newRow.appendChild(titleCol)
    newRow.appendChild(actionCol)

    tableBody.prepend(newRow)
  }

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
    insertTableRow({
      id,
      link: uri,
      createdAt,
      title: summary,
      startTime
    })
  }

  const hydrateList = () => {
    if (!useStorage()) {
      return
    }

    const prevStorage = getStorage()
    const migratedStorageContents = getStorageContents(prevStorage).map((record) => {
      return migrateRecord(record)
    })
    updateStorage(migratedStorageContents)
    const storage = getStorage()
    const storageContents = getStorageContents(storage)

    if (storageContents.length > 0) {
      showTable()
    }

    storageContents
      .sort((a, b) => {
        const aDate = new Date(a.createdAt)
        const bDate = new Date(b.createdAt)
        if (aDate < bDate) {
          return -1
        }
        if (aDate > bDate) {
          return 1
        }
        return 0
      })
      .forEach((record) => {
        insertTableRow(record)
      })
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
      fetch('/download/html', {
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
  const table = document.querySelector('#list')
  const tableBody = table.querySelector('tbody')
  const noJScheckbox = document.querySelector('#nojs')

  const loadNoJS = () => {
    if (!useStorage()) {
      return
    }
    const value = localStorage.getItem('fb-to-ical-nojs')
    noJScheckbox.checked = value ? JSON.parse(value) : false
  }

  loadNoJS()

  if (window.navigator && window.navigator.serviceWorker && !noJS()) {
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

  if (!noJS()) {
    hydrateList()
  }

  noJScheckbox.addEventListener('click', (event) => {
    if (!useStorage()) {
      return
    }

    localStorage.setItem('fb-to-ical-nojs', event.target.checked)
  })


  const handleHTMLResponse = (html) => {
    try {
      setStatusParsing()

      const eventData = extractEventDataFromHTML(html, { logger })
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
    if (noJS()) {
      return
    }

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
          .then(handleHTMLResponse)
          .catch((err) => {
            handleError(err)
          })
      })
      .catch((err) => {
        handleError(err)
      })
  })
})()
