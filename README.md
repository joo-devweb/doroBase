<div align="center">
  <img src="https://files.catbox.moe/nky1c5.jpg" alt="Doro Art by Artist" width="250"/>
  <h1>Doro-Bot</h1>
  <p>Bot WhatsApp Base Modular: Cepat, Modular, dan Siap Dikembangkan.</p>
</div>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-v20.x%2B-%23339933?style=for-the-badge&logo=node.js">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ESM-yellow?style=for-the-badge&logo=javascript">
  <img alt="License" src="https://img.shields.io/github/license/joo-devweb/doroBase?style=for-the-badge&color=blue">
</p>


Selamat datang di Doro-Bot, sebuah kerangka kerja bot WhatsApp yang dirancang untuk developer. Proyek ini mengutamakan **kemudahan kustomisasi** dan **kinerja**, memungkinkan Anda membangun fitur-fitur impian Anda dengan cepat dan efisien.

---

## 🌟 **Mengapa Doro-Bot?**

| Fitur                 | Deskripsi                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **🔌 Plugin Modular**  | Setiap perintah adalah file mandiri. Tambahkan fungsionalitas baru tanpa menyentuh kode inti.                         |
| **🔥 Hot Reload**      | Tambah (`.sfp`), hapus (`.dfp`), dan perbarui (`.update`) plugin langsung dari chat. *No restart, no downtime.*      |
| **📱 Pairing Code**   | Metode login modern yang lebih aman dan nyaman, tanpa perlu scan QR.                                                 |
| **🎯 LID & JID Fixed** | Dibangun di atas Baileys fork yang telah menyelesaikan masalah grup LID, menjamin identifikasi pengguna yang akurat. |
| **🛠️ Dev Tools**       | Eksekusi kode (`=>`, `>`) dan perintah shell (`$`) langsung dari WhatsApp untuk debugging dan manajemen cepat.      |
| **⚙️ Mudah Dikonfigurasi** | Pengaturan terpusat yang simpel. Anda hanya perlu menyentuh satu file untuk memulai: `config.js`.               |

---

## 🚀 **Getting Started: Instalasi Cepat**

Hanya butuh beberapa menit untuk membuat Doro-Bot Anda online!

### **1. Clone & Masuk ke Proyek**

Buka terminal Anda dan jalankan perintah berikut.

```bash
git clone https://github.com/joo-devweb/doroBase.git
cd doroBase
```

### **2. Instalasi Dependensi**


```bash
npm install
```

### **3. Konfigurasi Owner** ⚠️

Ini adalah langkah **paling penting**.

1.  Buka file `config.js`.
2.  Edit `jid` dengan nomor WhatsApp Anda, gunakan format kode negara (contoh: `62...`).

```javascript
// config.js
export let config = {
    owner: [
        { jid: '6281234567890', name: 'Your Name' } // <== UBAH INI
    ],
    //...
};
```

### **4. Jalankan Bot!**

Semua sudah siap. Saatnya online.

```bash
npm start
```

<details>
  <summary><strong>Klik di sini jika ini pertama kali Anda login</strong></summary>
  
  1.  Bot akan meminta nomor WhatsApp Anda di terminal.
  2.  Masukkan nomor Anda (contoh: `62812...`) dan tekan Enter.
  3.  Sebuah **Pairing Code** akan muncul di terminal.
  4.  Buka WhatsApp di HP Anda, buka `Setelan > Perangkat Tertaut > Tautkan Perangkat > Tautkan dengan nomor telepon`.
  5.  Masukkan kode tersebut. Selesai! Sesi Anda akan tersimpan secara otomatis.
</details>

---

## 👨‍💻 **Panduan Developer: Membuat Plugin**

Menciptakan fitur baru adalah inti dari Doro-Bot.

### **Anatomi Sebuah Plugin**

Setiap file `.js` di dalam folder `plugins/` adalah sebuah plugin. Struktur dasarnya wajib mengikuti aturan berikut:

1.  Wajib mengekspor sebuah `async function` bernama `handler`.
2.  Fungsi `handler` tersebut harus memiliki properti metadata (`command`, `help`, `owner`).

**Template Wajib:**

