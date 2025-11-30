/**
 * PKM-Universe Service Worker
 * Enables offline functionality and caching for PWA
 */

const CACHE_NAME = 'pkm-universe-v3';
const RUNTIME_CACHE = 'runtime-cache-v3';

// Resources to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/style.css',
    '/css/mobile.css',
    '/js/animations.js',
    '/js/leaderboards.js',
    '/js/team-builder.js',
    '/js/pkhex-creator.js',
    '/js/trade-history.js',
    '/js/mystery-box.js',
    '/js/discord-widget.js',
    '/js/pokemon-creator.js',
    '/js/live-trading.js',
    '/js/main.js',
    '/js/dashboard.js',
    '/js/pokemon-data.js',
    '/manifest.json'
];

// External resources to cache on first use
const EXTERNAL_CACHE_URLS = [
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache essential resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.error('[SW] Precache failed:', err))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip WebSocket connections
    if (url.protocol === 'ws:' || url.protocol === 'wss:') return;

    // Skip API requests (always go to network)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Handle PokeAPI requests with cache-first strategy
    if (url.hostname === 'pokeapi.co') {
        event.respondWith(cacheFirst(request, RUNTIME_CACHE));
        return;
    }

    // Handle Pokemon sprite requests
    if (url.hostname === 'raw.githubusercontent.com' && url.pathname.includes('sprites')) {
        event.respondWith(cacheFirst(request, RUNTIME_CACHE));
        return;
    }

    // Handle Google Fonts and CDN resources
    if (url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com' ||
        url.hostname.includes('cdnjs.cloudflare.com')) {
        event.respondWith(cacheFirst(request, RUNTIME_CACHE));
        return;
    }

    // Default: stale-while-revalidate for same-origin requests
    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Cache-first strategy
async function cacheFirst(request, cacheName = CACHE_NAME) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response.clone());
            });
        }
        return response;
    }).catch(() => null);

    return cached || fetchPromise;
}

// Background sync for offline trades
self.addEventListener('sync', event => {
    if (event.tag === 'sync-trades') {
        event.waitUntil(syncPendingTrades());
    }
});

async function syncPendingTrades() {
    const db = await openTradesDB();
    const pendingTrades = await db.getAll('pending-trades');

    for (const trade of pendingTrades) {
        try {
            await fetch('/api/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trade)
            });
            await db.delete('pending-trades', trade.id);
        } catch (error) {
            console.error('[SW] Failed to sync trade:', error);
        }
    }
}

// Push notifications
self.addEventListener('push', event => {
    const data = event.data?.json() || {};

    const options = {
        body: data.body || 'New notification from PKM-Universe!',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            url: data.url || '/'
        },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'PKM-Universe', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'close') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data?.url || '/');
                }
            })
    );
});

// IndexedDB helper for offline storage
function openTradesDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pkm-universe-db', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pending-trades')) {
                db.createObjectStore('pending-trades', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

console.log('[SW] Service Worker loaded');
