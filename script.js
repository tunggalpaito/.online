// Memeriksa apakah browser pengunjung mendukung robot Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Robot Cache aktif!');
        
        // Memeriksa jika ada perubahan kode di server
        reg.onupdatefound = () => {
          const installer = reg.installing;
          installer.onstatechange = () => {
            if (installer.state === 'installed' && navigator.serviceWorker.controller) {
              // Jika ada perubahan, paksa browser pengunjung muat ulang halaman
              alert('Website diperbarui! Halaman akan dimuat ulang.');
              window.location.reload();
            }
          };
        };
      })
      .catch(err => console.log('Robot gagal aktif:', err));
  });
}

