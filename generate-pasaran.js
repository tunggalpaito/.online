const fs = require('fs');

// =========================================================================
// 1. DATABASE KATA KUNCI SUPER AGRESIF DAN SANGAT BANYAK (DITAMPUNG LENGKAP)
// =========================================================================
const listPasaran = [
    { 
        code: 'macau', 
        nama: 'Macau Pools 5D & 4D', 
        tags: [
            'macau', 'macau 5d', 'macau4d', 'toto macau p1 p2 p3 p4 p5 p6', 'live draw macau prize', 
            'bocoran macau', 'prediksi togel macau', 'angka jitu macau pools', 'paito warna macau harian', 
            'data pengeluaran macau terbaru', 'prediksi macau hari ini akurat', 'toto macau pools', 
            'bocoran macau pools pusat', 'rumus jitu macau', 'bbfs macau pools', 'angka main macau'
        ] 
    },
    { 
        code: 'hk', 
        nama: 'Hongkong HK', 
        tags: [
            'hkg', 'hk', 'hongkong', 'hk jitu', 'togel hongkong', 'prediksi hk jitu', 'toto hk pools', 
            'rumus shio hongkong', 'data pengeluaran hk', 'live draw hk tercepat', 'bocoran hk malam ini', 
            'paito warna hk harian', 'angka jitu hk malam ini', 'prediksi jitu hk', 'master hk jitu'
        ] 
    },
    { 
        code: 'sydney', 
        nama: 'Sydney SDY', 
        tags: [
            'sdy', 'sydney pools lotto', 'sydney', 'bocoran sdy hari ini', 'angka jitu sdy hari ini', 
            'paito sdy', 'live draw sdy tercepat', 'prediksi sdy pools', 'data keluaran sdy', 
            'rumus sdy jitu', 'shio sdy terbaru', 'bbfs sydney pools', 'angka main sydney'
        ] 
    },
    { 
        code: 'cambodia', 
        nama: 'Cambodia Lottery', 
        tags: [
            'cambodia lottery', 'cambodia pools', 'bocoran cambodia', 'prediksi cambodia jitu', 
            'live draw cambodia', 'data pengeluaran cambodia', 'paito warna cambodia', 'angka jitu cambodia'
        ] 
    },
    { 
        code: 'china', 
        nama: 'Togel China', 
        tags: [
            'togel china', 'china pools', 'bocoran china pools', 'prediksi china jitu', 
            'live draw china', 'paito warna china', 'data keluaran china', 'angka main china'
        ] 
    },
    { 
        code: 'japan', 
        nama: 'Prediksi Japan', 
        tags: [
            'prediksi nomor japan', 'angka jitu japan', 'japan pools lotto', 'bocoran japan jitu', 
            'live draw japan', 'paito warna japan', 'data pengeluaran japan', 'rumus japan akurat'
        ] 
    },
    { 
        code: 'sgp', 
        nama: 'Singapore SGP', 
        tags: [
            'sgp', 'singapur', 'toto4d sgp', 'angka jitu sgp singapur', 'rumus sgp', 'bocoran sgp hari ini', 
            'live draw sgp tercepat', 'paito warna sgp harian', 'data pengeluaran sgp', 'prediksi sgp pools'
        ] 
    },
    { 
        code: 'taiwan', 
        nama: 'Togel Taiwan', 
        tags: [
            'togel taiwan', 'taiwan prize', 'bocoran taiwan', 'prediksi taiwan jitu', 
            'live draw taiwan tercepat', 'paito warna taiwan', 'data pengeluaran taiwan', 'angka main taiwan'
        ] 
    }
];

