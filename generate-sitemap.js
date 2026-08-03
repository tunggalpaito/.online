const fs = require('fs');
const path = require('path');

// ==========================================
// 1. PUSAT KONFIGURASI SISTEM (CENTRALIZED CONFIG)
// ==========================================
const SITEMAP_CONFIG = {
    baseUrl: 'https://angkastatistik.my.id',
    outputFileName: 'sitemap.xml',
    
    // Daftar folder dan file yang wajib diblokir agar tidak masuk ke sitemap Google
    excludedItems: new Set([
        '.git', '.github', 'node_modules', 'cgi-bin', 'result', 
        '.nojekyll', 'generate-sitemap.js', 'package.json', 'package-lock.json'
    ]),

    // Aturan Penentu Bobot SEO Google secara Dinamis berdasarkan struktur URL
    routingRules: [
        { pattern: (p) => p === '', priority: '1.00' },             // Homepage utama website
        { pattern: (p) => p.startsWith('prediksi/'), priority: '0.85' }, // Bocoran angka tarung harian
        { pattern: (p) => p.startsWith('result-'), priority: '0.80' },   // Arsip keluaran paito angka
        { pattern: (p) => p.startsWith('analisa-'), priority: '0.80' },  // Analisis matematika toto
        { pattern: (p) => p.startsWith('shio-') || p === 'shio/', priority: '0.70' }, // Tabel data shio
        { pattern: (p) => p.startsWith('404/') || p.startsWith('privacy-'), priority: '0.50' } // Halaman utilitas
    ],

    defaultPriority: '0.80' // Prioritas otomatis untuk halaman umum lainnya
};

// ==========================================
// 2. LOGIKA PEMINDAIAN FILE (MODULAR SCANNER)
// ==========================================
function getAllHtmlFiles(directory, aggregatedFiles = []) {
    const directoryItems = fs.readdirSync(directory);

    for (const item of directoryItems) {
        // Proteksi Sistem: Lewati file/folder yang masuk daftar blokir konfigurasi
        if (SITEMAP_CONFIG.excludedItems.has(item) || item.startsWith('.')) {
            continue;
        }

        const fullPath = path.join(directory, item);
        const itemStat = fs.statSync(fullPath);

        if (itemStat.isDirectory()) {
            getAllHtmlFiles(fullPath, aggregatedFiles);
        } else if (item.endsWith('.html')) {
            // Standarisasi pemisah jalur folder menggunakan format Linux (/)
            const standardizedPath = path.relative(__dirname, fullPath).replace(/\\/g, '/');
            aggregatedFiles.push(standardizedPath);
        }
    }

    return aggregatedFiles;
}

// ==========================================
// 3. LOGIKA NORMALISASI URL (SEO URL FILTER)
// ==========================================
function cleanAndNormalizeUrl(rawRelativePath) {
    // Langkah 1: Buang ekstensi file .html secara menyeluruh
    let urlPath = rawRelativePath.replace('.html', '');

    // Langkah 2: Logika pintar membersihkan file "index" di root maupun sub-folder
    if (urlPath === 'index') {
        urlPath = '';
    } else if (urlPath.endsWith('/index')) {
        urlPath = urlPath.substring(0, urlPath.length - 6);
    }

    // Langkah 3: Tambahkan trailing slash (/) di akhir URL untuk standardisasi pakem Google
    if (urlPath !== '' && !urlPath.endsWith('/')) {
        urlPath += '/';
    }

    return urlPath;
}

// ==========================================
// 4. LOGIKA EVALUASI PRIORITAS (SEO ROUTING ENGINE)
// ==========================================
function calculateSeoPriority(cleanUrlPath) {
    // Mencari aturan pola yang cocok di dalam konfigurasi routingRules secara berurutan
    const matchedRule = SITEMAP_CONFIG.routingRules.find(rule => rule.pattern(cleanUrlPath));
    
    return matchedRule ? matchedRule.priority : SITEMAP_CONFIG.defaultPriority;
}

// ==========================================
// 5. CORE EXECUTION ENGINE (MAIN JOB)
// ==========================================
function runSitemapGenerator() {
    try {
        console.log('🤖 Robot v24 Premium: Memulai pemindaian dengan logika & konfigurasi ter-refactor...');
        
        const rawHtmlFiles = getAllHtmlFiles(__dirname);
        const uniqueUrlsMap = new Map(); // Menggunakan Map untuk mengunci keunikan URL & Priority

        // Proses data mentah menjadi koleksi URL SEO Bersih
        rawHtmlFiles.forEach(file => {
            const normalizedPath = cleanAndNormalizeUrl(file);
            const absoluteTargetUrl = `${SITEMAP_CONFIG.baseUrl}/${normalizedPath}`;
            const targetPriority = calculateSeoPriority(normalizedPath);

            // Jika ada duplikasi file, Map otomatis akan menindihnya sehingga sitemap tetap 100% unik
            uniqueUrlsMap.set(absoluteTargetUrl, targetPriority);
        });

        // Konstruksi Struktur Data XML Resmi Google
        let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlOutput += '<urlset xmlns="http://sitemaps.org">\n';

        for (const [url, priority] of uniqueUrlsMap.entries()) {
            xmlOutput += '  <url>\n';
            xmlOutput += `    <loc>${url}</loc>\n`;
            xmlOutput += `    <priority>${priority}</priority>\n`;
            xmlOutput += '  </url>\n';
        }

        xmlOutput += '</urlset>';

        // Tulis keluaran akhir ke sitemap.xml di folder utama
        const outputDestination = path.join(__dirname, SITEMAP_CONFIG.outputFileName);
        fs.writeFileSync(outputDestination, xmlOutput);
        
        console.log(`✅ Refactor Sukses Sempurna! Total ${uniqueUrlsMap.size} URL telah ditata dengan manajemen konfigurasi modern.`);

    } catch (systemError) {
        console.error('❌ Eror Fatal pada Sistem Logika Robot:', systemError.message);
        process.exit(1);
    }
}

// Jalankan sistem otomatis
runSitemapGenerator();
