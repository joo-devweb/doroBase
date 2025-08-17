import { createCanvas, loadImage } from 'canvas';
import { config } from '../config.js';

export async function handler({ sock, m, msg }) {
    const ownerInfo = config.owner[0];
    if (!ownerInfo) return m.reply("Data owner belum diatur di config.js");
    
    const ownerJid = `${ownerInfo.jid}@s.whatsapp.net`;
    const ownerName = ownerInfo.name || "Owner";

    try {
        const canvas = createCanvas(800, 300);
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 800, 300);
        gradient.addColorStop(0, '#0093E9');
        gradient.addColorStop(1, '#80D0C7');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 300);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(50, 50, 700, 200);

        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(ownerJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/vzBzk7z/default-pp.jpg';
        }
        
        const avatar = await loadImage(ppUrl);
        ctx.save();
        ctx.beginPath();
        ctx.arc(150, 150, 70, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 80, 80, 140, 140);
        ctx.restore();
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 35px sans-serif';
        ctx.fillText(ownerName, 260, 130);

        ctx.font = '25px sans-serif';
        ctx.fillStyle = '#555';
        ctx.fillText(`Developer of ${config.botName}`, 260, 170);
        
        ctx.font = 'italic 20px sans-serif';
        ctx.fillStyle = '#888';
        ctx.fillText(ownerJid.split('@')[0], 260, 205);

        const buffer = canvas.toBuffer('image/png');
        await sock.sendMessage(m.chat, { 
            image: buffer,
            caption: `Berikut adalah info tentang Owner Bot!`
        }, { quoted: msg });
    } catch (e) {
        console.error("Error creating owner card:", e);
        m.reply("Gagal membuat kartu info owner.");
    }
}
handler.command = ['owner', 'infoowner'];
handler.help = 'main';
handler.owner = false;
