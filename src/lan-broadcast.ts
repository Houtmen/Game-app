// LAN broadcast for game start/countdown (main process)
import { ipcMain } from 'electron';
import dgram from 'dgram';

const LOBBY_PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';
const udp = dgram.createSocket('udp4');

udp.bind(LOBBY_PORT, () => {
  udp.setBroadcast(true);
});

ipcMain.handle('lan-broadcast', async (_event, data) => {
  const message = Buffer.from(JSON.stringify(data));
  udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);
});


import { BrowserWindow } from 'electron';

// Forward UDP LAN events to all renderer windows
udp.on('message', (msg: Buffer) => {
  let data;
  try { data = JSON.parse(msg.toString()); } catch { return; }
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('lan-event', data);
  });
});
