const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://tunggalpaito.online';

// --- FUNGSI REKURSIF MENARIK DAFTAR FILE HTML & MD ---
function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Lewatkan direktori atau file sistem yang tidak perlu dimasukkan ke sitemap
        if (
            filePath.includes('node_modules') || 
            filePath.includes('.git') || 
            filePath.includes('.github') || 
            filePath.includes('data') || 
            filePath.includes('admin') || 
            file.startsWith('.') ||
            file === 'sitemap.xml' || 
            file === 'robots.txt' ||
            file === '404.html' ||
        ) return;

        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.md')) {
            fileList.push({
                path: filePath,
                mtime: stat.mtime // Mengambil tanggal modifikasi file asli
            });
        }
    });
    
    return fileList;
}

// --- UPDATE SITEMAP & ROBOTS.TXT ---
function updateSitemap() {
    const files = getFiles('.');
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    files.forEach(fileObj => {
        let cleanPath = fileObj.path
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/\/index\.html$/, '')
            .replace(/\.html$/, '')
            .replace(/\.md$/, '');

        if (cleanPath === 'index' || cleanPath === '') cleanPath = '';

        const url = `${DOMAIN}/${cleanPath}`;
        // Format tanggal update otomatis (YYYY-MM-DD)
        const lastMod = fileObj.mtime.toISOString().split('T')[0];

        sitemap += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>\n`;
    });

    sitemap += `</urlset>`;
    
    fs.writeFileSync('sitemap.xml', sitemap);
    fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
    console.log('Sitemap dan Robots.txt berhasil diperbarui secara otomatis dengan tanggal terbaru!');
}

updateSitemap();
