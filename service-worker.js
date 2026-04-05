const CACHE_NAME = '4-fases-v1.1.4';

// Assets com estratégia Stale-While-Revalidate (HTML, CSS, JS)
const SWR_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
];

// Assets com estratégia Cache-First (ícones e fontes — raramente mudam)
const CACHE_FIRST_ASSETS = [
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
];

// ── Install: pré-cache todos os assets ──────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...SWR_ASSETS, ...CACHE_FIRST_ASSETS]);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: limpar caches antigos e notificar clientes ─
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Notificar todas as abas abertas que há nova versão
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'NEW_VERSION' });
        });
      });
    }).then(() => self.clients.claim())
  );
});

// ── Fetch ────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Cache-First: ícones PNG e fontes externas
  const isCacheFirst =
    CACHE_FIRST_ASSETS.some((a) => url.pathname.endsWith(a.replace('./', '/'))) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (isCacheFirst) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate: HTML, CSS, JS e demais assets locais
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => {
          // Offline: retorna cache ou fallback HTML
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return cache.match('./index.html');
          }
        });

        // Retorna cache imediatamente e atualiza em background
        return cached || networkFetch;
      });
    })
  );
});

// ── Mensagens do cliente ─────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
