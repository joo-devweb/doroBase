import { reloadPlugins } from '../handler.js';

export async function handler({ m }) {
    try {
        await reloadPlugins();
        m.reply("✅ Semua plugin berhasil di-reload!");
    } catch(e) {
        m.reply(`Gagal me-reload plugin: ${e.message}`);
    }
}
handler.command = ['update', 'reload'];
handler.help = 'owner';
handler.owner = true;
