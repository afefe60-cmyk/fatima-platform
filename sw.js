const CACHE_NAME = 'fatima-platform-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './Grade3_English_Curriculum.html',
  './English_Spelling_Digital_Flashcards.html',
  './manifest.json',
  './fatima_hero.jpg',
  './fatima_circle.png',
  './fatima_avatar.jpg',
  './favicon.png',
  './apple-touch-icon.png',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png',
  './images/smile/day_sunday.jpg',
  './images/smile/day_monday.jpg',
  './images/smile/day_tuesday.jpg',
  './images/smile/day_wednesday.jpg',
  './images/smile/day_thursday.jpg',
  './images/smile/day_friday.jpg',
  './images/smile/day_saturday.jpg',
  './images/smile/u1_classroom.jpg',
  './images/smile/u1_days_blackboard.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache new image or static requests dynamically
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.includes('/images/') || event.request.url.endsWith('.html') || event.request.url.endsWith('.png') || event.request.url.endsWith('.jpg'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
