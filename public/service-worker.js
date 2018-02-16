var CACHE = 'version-0';
var filesToCache = [
  // 'index.html',
  // 'app.js',
  // 'inline.css',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install, version cache: ' + CACHE);
  e.waitUntil(precache());
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(cleanCache());
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(fromCache(e.request));
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    console.log('[ServiceWorker] Caching app shell: ' + CACHE);
    return cache.addAll(filesToCache);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      console.log('[ServiceWorker] Fetch from cache', request.url);
      return matching || fetch(request)
    });
  });
}

function cleanCache() {
  return caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (key !== CACHE) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches.delete(key);
      } else {
        return Promise.resolve();
      }
    }));
  });
}
