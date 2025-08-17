import { config } from '../config.js';

function isOwner(sender) {
    if (!sender) return false;
    // Membersihkan JID dari ID perangkat (cth: :12) dan server
    const senderNumber = sender.split('@')[0].split(':')[0];
    return config.owner.some(user => user.jid === senderNumber);
}

export default function serialize(m, sock) {
    if (!m) return m;

    let M = {};
    if (m.key) {
        M.id = m.key.id;
        M.isBaileys = M.id.startsWith('BAE5') && M.id.length === 16;
        M.chat = m.key.remoteJid;
        M.fromMe = m.key.fromMe;
        M.isGroup = M.chat.endsWith('@g.us');
        M.pushName = m.pushName || '';

        
        let participant;
        if (M.isGroup) {
            participant = m.key.participant;
        } else {
            participant = m.key.remoteJid;
        }
        
        M.sender = M.fromMe ? sock.user.id : participant;
        
    }

    if (m.message) {
        M.message = m.message;
        M.msg = m.message;
        M.mtype = Object.keys(M.msg)[0];
        M.text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption;

        M.reply = (text, chatId = M.chat, options = {}) => {
            return sock.sendMessage(chatId, { text: text }, { ...options, quoted: m });
        };
    }
    
    M.isOwner = isOwner(M.sender);

    return M;
    }
