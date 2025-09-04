import { execFile } from 'child_process';
// Map game IDs to executable paths (update these paths as needed)
const GAME_PATHS: Record<string, string> = {
  homm2: 'C:/Games/Heroes2/HEROES2.EXE',
  homm3: 'C:/Games/Heroes3/HEROES3.EXE',
};

ipcMain.handle('start-game', async (_event, gameId: string, exePath?: string) => {
  const exe = exePath || GAME_PATHS[gameId];
  if (exe) {
    execFile(exe, (err) => {
      if (err) console.error('Failed to launch game:', err);
    });
  }
});
// Electron main process: UDP LAN discovery/announce using Node.js dgram
import { ipcMain } from 'electron';
import dgram from 'dgram';

const LOBBY_PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';
const udp = dgram.createSocket('udp4');

udp.bind(LOBBY_PORT, () => {
  udp.setBroadcast(true);
});

ipcMain.handle('lan-discover', async () => {
  return new Promise((resolve) => {
    const lobbies: any[] = [];
    const message = Buffer.from(JSON.stringify({ type: 'discover' }));
    udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);
    const handler = (msg: Buffer) => {
      try {
        const data = JSON.parse(msg.toString());
        if (data.type === 'lobbies') lobbies.push(...data.lobbies);
      } catch {}
    };
    udp.on('message', handler);
    setTimeout(() => {
      udp.off('message', handler);
      resolve(lobbies);
    }, 500);
  });
});

ipcMain.handle('lan-announce', async (_event, lobby) => {
  const message = Buffer.from(JSON.stringify({ type: 'announce', lobby }));
  udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);
});

ipcMain.handle('lan-remove', async (_event, lobbyId) => {
  const message = Buffer.from(JSON.stringify({ type: 'remove', lobbyId }));
  udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);
});
