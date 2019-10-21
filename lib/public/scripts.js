(() => {
  const noJS = () => {
    return Boolean(document.querySelector("#nojs").checked)
  }

  const useStorage = Boolean(window.localStorage)

  if (!window.fetch || !window.Promise || !window.URLSearchParams) {
    console.info('JS features not available.')
    return
  }

  const getStorage = () => {
    if (!useStorage) {
      return null
    }

    const storage = localStorage.getItem('fb-to-ical-events')

    if (!storage) {
      localStorage.setItem('fb-to-ical-events', JSON.stringify([]))
      return "[]"
    }

    return storage
  }

  const getStorageContents = (storage) => {
    return JSON.parse(storage)
  }

  const updateStorage = (storageContents) => {
    const encodedStorage = JSON.stringify(storageContents)

    localStorage.setItem('fb-to-ical-events', encodedStorage)
  }

  const saveRecord = (order, link, createdAt, title) => {
    if (!useStorage) {
      return
    }

    const storage = getStorage()
    const storageContents = getStorageContents(storage)

    const record = {
      order,
      link,
      createdAt: createdAt.toString(),
      title,
    }

    updateStorage([ ...storageContents, record ])
  }

  const showTable = () => {
    list.classList.remove('hidden')
  }

  const insertTableRow = ({ order, link, createdAt, title }) => {
    showTable()

    const row = document.createElement('tr')

    const orderCol = document.createElement('td')
    orderCol.innerText = order

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', link)
    linkElement.innerText = 'Download'

    const linkCol = document.createElement('td')
    linkCol.appendChild(linkElement)

    const createdAtCol = document.createElement('td')
    const parsedCreatedAt = new Date(createdAt)
    createdAtCol.innerText = (parsedCreatedAt || new Date()).toLocaleString()

    const titleCol = document.createElement('td')
    titleCol.innerText = title

    const newRow = document.createElement('tr')

    newRow.appendChild(orderCol)
    newRow.appendChild(linkCol)
    newRow.appendChild(createdAtCol)
    newRow.appendChild(titleCol)

    tableBody.prepend(newRow)
  }

  const createRecord = (uri, summary) => {
    const order = tableBody.querySelectorAll('tr').length + 1
    const createdAt = new Date()

    saveRecord(order, uri, createdAt, summary)
    insertTableRow({
      order,
      link: uri,
      createdAt,
      title: summary,
    })
  }

  const hydrateList = () => {
    if (!useStorage) {
      return
    }

    const storage = getStorage()
    const storageContents = getStorageContents(storage)

    if (storageContents.length > 0) {
      showTable()
    }

    storageContents
      .sort((a, b) => {
        if (a.order < b.order) {
          return -1
        }
        if (a.order > b.order) {
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
      fetch('/download', {
        method: 'POST',
        headers: {
          'Accept': 'text/calendar, application/json',
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
  window.postURL = postURL

  const form = document.querySelector('form')
  const submitButton = document.querySelector("#submit")
  const input = document.querySelector("#url")
  const link = document.querySelector("#current-download")
  const table = document.querySelector('#list')
  const tableBody = table.querySelector('tbody')
  const noJScheckbox = document.querySelector('#nojs')

  const loadNoJS = () => {
    if (!useStorage) {
      return
    }
    const value = localStorage.getItem('fb-to-ical-nojs')
    noJScheckbox.checked = value ? JSON.parse(value) : false
  }

  loadNoJS()

  if (window.navigator && window.navigator.serviceWorker && !noJS()) {
    const serviceWorker = window.navigator.serviceWorker
    serviceWorker.register('service-worker.js', {
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
    if (!useStorage) {
      return
    }

    localStorage.setItem('fb-to-ical-nojs', event.target.checked)
  })

  submitButton.addEventListener('click', (event) => {
    if (noJS()) {
      return
    }

    event.preventDefault()

    const formData = new URLSearchParams()
    formData.set('url', input.value)

    pendingRequest()

    postURL(formData)
      .then((res) => {
        res.text()
          .then((text) => {
            setStatusParsing()
            const dataUri = encodeURIComponent(text)
            const uri = `data:text/calendar;charset=utf-8,${dataUri}`

            link.setAttribute('href', uri)
            link.setAttribute('download', 'download.ics')
            link.click()

            input.value = ''

            const summaryMatch = text.match(/SUMMARY:.*/)[0]
            const summary = summaryMatch ? summaryMatch.replace(/SUMMARY:/, '') : ''

            createRecord(uri, summary)
            clearStatuses()
          })
          .catch((err) => {
            handleError(err)
          })
      })
      .catch((err) => {
        handleError(err)
      })
  })
})()
