import { readFileSync } from 'fs';
import { config } from '../config.js';

export async function handler({ sock, m, msg, plugins }) {
    const thumbnailPath = './assets/thumbnail.jpg';
    
    const categories = {};
    const processedCommands = new Set();

    plugins.forEach((plugin, command) => {
        if (processedCommands.has(plugin)) return;
        
        const category = plugin.help || 'lainnya';
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(Array.isArray(plugin.command) ? plugin.command[0] : plugin.command);
        processedCommands.add(plugin);
    });
    
    let menuText = `Hi, *${m.pushName || 'User'}* 👋\nI am *${config.botName}*, your personal assistant.\n\n`;
    menuText += `*Prefix*: ${config.prefix}\n`;
    menuText += `*Mode*: ${config.selfMode ? 'Self' : 'Public'}\n\n`;
    
    const sortedCategories = Object.keys(categories).sort();

    for (const category of sortedCategories) {
        menuText += `┌─「 *${category.toUpperCase()}* 」\n`;
        menuText += `│⎚ ${categories[category].map(cmd => `${config.prefix}${cmd}`).join('\n│⎚ ')}\n`;
        menuText += `└────\n\n`;
    }

    menuText += `© ${config.botName} - ${new Date().getFullYear()}`;

    try {
        await sock.sendMessage(m.chat, {
            image: readFileSync(thumbnailPath),
            caption: menuText,
            mimetype: 'image/jpeg'
        }, { quoted: msg });
    } catch (e) {
        console.error("Error sending menu:", e);
        m.reply("Gagal menampilkan menu. Pastikan `assets/thumbnail.jpg` tersedia.");
    }
}
handler.command = ['menu', 'help', '?'];
handler.help = 'main';
handler.owner = false;
