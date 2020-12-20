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
import { requestStore } from '../frontend/stores'
import { Request } from '../frontend/records'

(() => {
  let request = null

  requestStore.subscribe((updatedRequest) => {
    request = updatedRequest
  })

  document.addEventListener('DOMContentLoaded', boot)

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

  const setServiceWorkerStatus = (status) => {
    clearStatuses()
    const sw = document.querySelector('#service-worker')
    sw.innerText = status
    status ? sw.classList.add('show') : sw.classList.remove('show')
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
})()
