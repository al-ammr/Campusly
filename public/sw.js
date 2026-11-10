// public/sw.js
// Campusly Production Service Worker (D05 Section 10 / D04 PWA-01 to PWA-08)

const CACHE_VERSION = 'campusly-v1.0.6';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/offline',
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.jfif',
  '/main_logo.jfif',
  '/inverted_logo.jfif',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

const MAX_PAGES_CACHE = 50;

// Trim cache to limit size
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

// 1. Install Event: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Precache incomplete:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Purge Outdated Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![SHELL_CACHE, PAGES_CACHE, IMAGES_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Message Event: Admin Sign-out or Update Cache Clear
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'ADMIN_SIGNOUT') {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
  if (event.data && event.data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Fetch Event: Multi-tiered Caching Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // STRICT EXCLUSIONS per D04 PWA-04 / D08 SEC-112:
  // - Never cache non-GET requests (POST, PUT, PATCH, DELETE)
  // - Never cache any administrative routes (/admin/*)
  // - Never cache telemetry, auth, or internal API mutations
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/v1/auth') ||
    url.pathname.startsWith('/api/v1/admin') ||
    url.pathname.startsWith('/api/v1/jobs')
  ) {
    return; // Pass through to network
  }

  // A. Static Images: Stale-While-Revalidate
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico)$/)
  ) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkRes) => {
            if (networkRes.status === 200) {
              cache.put(request, networkRes.clone());
            }
            return networkRes;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // B. HTML Pages: Network-First with Offline Fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(PAGES_CACHE).then((cache) => {
              cache.put(request, resClone);
              trimCache(PAGES_CACHE, MAX_PAGES_CACHE);
            });
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offlinePage = await caches.match('/offline');
          return offlinePage || new Response('Offline - Connect to Campus Network', { status: 503 });
        })
    );
    return;
  }

  // C. Scripts & Styles: Network-First with Cache Fallback for reliable live updates
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached;
        })
    );
    return;
  }
});
