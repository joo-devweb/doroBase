import { config } from '../config.js';

export async function handler({ m }) {
    if (!m.isGroup) return m.reply("Perintah ini hanya bisa digunakan di dalam grup.");
    
    if (config.bannedGroups.has(m.chat)) {
        config.bannedGroups.delete(m.chat);
        m.reply("Grup ini berhasil di-unban.");
    } else {
        m.reply("Grup ini tidak dalam daftar ban.");
    }
}
handler.command = ['delbangroup', 'unbangroup'];
handler.help = 'owner';
handler.owner = true;
