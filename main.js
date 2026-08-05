const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sitemap.xml');

// 1. Cek apakah file sitemap.xml ada
if (!fs.existsSync(filePath)) {
    console.error('❌ Error: File sitemap.xml tidak ditemukan di direktori ini.');
    process.exit(1);
}

try {
    // 2. Baca isi file sitemap
    let content = fs.readFileSync(filePath, 'utf8').trim();

    // 3. Perbaiki tag pembuka <urlset> jika terpotong
    if (content.includes('urlset xmlns=') && !content.includes('<urlset xmlns=')) {
        content = content.replace('urlset xmlns=', '<urlset xmlns=');
        console.log('🔧 Memperbaiki tag pembuka <urlset>...');
    }

    // 4. Pastikan deklarasi XML wajib ada di baris pertama
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    if (!content.startsWith('<?xml')) {
        content = xmlDeclaration + '\n' + content;
        console.log('🔧 Menambahkan deklarasi XML standar...');
    }

    // 5. Pastikan tag penutup </urlset> ada di paling akhir
    if (!content.endsWith('</urlset>')) {
        content = content.replace(/<\/urlset>?\s*$/, '');
        content = content + '\n</urlset>';
        console.log('🔧 Memperbaiki tag penutup </urlset>...');
    }

    // 6. Simpan kembali file yang sudah diperbaiki
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Berhasil! Sitemap.xml bersih, rapi, dan siap digunakan.');

} catch (error) {
    console.error('❌ Terjadi kesalahan saat memproses sitemap:', error.message);
    process.exit(1);
}
