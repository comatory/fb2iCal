self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('fb-to-ical').then((cache) => {
      return cache.addAll([
        '/',
        '/favicon.ico',
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
