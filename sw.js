// Nama folder cache unik (berubah otomatis setiap detik)
const CACHE_NAME = 'web-cache-' + Date.now(); 

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Memaksa robot langsung bekerja tanpa menunggu browser ditutup
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Koreksi: Menghapus cache lama secara bersih agar memori pengunjung lega
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Mengambil aset terbaru dari server, bukan dari memori HP/Laptop pengunjung
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

