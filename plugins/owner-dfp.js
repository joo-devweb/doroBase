import { unlink, access } from 'fs/promises';
import path from 'path';
import { reloadPlugins } from '../handler.js';
import { format } from 'util';

export async function handler({ m, args }) {
    if (!args[0]) return m.reply("Penggunaan: .dfp <namafile.js>");

    let filename = args[0];
    if (!filename.endsWith('.js')) filename += '.js';

    if (filename.includes('/') || filename.includes('\\')) {
        return m.reply("Nama file tidak valid.");
    }

    const filepath = path.join('./plugins', filename);

    try {
        // Cek dulu apakah file benar-benar ada
        await access(filepath);
        
        await unlink(filepath);
        await m.reply(`Plugin *${filename}* berhasil dihapus.`);
        
        // Reload plugin untuk menghapus command yang sudah tidak ada
        await reloadPlugins();
    } catch (e) {
        if (e.code === 'ENOENT') {
            // Error 'ENOENT' berarti file tidak ditemukan
            return m.reply(`Plugin *${filename}* tidak ditemukan.`);
        }
        console.error("Error deleting plugin:", e);
        await m.reply(`Gagal menghapus plugin:\n${format(e)}`);
    }
}

handler.command = ['dfp', 'deleteplugin'];
handler.help = 'owner';
handler.owner = true;