```javascript
// plugins/nama-fitur.js

/**
 * @param {object} context
 * @param {import('@whiskeysockets/baileys').WASocket} context.sock - Objek koneksi utama Baileys.
 * @param {object} context.m - Objek pesan yang sudah disederhanakan (dari serialize.js).
 * @param {import('@whiskeysockets/baileys').proto.IWebMessageInfo} context.msg - Objek pesan asli dari Baileys.
 * @param {string[]} context.args - Argumen setelah perintah dalam bentuk array.
 * @param {string} context.text - Argumen setelah perintah dalam bentuk string utuh.
 */
export async function handler({ sock, m, msg, args, text }) {
    // Tulis logika keren Anda di sini!
    await m.reply(`Hello, ${m.pushName}!`);
}

// --- Metadata Wajib ---
// Perintah untuk memanggil plugin ini
handler.command = ['contoh', 'example'];
// Kategori untuk ditampilkan di menu
handler.help = 'main';
// Apakah plugin ini hanya untuk owner? (true/false)
handler.owner = false; 
```
**Misal**
```javascript
// plugins/hai.js

// Mengimpor variabel 'config' dari file konfigurasi utama.
// '..' berarti "naik satu level direktori" (dari /plugins ke /).
import { config } from '../config.js';

/**
 * Plugin ini merespon sapaan dari pengguna
 * dengan menyebut nama mereka dan nama bot.
 */
export async function handler({ m }) {
    const userName = m.pushName || 'Kak';
    
    // Kita gunakan 'config.botName' yang sudah diimpor
    await m.reply(`Halo juga, ${userName}! 👋\nSaya ${config.botName}, siap membantu.`);
}

// --- Metadata Plugin ---
handler.command = ['hai', 'halo'];
handler.help = 'main';
handler.owner = false;
```

```javascript
// plugins/ping.js

// Mengimpor fungsi 'info' dari file logger di folder 'lib'.
import { info } from '../lib/logger.js';

/**
 * Plugin ini menghitung dan menampilkan kecepatan respon bot (latency)
 * dan juga mencatatnya di konsol untuk debugging.
 */
export async function handler({ m, msg }) {
    const messageTimestamp = typeof msg.messageTimestamp === 'object' 
        ? msg.messageTimestamp.low 
        : msg.messageTimestamp;

    const startTime = messageTimestamp * 1000;
    const latency = Date.now() - startTime;
    
    // Gunakan fungsi 'info' yang sudah diimpor untuk mencatat di terminal
    info(`Ping command executed. Latency: ${latency}ms`);

    await m.reply(`PONG! 🏓\nKecepatan Respon: *${latency} ms*`);
}

// --- Metadata Plugin ---
handler.command = ['ping', 'speed'];
handler.help = 'tools';
handler.owner = false;
```
**Buat Yang udah Sepuh Mah pasti Paham** 
**😂**
<details>
  <summary><strong>Lihat detail lengkap parameter & metadata di sini</strong></summary>

  #### **Parameter Objek `handler`**
| Parameter | Tipe                                        | Deskripsi                                                |
| :-------- | :------------------------------------------ | :------------------------------------------------------- |
| `sock`    | `WASocket`                                  | Objek koneksi utama Baileys. Gunakan ini untuk `sendMessage`, dll. |
| `m`       | `object`                                    | Objek pesan yang sudah dinormalisasi dari `serialize.js`. |
| `msg`     | `proto.IWebMessageInfo`                     | Objek pesan mentah/asli dari Baileys.                  |
| `args`    | `string[]`                                  | Argumen perintah dalam bentuk array. (`.say hai apa` -> `['hai', 'apa']`) |
| `text`    | `string`                                    | Argumen perintah dalam bentuk string utuh. (`.say hai apa` -> `'hai apa'`) |

#### **Properti Metadata `handler`**
| Properti | Tipe          | Deskripsi                                                         |
| :------- | :------------ | :---------------------------------------------------------------- |
| `command`  | `string[]`    | Array berisi semua nama perintah dan aliasnya untuk memicu plugin. |
| `help`     | `string`      | Nama kategori untuk pengelompokan di dalam menu.                  |
| `owner`    | `boolean`     | `true` jika perintah ini hanya bisa diakses oleh Owner bot.       |
</details>

---

## 🤝 **Berkontribusi**

Proyek ini hidup karena komunitas. Jika Anda menemukan bug, punya ide fitur, atau ingin menyempurnakan kode, jangan ragu untuk membuka **Issue** atau **Pull Request**.

## 🙏 **Ucapan Terima Kasih**

Keberadaan Doro-Bot tidak akan mungkin tanpa kerja keras dari para pengembang di balik proyek-proyek fundamental ini:

-   **[@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys):** Pustaka inti yang menjadi jembatan ke dunia WhatsApp.
-   **[@yupra/baileys](https://www.npmjs.com/package/@yupra/baileys):** Fork brilian yang menyelesaikan masalah LID/JID secara elegan.
-   Dan **Anda**, yang telah menggunakan dan berpotensi berkontribusi pada proyek ini.

---

<p align="center">
  Dibuat dengan ❤️ dan kode.
</p>
