import fs from 'node:fs';
import path from 'node:path';

const DOMAIN = 'https://tunggalpaito.online'; 
const PUBLIC_DIR = './'; 

const getHtmlFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['.git', 'node_modules', '.github'].includes(file)) {
                getHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
};

const htmlFiles = getHtmlFiles(PUBLIC_DIR);
const urls = htmlFiles.map(file => {
    let route = file.replaceAll('\\', '/').replace(/^\.\//, '');
    if (route === 'index.html') {
        route = '';
    } else {
        route = route.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    }
    return `${DOMAIN}/${route}`;
});

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('Sitemap.xml berhasil di-generate!');
