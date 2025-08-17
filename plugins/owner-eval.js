import syntaxError from 'syntax-error';
import { format } from 'util';
import { config } from '../config.js';

export async function handler({ sock, m, msg, args }) {
    const code = args.join(' ');
    if (!code) return m.reply("Masukkan kode JavaScript yang ingin dieksekusi.");

    const conn = sock;
    let _return;
    let _syntax = '';

    const usedPrefix = m.text.slice(0, config.prefix.length + 1).replace(config.prefix, '');
    const _text = (usedPrefix.startsWith('>') ? 'return ' : '') + code;
    
    const print = (...text) => {
        return sock.sendMessage(m.chat, { text: format(...text) }, { quoted: msg });
    };

    try {
        let i = 15;
        let f = { exports: {} };

        const exec = new (async () => {}).constructor(
            'print', 'm', 'msg', 'handler', 'require', 'conn', 'CustomArray',
            'process', 'args', 'config', 'module', 'exports', 'argument', _text
        );

        _return = await exec.call(
            conn,
            (...args) => {
                if (--i < 1) return;
                console.log(...args);
                return print(...args);
            },
            m,
            msg,
            handler,
            require,
            conn,
            CustomArray,
            process,
            args,
            config,
            f,
            f.exports,
            [conn, { m, msg, args }]
        );

    } catch (e) {
        let err = syntaxError(_text, 'Execution Function', {
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true,
            sourceType: 'module'
        });
        if (err) _syntax = '```' + err + '```\n\n';
        _return = e;
    } finally {
        await sock.sendMessage(m.chat, { text: _syntax + format(_return) }, { quoted: msg });
    }
}

handler.command = ['>', '=>'];
handler.help = 'owner';
handler.owner = true;

class CustomArray extends Array {
  constructor(...args) {
    if (typeof args[0] == 'number') {
        super(Math.min(args[0], 10000));
    } else {
        super(...args);
    }
  }
                 }
