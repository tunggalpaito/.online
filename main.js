import fs from 'fs';
import path from 'path';

// DOMAIN UTAMA ANDA
const DOMAIN = 'https://tunggalpaito.online';

// Fungsi untuk mencari file .html atau .md secara otomatis
function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Abaikan folder sistem yang tidak perlu masuk sitemap
        if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('.github') || filePath.includes('_site')) {
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            // Ambil file yang berakhiran .html atau .md saja
            if (file.endsWith('.html') || file.endsWith('.md')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

// Proses pembuatan sitemap.xml
function generateSitemap() {
    const files = getFiles('.');
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    files.forEach(filePath => {
        // Bersihkan path file agar URL menjadi bersih tanpa /index.html atau .html
        let cleanPath = filePath
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/\/index\.html$/, '') // Menghilangkan /index.html di akhir folder
            .replace(/\.html$/, '')
            .replace(/\.md$/, '');

        // Jika file adalah index utama di root
        if (cleanPath === 'index' || cleanPath === '') {
            cleanPath = '';
        }

        const url = `${DOMAIN}/${cleanPath}`;
        const lastMod = new Date().toISOString().split('T')[0];

        sitemapContent += `  <url>\n`;
        sitemapContent += `    <loc>${url}</loc>\n`;
        sitemapContent += `    <lastmod>${lastMod}</lastmod>\n`;
        sitemapContent += `  </url>\n`;
    });

    sitemapContent += `</urlset>`;

    // Simpan ke file sitemap.xml
    fs.writeFileSync('sitemap.xml', sitemapContent);
    console.log('Sitemap berhasil dibuat dengan URL bersih!');
}

generateSitemap();
