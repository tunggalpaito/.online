const fs = require('fs');
const path = 'sitemap.xml';

if (!fs.existsSync(path)) {
  console.log('File sitemap.xml tidak ditemukan.');
  process.exit(0);
}

let content = fs.readFileSync(path, 'utf8').trim();

// 1. Perbaiki jika tag urlset terpotong di awal
if (content.includes('urlset xmlns=') && !content.includes('<urlset xmlns=')) {
  content = content.replace('urlset xmlns=', '<urlset xmlns=');
}

// 2. Pastikan deklarasi XML wajib ada di baris pertama
const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
if (!content.startsWith('<?xml')) {
  content = xmlDeclaration + '\n' + content;
}

// 3. Pastikan tag penutup </urlset> ada di paling akhir
if (!content.endsWith('</urlset>')) {
  content = content.replace(/<\/urlset>?$/, '');
  content = content + '\n</urlset>';
}

fs.writeFileSync(path, content, 'utf8');
console.log('Sitemap berhasil diperiksa dan diperbaiki menggunakan Node.js v24 murni!');
