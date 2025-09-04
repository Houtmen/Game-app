// UDP LAN lobby discovery server
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const LOBBY_PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';
let lobbies = {};

server.on('message', (msg, rinfo) => {
  let data;
  try { data = JSON.parse(msg); } catch { return; }
  if (data.type === 'discover') {
    // Reply with all lobbies
    const response = JSON.stringify({ type: 'lobbies', lobbies: Object.values(lobbies) });
    server.send(response, rinfo.port, rinfo.address);
  } else if (data.type === 'announce') {
    // Register or update a lobby
    lobbies[data.lobby.id] = data.lobby;
  } else if (data.type === 'remove') {
    delete lobbies[data.lobbyId];
  }
});

server.on('listening', () => {
  server.setBroadcast(true);
  console.log(`LAN lobby UDP server listening on ${LOBBY_PORT}`);
});

server.bind(LOBBY_PORT);
