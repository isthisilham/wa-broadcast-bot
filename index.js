/*
// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inisialisasi client
const client = new Client({
    authStrategy: new LocalAuth(), // biar gak perlu scan ulang tiap restart
});

// Tampilkan QR code saat pertama kali login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Saat sudah login sukses
client.on('ready', async () => {
    console.log('✅ Bot sudah terhubung ke WhatsApp!');

    // Ambil semua chat yang ada
    const chats = await client.getChats();

    // Filter hanya chat pribadi (bukan grup)
    const privateChats = chats.filter(chat => chat.isGroup === false);

    console.log(`📱 Ditemukan ${privateChats.length} chat pribadi.`);
    
    // Simpan daftar nomor ke file leads.json
    const fs = require('fs');
    const leads = privateChats.map(chat => ({
        name: chat.name || 'Tanpa Nama',
        id: chat.id._serialized,
    }));

    fs.writeFileSync('leads.json', JSON.stringify(leads, null, 2));
    console.log('💾 Data kontak tersimpan di leads.json');
});
// Jalankan client
client.initialize();
*/
const fs = require('fs');
const csv = require('csv-parser');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Fungsi delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Inisialisasi client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', async () => {
    console.log('✅ Bot sudah terhubung ke WhatsApp!');

    const contacts = [];
    
    // Baca data dari CSV
    fs.createReadStream('contacts.csv')
        .pipe(csv())
        .on('data', (row) => {
            contacts.push(row);
        })
        .on('end', async () => {
            console.log(`📇 Ditemukan ${contacts.length} kontak di contacts.csv`);
            
            // Ambil file gambar
            const media = MessageMedia.fromFilePath('./media/JSM.jpg');
            
            // Kirim pesan satu per satu
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const name = contact.name ? contact.name.trim() : "Kak";
                const number = contact.number ? contact.number.trim() + "@c.us" : null;

                if (!number) {
                    console.log(`⚠️ Baris tanpa nomor dilewati:`, contact);
                    continue;
                }

                // Teks pesan
                const caption = `*New‼️Affordable House di dekat BSD* \n🎗️Tanpa DP \n🎗️2 jutaan / bulan \n🏅Free Biaya-biaya \n🏅5 Menit ke Stasiun \n🏅15 Menit ke BSD \n🏅15 menit New Akses tol legok (2024) \n*Limited Promo Until Desember 2023* \nMarketing Galery / Show Unit : \n☎️ 0813-8082-4624 (Daffa) \n(Whatsapp available)`;

                //const caption = `Halo ${name} 👋\n\nKami punya promo spesial minggu ini! 🛍️\n\nLihat detailnya pada gambar berikut 👇 n\nHiraukan aja ya gais lagi testing`;

                try {
                    await client.sendMessage(number, media, { caption });
                    console.log(`✅ Pesan dengan foto terkirim ke ${name} (${number})`);
                } catch (err) {
                    console.log(`❌ Gagal kirim ke ${number}: ${err.message}`);
                }

                // Delay acak 30–60 detik
                const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;
                console.log(`⏳ Menunggu ${randomDelay / 1000} detik...`);
                await delay(randomDelay);
            }

            console.log("🎉 Semua pesan broadcast selesai dikirim!");
        });
});

client.initialize();
