import { config } from '../config.js';

export async function handler({ m, args }) {
    if (!args[0]) return m.reply(`Prefix saat ini: *${config.prefix}*\n\nGunakan: .setprefix [char]`);

    config.prefix = args[0];
    m.reply(`Prefix berhasil diubah menjadi: *${config.prefix}*`);
}
handler.command = 'setprefix';
handler.help = 'owner';
handler.owner = true;
