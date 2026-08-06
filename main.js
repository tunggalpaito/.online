const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://tunggalpaito.online';

// --- HANYA MENARIK DAFTAR FILE HTML & MD UNTUK SITEMAP ---
function getFiles(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        
        if (
            filePath.includes('node_modules') || 
            filePath.includes('.git') || 
            filePath.includes('.github') || 
            filePath.includes('data') ||
            filePath.includes('result') || 
            file.startsWith('.') ||
            file === 'sitemap.xml' || // PENTING: Supaya sitemap tidak dibaca ulang
            file === 'robots.txt'     // PENTING: Supaya robots.txt tidak dibaca ulang
        ) return;

        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.md')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// --- UPDATE SITEMAP & ROBOTS.TXT ---
function updateSitemap() {
    const files = getFiles('.');
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

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

        sitemap += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>\n`;
    });

    sitemap += `</urlset>`;
    
    fs.writeFileSync('sitemap.xml', sitemap);
    fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
    console.log('Sitemap berhasil diperbarui dengan aman!');
}

updateSitemap();
