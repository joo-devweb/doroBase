import { writeFile } from 'fs/promises';
import path from 'path';
import { reloadPlugins } from '../handler.js';
import { format } from 'util';

export async function handler({ m, text, args }) {
    if (!args[0]) return m.reply("Penggunaan: .sfp <namafile.js> <code>");

    let filename = args[0];
    if (!filename.endsWith('.js')) filename += '.js';

    if (filename.includes('/') || filename.includes('\\')) {
        return m.reply("Nama file tidak valid.");
    }

    let code = args.slice(1).join(' ');

    if (!code) {
        // Cek apakah user membalas sebuah pesan
        if (m.quoted && m.quoted.text) {
            code = m.quoted.text;
        } else {
            return m.reply("Tidak ada kode yang diberikan. Kirim kode atau balas pesan berisi kode.");
        }
    }

    const filepath = path.join('./plugins', filename);

    try {
        await writeFile(filepath, code);
        await m.reply(`Plugin *${filename}* berhasil disimpan.`);
        
        // Reload semua plugin agar yang baru bisa langsung digunakan
        await reloadPlugins();
    } catch (e) {
        console.error("Error saving plugin:", e);
        await m.reply(`Gagal menyimpan plugin:\n${format(e)}`);
    }
}

handler.command = ['sfp', 'saveplugin'];
handler.help = 'owner';
handler.owner = true;
