const fs = require('fs');
const readline = require('readline');
const csv = require('csv-parser');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Fungsi delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Buat interface IO yes/no
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Inisialisasi client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', async () => {
    console.log('Client is ready! Waiting a moment...');

    // await new Promise(r => setTimeout(r, 2000)); // delay 2 detik

    // const chats = await client.getChats(); 
    // console.log(`Total chats: ${chats.length}`);

    const contacts = [];
    
    // Baca data dari CSV
    fs.createReadStream('contacts.csv')
        .pipe(csv())
        .on('data', (row) => {
            contacts.push(row);
        })
        .on('end', async () => {
            console.log(`\n📇 Ditemukan ${contacts.length} kontak:`);

            // Tampilkan daftar kontak
            contacts.forEach((c, i) => {
                console.log(`${i + 1}. ${c.name} - ${c.number}`);
            });

            console.log("\n📝 Pastikan daftar kontak sudah benar.");

            rl.question("👉 Mulai broadcast sekarang? (y/n): ", async (answer) => {
                if (answer.toLowerCase() !== "y") {
                    console.log("❌ Broadcast dibatalkan.");
                    rl.close();
                    return;
                }

                console.log("\n🚀 Broadcast dimulai...\n");

                // Baca caption.txt
                let captionText = "";
                try {
                    captionText = fs.readFileSync("caption.txt", "utf-8");
                    console.log("📝 Caption berhasil dibaca.\n");
                } catch (err) {
                    console.error("❌ Gagal membaca caption.txt:", err.message);
                    rl.close();
                    return;
                }

                // Ambil foto
                const media = MessageMedia.fromFilePath('./media/JSM.jpg');

                // Loop kontak
                for (let i = 0; i < contacts.length; i++) {
                    const contact = contacts[i];
                    const name = contact.name ? contact.name.trim() : "Kak";
                    const number = contact.number ? contact.number.trim() + "@c.us" : null;

                    if (!number) continue;

                    const finalCaption = captionText.replace("{name}", name);

                    try {
                        await client.sendMessage(number, media, { caption: finalCaption });
                        console.log(`✅ Terkirim ke ${name} (${number})`);
                    } catch (err) {
                        console.log(`❌ Gagal ke ${number}: ${err.message}`);
                    }

                    // Delay random
                    const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;
                    console.log(`⏳ Delay ${Math.floor(randomDelay / 1000)} detik...\n`);
                    await delay(randomDelay);
                }

                console.log("🎉 Semua pesan selesai dikirim!");
                rl.close();
            });
            
            // Ambil file gambar
           // const media = MessageMedia.fromFilePath('./Media/JSM.jpg');



            // // =============================
            // // 📌 BACA CAPTION DARI FILE TXT
            // // =============================
            // let captionText = "";
            // try {
            //     captionText = fs.readFileSync("caption.txt", "utf-8");
            //     console.log("📝 Caption berhasil dibaca dari caption.txt");
            // } catch (err) {
            //     console.error("❌ Gagal membaca caption.txt:", err.message);
            //     return;
            // }

            // // =============================
            // // 📌 MULAI BROADCAST
            // // =============================
            // for (let i = 0; i < contacts.length; i++) {
            //     const contact = contacts[i];
            //     const name = contact.name ? contact.name.trim() : "Kak";
            //     const number = contact.number ? contact.number.trim() + "@c.us" : null;

            //     if (!number) {
            //         console.log(`⚠️ Baris tanpa nomor dilewati:`, contact);
            //         continue;
            //     }

            //     // Personalize caption
            //     const finalCaption = captionText.replace("{name}", name);

            //     try {
            //         await client.sendMessage(number, media, { caption: finalCaption });
            //         console.log(`✅ Pesan terkirim ke ${name} (${number})`);
            //     } catch (err) {
            //         console.log(`❌ Gagal kirim ke ${number}: ${err.message}`);
            //     }
            
            // // // Kirim pesan satu per satu
            // // for (let i = 0; i < contacts.length; i++) {
            // //     const contact = contacts[i];
            // //     const name = contact.name ? contact.name.trim() : "Kak";
            // //     const number = contact.number ? contact.number.trim() + "@c.us" : null;

            // //     if (!number) {
            // //         console.log(`⚠️ Baris tanpa nomor dilewati:`, contact);
            // //         continue;
            // //     }

            // //     // Teks pesan
            // //     const caption = `*New‼️Affordable House di dekat BSD* \n🎗️Tanpa DP \n🎗️2 jutaan / bulan \n🏅Free Biaya-biaya \n🏅5 Menit ke Stasiun \n🏅15 Menit ke BSD \n🏅15 menit New Akses tol legok (2024) \n*Limited Promo Until Desember 2023* \nMarketing Galery / Show Unit : \n☎️ 0813-8082-4624 (Daffa) \n(Whatsapp available)`;

            // //     //const caption = `Halo ${name} 👋\n\nKami punya promo spesial minggu ini! 🛍️\n\nLihat detailnya pada gambar berikut 👇 n\nHiraukan aja ya gais lagi testing`;

            // //     try {
            // //         await client.sendMessage(number, media, { caption });
            // //         console.log(`✅ Pesan dengan foto terkirim ke ${name} (${number})`);
            // //     } catch (err) {
            // //         console.log(`❌ Gagal kirim ke ${number}: ${err.message}`);
            // //     }

            //     // Delay acak 30–60 detik
            //     const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;
            //     console.log(`⏳ Menunggu ${randomDelay / 1000} detik...`);
            //     await delay(randomDelay);
            // }

            // console.log("🎉 Semua pesan broadcast selesai dikirim!");
        });
});

client.initialize();
