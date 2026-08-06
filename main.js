
// Eksekusi utama
generateSitemapAndRobots();
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://tunggalpaito.online';

// Fungsi ringan perbaikan HTML
function fixHtmlStructure(filePath) {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('<meta name="viewport"')) {
        content = content.replace('<head>', '<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
    content = content.replace(/\r\n/g, '\n');
    
    if (!content.includes('</html>') && content.includes('</body>')) {
        content = content + '\n</html>';
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// Pemindai file cepat
function processFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        if (
            filePath.includes('node_modules') || 
            filePath.includes('.git') || 
            filePath.includes('.github') || 
            filePath.includes('_site') ||
            file === '.DS_Store' ||
            file === 'Thumbs.db'
        ) {
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            processFiles(filePath, fileList);
        } else {
            fixHtmlStructure(filePath);
            if (file.endswith('.html') || file.endswith('.md')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// Pembuat Sitemap kilat
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
    fs.writeFileSync('sitemap.xml', sitemapContent);
    fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
    console.log('Sitemap & Robots diperbarui dengan cepat!');
}

generateSitemap();
