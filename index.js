import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import PinoPretty from 'pino-pretty';
import readline from 'readline/promises';
import { handler } from './handler.js';
import * as logger from './lib/logger.js';
import { sleep } from './lib/myFunction.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => rl.question(text);

const pinoStream = PinoPretty({ colorize: true, ignore: 'pid,hostname', translateTime: 'SYS:standard' });
const pinoLogger = pino({ level: 'silent' }, pinoStream);

logger.custom(`
      _                          
     | |                         
   __| | ___   __ _  _ __  _   _ 
  / _\` |/ _ \\ / _\` || '__|| | | |
 | (_| |  __/| (_| || |   | |_| |
  \\__,_|\\___| \\__,_||_|    \\__, |
                           __/ |
                          |___/ 
            WhatsApp Bot
`, 'cyan');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('doroSessions');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    logger.info(`Using Baileys version ${version}, isLatest: ${isLatest}`);
    
    const sock = makeWASocket({
        version,
        logger: pinoLogger,
        printQRInTerminal: false,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        pairingCode: true
    });

    if (!sock.authState.creds.registered) {
        try {
            const phoneNumber = await question(logger.custom('Please enter your full WhatsApp number (e.g., 6281234567890): ', 'yellow'));
            logger.info('Requesting pairing code, please wait 3 seconds...');
            await sleep(3000);
            const code = await sock.requestPairingCode(phoneNumber);
            logger.success(`Your Pairing Code: ${code}`);
        } catch (e) {
             logger.error('Failed to request pairing code. Please restart.');
             process.exit(1);
        }
    }
    
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.error(`Connection closed due to: ${lastDisconnect.error}, reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            logger.success('Connection opened successfully!');
        }
    });
    
    sock.ev.on('messages.upsert', (m) => {
        handler(m, sock);
    });
}

connectToWhatsApp();
