import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function handler({ m, args }) {
    const command = args.join(' ');
    if (!command) return m.reply("Masukkan perintah shell.");

    try {
        const { stdout, stderr } = await execPromise(command);
        let output = (stdout ? `STDOUT:\n${stdout}\n` : '') + (stderr ? `STDERR:\n${stderr}` : '');
        m.reply(output || "Perintah berhasil dijalankan tanpa output.");
    } catch (e) {
        m.reply(`Error: ${e}`);
    }
}
handler.command = ['$'];
handler.help = 'owner';
handler.owner = true;
