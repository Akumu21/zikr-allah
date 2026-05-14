const CACHE_NAME = 'dhikr-dua-v2';
const ASSETS = [
  '/zikr-allah/',
  '/zikr-allah/index.html',
  '/zikr-allah/manifest.json',
  '/zikr-allah/icon-192.png',
  '/zikr-allah/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Sadece kendi domain'imizden gelen istekleri handle et
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Geçerli response'u cache'e kaydet
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => {
        // Network yoksa cache'den sun
        return caches.match(e.request)
          || caches.match('/zikr-allah/index.html');
      })
  );
});
