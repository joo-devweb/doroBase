import { config } from '../config.js';

export async function handler({ m }) {
    if (!m.isGroup) return m.reply("Perintah ini hanya bisa digunakan di dalam grup.");
    
    config.bannedGroups.add(m.chat);
    m.reply("Grup ini berhasil di-ban. Bot tidak akan merespon di sini.");
}
handler.command = 'bangroup';
handler.help = 'owner';
handler.owner = true;
