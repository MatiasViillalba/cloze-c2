/* eslint-env serviceworker */
/**
 * Service worker — the reason this thing works in aeroplane mode.
 *
 * Strategy: precache the entire asset graph on install, then serve cache-first.
 * The content bank is static and versioned with the build, so there is nothing
 * to revalidate at runtime and no reason to ever touch the network once the
 * app is on the home screen.
 */

const BUILD = '2026.09.06';
const CACHE = 'cloze-c2-' + BUILD;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',

  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/css/screens.css',
  './assets/css/animations.css',

  './assets/js/version.js',
  './assets/js/core/util.js',
  './assets/js/core/store.js',
  './assets/js/core/srs.js',
  './assets/js/core/content.js',

  './assets/js/data/passages-01.js',
  './assets/js/data/passages-02.js',
  './assets/js/data/passages-03.js',
  './assets/js/data/passages-04.js',
  './assets/js/data/passages-05.js',
  './assets/js/data/passages-06.js',
  './assets/js/data/passages-07.js',
  './assets/js/data/passages-08.js',
  './assets/js/data/drills-01.js',
  './assets/js/data/drills-02.js',
  './assets/js/data/drills-03.js',

  './assets/js/ui/toast.js',
  './assets/js/ui/home.js',
  './assets/js/ui/cloze.js',
  './assets/js/ui/drill.js',
  './assets/js/ui/result.js',
  './assets/js/ui/library.js',
  './assets/js/ui/stats.js',
  './assets/js/ui/settings.js',
  './assets/js/app.js',

  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    /* Added one by one: a single 404 must not abandon the whole precache. */
    await Promise.all(ASSETS.map((url) => cache.add(url).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (err) {
      /* Offline and not in cache: hand back the shell for navigations. */
      if (request.mode === 'navigate') {
        const shell = await caches.match('./index.html');
        if (shell) return shell;
      }
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
