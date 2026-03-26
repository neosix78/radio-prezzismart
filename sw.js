/**
 * Service Worker - Radio Prezzismart PWA
 */

const CACHE_NAME = 'radio-prezzismart-v2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon.svg'
];

// Installazione - cache assets statici
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker installato');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => console.log('Cache fallita:', err))
    );
    
    self.skipWaiting();
});

// Attivazione - pulizia cache vecchie
self.addEventListener('activate', (event) => {
    console.log('⚡ Service Worker attivato');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    
    self.clients.claim();
});

// Fetch - strategia Cache First per asset, Network per stream
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Non intercettare richieste al stream audio
    if (url.href.includes('.mp3') || url.href.includes('myfritz.net')) {
        return;
    }
    
    // Gestisci solo richieste dello stesso dominio
    if (url.origin !== self.location.origin) {
        return;
    }
    
    // Strategia Cache First per asset statici
    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) {
                // Ritorna cache ma aggiorna in background
                fetch(request)
                    .then(response => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, response);
                            });
                        }
                    })
                    .catch(() => {});
                
                return cached;
            }
            
            return fetch(request).then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseToCache);
                });
                
                return response;
            });
        })
    );
});

// Gestione messaggi dal client
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
