// Service Worker for PKM Tool
// This enables better offline support and notification handling

const CACHE_NAME = 'pkm-tool-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for notifications
self.addEventListener('sync', event => {
  if (event.tag === 'daily-notification') {
    event.waitUntil(sendDailyNotification());
  }
});

async function sendDailyNotification() {
  // This would be called when background sync is triggered
  // Currently, the app handles notifications from the main thread
  console.log('Background sync triggered for daily notification');
}
