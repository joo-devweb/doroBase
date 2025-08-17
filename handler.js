import { readdir } from 'fs/promises';
import path from 'path';
import serialize from './lib/serialize.js';
import { config } from './config.js';
import { info, error as logError } from './lib/logger.js';

const plugins = new Map();
const pluginsDir = './plugins';

async function loadPlugins() {
    plugins.clear();
    try {
        const files = await readdir(pluginsDir);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const pluginPath = path.join(process.cwd(), pluginsDir, file);
                const module = await import(`file://${pluginPath}?v=${Date.now()}`);
                const plugin = module.handler;

                if (plugin && plugin.command) {
                    if (Array.isArray(plugin.command)) {
                        plugin.command.forEach(cmd => plugins.set(cmd, plugin));
                    } else {
                        plugins.set(plugin.command, plugin);
                    }
                }
            }
        }
    } catch (e) {
        logError("Failed to load plugins:", e);
    }
}

export async function reloadPlugins() {
    await loadPlugins();
    info('All plugins have been reloaded.');
}

export async function handler(m, sock) {
    if (plugins.size === 0) {
        await loadPlugins();
    }
    
    if (m.type !== 'notify') return;
    let msg = m.messages[0];
    if (!msg.message) return;

    let M = serialize(msg, sock);

    if (M.isGroup && config.bannedGroups.has(M.chat)) return;
    if (config.selfMode && !M.isOwner) return;

    if (!M.text || !M.text.startsWith(config.prefix)) return;

    const body = M.text.slice(config.prefix.length).trim();
    const args = body.split(/ +/).slice(1);
    const command = body.split(/ +/)[0].toLowerCase();
    
    const plugin = plugins.get(command);

    if (plugin) {
        if (plugin.owner && !M.isOwner) {
            return M.reply("🚫 Perintah ini hanya untuk Owner Bot!");
        }

        try {
            info(`[CMD] Executing '${command}' by ${M.sender.split('@')[0]}`);
            await plugin({ sock, m: M, msg, args, plugins }); 
        } catch (e) {
            logError(`Error executing command ${command}:`, e);
            M.reply(`Terjadi error pada command *${command}*:\n${e.message}`);
        }
    }
}