// VARIABEL KATA KUNCI TURUNAN UNTUK MENGGANDAKAN JALUR SEO
const tipeKonten = [
    { suffix: '-prediksi', judul: 'PREDIKSI JITU', kw: 'bocoran prediksi harian, angka jitu hari ini, rumus akurat 100, bbfs jp paus, ramalan toto' },
    { suffix: '-result', judul: 'RESULT LIVE DRAW', kw: 'data pengeluaran terbaru, hasil live tercepat, paito warna prize, angka keluar hari ini' },
    { suffix: '-shio', judul: 'TABEL SHIO RUMUS', kw: 'jalur shio main, rumus angka tarung, angka kumat, taysen, mistik lama mistik baru' }
];

const waktuUpdate = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
let createdFiles = [];

console.log("Robot Megabot SEO mulai mencetak halaman HTML...");

// =========================================================================
// 2. PROSES GENERATE KONTEN HTML SEO OTOMATIS
// =========================================================================
listPasaran.forEach(p => {
    tipeKonten.forEach(t => {
        const fileName = `${p.code}${t.suffix}.html`; 
        createdFiles.push(fileName); // Catat nama file untuk sitemap

        const judulLengkap = `${t.judul} ${p.nama.toUpperCase()} - ${p.tags.join(', ').toUpperCase()} BUKTI JP PERINGKAT 1`;
        const kumpulanKeywords = `${p.tags.join(', ')}, ${t.kw}, prediksi nomor jitu harian, paito warna, angka jitu hari ini`;

        const templateHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${judulLengkap}</title>
    <meta name="description" content="Pusat ${t.judul.toLowerCase()} ${p.nama} terakurat. Pembongkaran database rumus bbfs, paito warna harian, dan bocoran ${p.code} langsung dari pusat.">
    <meta name="keywords" content="${kumpulanKeywords}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="https://angkastatistik.my.id{fileName}">
    
    <!-- ROBOT ANTI-CACHE DETIKAN AGAR PENGUNJUNG DAN GOOGLE SELALU MENDAPAT DATA SEGAR -->
    <script>
        const waktuSekarang = Date.now();
        const linkCSS = document.createElement('link');
        linkCSS.rel = 'stylesheet';
        linkCSS.href = 'style.css?v=' + waktuSekarang;
        document.head.appendChild(linkCSS);
    </script>
</head>
<body>
    <header>
        <h1>${t.judul} ${p.nama}</h1>
        <p>Update Terakhir Server: <strong>${waktuUpdate} WIB</strong></p>
    </header>
    <main>
        <section class="prediksi-box">
            <h2>Jalur Kata Kunci Utama: ${p.tags.join(' | ').toUpperCase()}</h2>
            <p>Selamat datang di pusat pelacakan angka statistik. Halaman ini dirancang khusus oleh sistem robot pintar untuk menjemput data result, rumus shio, bbfs, dan prediksi toto pasaran <strong>${p.nama}</strong>.</p>
            <div id="data-angka">
                <!-- Data live ditarik otomatis dari script.js Anda -->
            </div>
        </section>
    </main>
</body>
</html>`;

        fs.writeFileSync(fileName, templateHTML, 'utf8');
    });
});

// =========================================================================
// 3. SEKALIGUS MENCETAK SITEMAP.XML AGAR KATA KUNCI MASUK GOOGLE & BING
// =========================================================================
let sitemapKonten = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://sitemaps.org">\n`;

// Tambahkan halaman utama
sitemapKonten += `  <url>\n    <loc>https://angkastatistik.my.id</loc>\n    <priority>1.00</priority>\n  </url>\n`;

// Masukkan semua file hasil generate robot ke sitemap secara otomatis
createdFiles.forEach(file => {
    sitemapKonten += `  <url>\n    <loc>https://angkastatistik.my.id{file}</loc>\n    <priority>0.80</priority>\n  </url>\n`;
});
sitemapKonten += `</urlset>`;

fs.writeFileSync('sitemap.xml', sitemapKonten, 'utf8');

console.log(`Sukses! Robot telah mencetak ${createdFiles.length} halaman HTML SEO penuh kata kunci beserta sitemap.xml.`);
