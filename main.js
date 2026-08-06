const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://tunggalpaito.online';

// --- FUNGSI PEMINDAI KHUSUS SITEMAP (Tanpa Ubah-ubah File HTML) ---
function processFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Abaikan folder sistem dan folder result agar tidak masuk sitemap
        if (
            filePath.includes('node_modules') || 
            filePath.includes('.git') || 
            filePath.includes('.github') ||
            filePath.includes('_site') ||
            filePath.includes('data') ||
            filePath.includes('result') || 
            file === '.DS_Store' ||
            file === 'Thumbs.db'
        ) {
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            processFiles(filePath, fileList);
        } else {
            // Hanya ambil file .html atau .md untuk sitemap
            if (file.endsWith('.html') || file.endsWith('.md')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// --- ROBOT PEMBUAT SITEMAP & ROBOTS.TXT ---
function generateSitemap() {
    const files = processFiles('.');
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    files.forEach(filePath => {
        let cleanPath = filePath
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/\/index\.html$/, '')
            .replace(/\.html$/, '')
            .replace(/\.md$/, '');

        if (cleanPath === 'index' || cleanPath === '') cleanPath = '';

        const url = `${DOMAIN}/${cleanPath}`;
        const lastMod = fs.statSync(filePath).mtime.toISOString().split('T')[0];

        sitemapContent += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>\n`;
    });

    sitemapContent += `</urlset>`;
    
    // Simpan sitemap.xml dan robots.txt
    fs.writeFileSync('sitemap.xml', sitemapContent);
    fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
    
    console.log('Sitemap & Robots.txt berhasil diperbarui dengan kilat!');
}

generateSitemap();
