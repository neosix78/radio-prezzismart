/**
 * Service Worker - Radio Prezzismart PWA
 */

const CACHE_NAME = 'radio-prezzismart-v1';
const BASE_PATH = '/radio-prezzismart';
const STATIC_ASSETS = [
    BASE_PATH + '/',
    BASE_PATH + '/index.html',
    BASE_PATH + '/style.css',
    BASE_PATH + '/app.js',
    BASE_PATH + '/manifest.json',
    BASE_PATH + '/icon.svg'
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
    
    // Gestisci solo richieste dello stesso dominio e path base
    if (!url.pathname.startsWith(BASE_PATH)) {
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
