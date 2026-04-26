/**
 * Service Worker - Radio Prezzismart PWA
 */

const CACHE_NAME = 'radio-prezzismart-v3';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon.svg'
];

// Installazione - cache assets statici (best-effort, non blocca su singolo fail)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.all(
                STATIC_ASSETS.map(asset =>
                    cache.add(asset).catch(err => console.log('Skip cache', asset, err))
                )
            )
        )
    );
    self.skipWaiting();
});

// Attivazione - pulizia cache vecchie
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch - Network First (sempre fresco, fallback cache se offline)
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Non intercettare stream audio o richieste cross-origin
    if (url.href.includes('.mp3') || url.href.includes('myfritz.net')) return;
    if (url.origin !== self.location.origin) return;
    if (request.method !== 'GET') return;

    event.respondWith(
        fetch(request)
            .then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request).then(cached => cached || Response.error()))
    );
});

// Gestione messaggi dal client
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') self.skipWaiting();
});
