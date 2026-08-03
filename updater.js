const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// TARGET JALUR FILE: result/macau.js
const FILE_PATH = path.join(__dirname, 'result', 'macau.js');
const URL_TARGET = 'https://online-marketplaces.hawaiifarmersmarkets.org/';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function jalankanBot(attempt = 1) {
    console.log(`[Percobaan ${attempt}/4] Membuka web target...`);
    let browser;
    
    try {
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        await page.goto(URL_TARGET, { waitUntil: 'networkidle2', timeout: 60000 });

        const dataTabel = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table tr'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                return cells.map(cell => cell.innerText.trim());
            });
        });

        await browser.close();

        if (!dataTabel || dataTabel.length < 2) {
            throw new Error("Gagal membaca data tabel dari website target.");
        }

        // Ambil baris data paling atas (terbaru) di website sumber
        let barisTerbaruWeb = dataTabel.find(row => row.length > 1 && row !== "");
        if (!barisTerbaruWeb) barisTerbaruWeb = dataTabel;

        // Menyaring data kotak: ambil hanya kolom yang berisi angka 4 digit yang sah
        let kolomAngkaValid = barisTerbaruWeb.slice(1).filter(text => text !== "" && !isNaN(text) && text.length === 4);
        
        if (kolomAngkaValid.length === 0) {
            throw new Error("Belum ada angka result resmi yang keluar di website target.");
        }

        // Ambil angka paling kanan (terbaru) yang muncul di website sumber
        let angkaTerbaru = kolomAngkaValid[kolomAngkaValid.length - 1];
        console.log(`[LOG] Angka terbaru dari web sumber didapat: "${angkaTerbaru}"`);

        if (!angkaTerbaru || angkaTerbaru.length !== 4 || isNaN(angkaTerbaru)) {
            throw new Error("Format angka hasil belum valid.");
        }

        // Jalankan perintah tembak langsung tanpa syarat tanggal
        perbaruiFile(angkaTerbaru);

    } catch (error) {
        console.error(`Gagal pada percobaan ke-${attempt}: ${error.message}`);
        if (browser) await browser.close();

        if (attempt < 4) {
            console.log('Menunggu 5 menit sebelum coba ulang...');
            await delay(5 * 60 * 1000); 
            return await jalankanBot(attempt + 1);
        } else {
            console.error('Sudah dicoba 4 kali berturut-turut. Hasil tetap nihil.');
            process.exit(1);
        }
    }
}

function perbaruiFile(angkaBaru) {
    if (!fs.existsSync(FILE_PATH)) {
        console.error(`Error fatal: File result/macau.js tidak ditemukan!`);
        process.exit(1);
    }

    let konten = fs.readFileSync(FILE_PATH, 'utf8');

    // PERINTAH 1: Update LIVE_RESULT_MACAU di paling atas file
    const regexLive = /const LIVE_RESULT_MACAU = \{ latestResult: ".*?" \};/;
    konten = konten.replace(regexLive, `const LIVE_RESULT_MACAU = { latestResult: "${angkaBaru}" };`);

    // PERINTAH 2: Cari baris terakhir sebelum tanda backtick penutup (`;)
    let kontenBersih = konten.trim();
    
    // Robot langsung menyisipkan angka baru tepat di belakang koma terakhir sebelum backtick penutup
    kontenBersih = kontenBersih.replace(/,\s*`;\s*$/, `,${angkaBaru},\n\`;`);

    fs.writeFileSync(FILE_PATH, kontenBersih, 'utf8');
    console.log(`[SUKSES 100%] Angka ${angkaBaru} sukses ditempelkan langsung ke paito Anda!`);
}

jalankanBot();

