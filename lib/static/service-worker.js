// Worker v14

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('fb-to-ical').then((cache) => {
      return cache.addAll([
        '/',
        '/favicon.ico',
        '/scripts.js?6',
        '/style.css?9',
        '/about?3',
        '/icon-512.png',
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