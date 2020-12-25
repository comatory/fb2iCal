import { swStatusStore } from './stores'

export default () => {
  if (!window.navigator || !window.navigator.serviceWorker) {
    return
  }

  const { serviceWorker } = window.navigator

  serviceWorker.register('sw.js', {
    scope: './',
  }).then((registration) => {
    swStatusStore.set(`Service worker registered with scope ${registration.scope}`)
    setTimeout(() => {
      swStatusStore.set(null)
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
    swStatusStore.set(`Service worker error: ${err.toString()}`)
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
