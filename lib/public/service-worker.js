// Worker v4

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('fb-to-ical').then((cache) => {
      return cache.addAll([
        '/',
        '/favicon.ico',
        '/scripts.js?3',
        '/style.css?3',
        '/about?1',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})
