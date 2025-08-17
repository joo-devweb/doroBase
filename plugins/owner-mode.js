import { config } from '../config.js';

export async function handler({ m, args }) {
    const mode = args[0]?.toLowerCase();
    if (mode === 'public') {
        config.selfMode = false;
        m.reply("Mode bot diubah ke PUBLIC.");
    } else if (mode === 'self') {
        config.selfMode = true;
        m.reply("Mode bot diubah ke SELF.");
    } else {
        m.reply(`Mode saat ini: *${config.selfMode ? 'SELF' : 'PUBLIC'}*\n\nGunakan: .mode public|self`);
    }
}
handler.command = 'mode';
handler.help = 'owner';
handler.owner = true;
