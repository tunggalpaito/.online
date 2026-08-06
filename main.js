const fs = require('fs');
const path = require('path');

// DOMAIN UTAMA ANDA
const DOMAIN = 'https://tunggalpaito.online';

// --- ROBOT 1: PERBAIKAN FORMAT HTML (Atas, Tengah, Bawah) ---
function fixHtmlStructure(filePath) {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Robot Perbaikan Bagian ATAS (<head>): Memastikan ada charset & viewport standar SEO
    if (!content.includes('<meta name="viewport"')) {
        content = content.replace('<head>', '<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }

    // 2. Robot Perbaikan Bagian TENGAH (Konten/Body): Menyelaraskan format baris
    content = content.replace(/\r\n/g, '\n');

    // 3. Robot Perbaikan Bagian BAWAH (Sebelum penutup </body>): Memastikan tag penutup aman
    if (!content.includes('</html>') && content.includes('</body>')) {
        content = content + '\n</html>';
    }

    // Simpan kembali file HTML yang sudah diperbaiki
    fs.writeFileSync(filePath, content, 'utf8');
}

// --- FUNGSI PEMINDAI FILE OTOMATIS ---
function processFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Abaikan folder & file sistem yang tidak perlu masuk sitemap
        if (
            filePath.includes('node_modules') || 
            filePath.includes('.git') || 
            filePath.includes('.github') || 
            filePath.includes('_site') ||
            file === '.DS_Store' ||
            file === 'Thumbs.db' ||
            file === '404.html' // Contoh:abaikan halaman 404 agar tidak masuk sitemap
        ) {
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            processFiles(filePath, fileList);
        } else {
            // Jalankan Robot Perbaikan HTML
            fixHtmlStructure(filePath);

            // Ambil file .html atau .md untuk sitemap
            if (file.endsWith('.html') || file.endsWith('.md')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

// --- ROBOT PEMBUAT SITEMAP & ROBOTS.TXT ---
function generateSitemapAndRobots() {
    const files = processFiles('.');
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    files.forEach(filePath => {
        let cleanPath = filePath
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/\/index\.html$/, '')
            .replace(/\.html$/, '')
            .replace(/\.md$/, '');

        if (cleanPath === 'index' || cleanPath === '') {
            cleanPath = '';
        }

        const url = `${DOMAIN}/${cleanPath}`;
        
        // Mengambil tanggal asli perubahan file (Last Modified)
        const stats = fs.statSync(filePath);
        const lastMod = stats.mtime.toISOString().split('T')[0];

        sitemapContent += `  <url>\n`;
        sitemapContent += `    <loc>${url}</loc>\n`;
        sitemapContent += `    <lastmod>${lastMod}</lastmod>\n`;
        sitemapContent += `  </url>\n`;
    });

    sitemapContent += `</urlset>`;

    // Simpan sitemap.xml
    fs.writeFileSync('sitemap.xml', sitemapContent);
    console.log('Sitemap.xml berhasil diperbarui!');

    // Otomatis buat robots.txt
    const robotsContent = `User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`;
    fs.writeFileSync('robots.txt', robotsContent);
    console.log('Robots.txt berhasil diperbarui!');
}

// Eksekusi utama
generateSitemapAndRobots();
