const { google } = require('googleapis');
const fs = require('fs');

// Basis data pasaran target yang akan didorong ke urutan depan
const daftarHalaman = [
  'macau-prediksi.html', 'macau-result.html', 'macau-shio.html',
  'hk-prediksi.html', 'hk-result.html', 'hk-shio.html',
  'sydney-prediksi.html', 'sydney-result.html', 'sydney-shio.html'
];

async function kirimSinyalKeGoogle() {
  console.log("Memulai proses optimasi kecepatan indeks otomatis...");
  
  const waktuWIB = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  
  // Memperbarui segel waktu di semua file agar Google mendeteksi konten paling baru
  daftarHalaman.forEach(file => {
    if (fs.existsSync(file)) {
      let konten = fs.readFileSync(file, 'utf8');
      konten = konten.replace(/<!-- WAKTU_UPDATE -->.*?<!-- \/WAKTU_UPDATE -->/g, `<!-- WAKTU_UPDATE -->${waktuWIB}<!-- /WAKTU_UPDATE -->`);
      fs.writeFileSync(file, konten, 'utf8');
      console.log(`File ${file} berhasil diperbarui pada: ${waktuWIB}`);
    }
  });

  // Mengirim notifikasi pembaruan langsung ke API Google
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.log("Sinyal API dilewati: Kredensial GOOGLE_SERVICE_ACCOUNT_JSON belum dikonfigurasi di GitHub Secrets.");
    return;
  }

  try {
    const kredensial = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const authClient = new google.auth.JWT(
      kredensial.client_email,
      null,
      kredensial.private_key,
      ['https://googleapis.com'],
      null
    );

    await authClient.authorize();
    console.log("Koneksi ke Google Indexing API berhasil.");

    for (const file of daftarHalaman) {
      const urlSitus = `https://angkastatistik.my.id{file}`;
      await authClient.request({
        url: 'https://googleapis.com',
        method: 'POST',
        data: {
          url: urlSitus,
          type: 'URL_UPDATED'
        }
      });
      console.log(`Sinyal terkirim! Google diperintahkan merayapi: ${urlSitus}`);
    }
  } catch (error) {
    console.error("Terjadi kendala pada pengiriman sinyal API:", error.message);
  }
}

kirimSinyalKeGoogle();

