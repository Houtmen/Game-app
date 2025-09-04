// Simple WebSocket server for internet lobbies and chat
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 3001 });

let lobbies = {};

wss.on('connection', (ws) => {
  ws.id = uuidv4();
  ws.lobbyId = null;

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    if (msg.type === 'createLobby') {
      const lobbyId = uuidv4();
      lobbies[lobbyId] = { id: lobbyId, name: msg.name, game: msg.game, users: [msg.nickname], messages: [] };
      ws.lobbyId = lobbyId;
      ws.nickname = msg.nickname;
      ws.send(JSON.stringify({ type: 'lobbyCreated', lobby: lobbies[lobbyId] }));
      broadcastLobbies();
    } else if (msg.type === 'joinLobby') {
      const lobby = lobbies[msg.lobbyId];
      if (lobby) {
        lobby.users.push(msg.nickname);
        ws.lobbyId = msg.lobbyId;
        ws.nickname = msg.nickname;
        ws.send(JSON.stringify({ type: 'joinedLobby', lobby }));
        broadcastToLobby(msg.lobbyId, { type: 'userJoined', nickname: msg.nickname });
        broadcastLobbies();
      }
    } else if (msg.type === 'sendMessage') {
      const lobby = lobbies[ws.lobbyId];
      if (lobby) {
        const chatMsg = { nickname: ws.nickname, text: msg.text };
        lobby.messages.push(chatMsg);
        broadcastToLobby(ws.lobbyId, { type: 'message', message: chatMsg });
      }
    } else if (msg.type === 'leaveLobby') {
      const lobby = lobbies[ws.lobbyId];
      if (lobby) {
        lobby.users = lobby.users.filter(u => u !== ws.nickname);
        broadcastToLobby(ws.lobbyId, { type: 'userLeft', nickname: ws.nickname });
        if (lobby.users.length === 0) delete lobbies[ws.lobbyId];
        broadcastLobbies();
      }
      ws.lobbyId = null;
    }
  });

  ws.on('close', () => {
    if (ws.lobbyId && lobbies[ws.lobbyId]) {
      lobbies[ws.lobbyId].users = lobbies[ws.lobbyId].users.filter(u => u !== ws.nickname);
      if (lobbies[ws.lobbyId].users.length === 0) delete lobbies[ws.lobbyId];
      else broadcastToLobby(ws.lobbyId, { type: 'userLeft', nickname: ws.nickname });
      broadcastLobbies();
    }
  });

  ws.send(JSON.stringify({ type: 'lobbies', lobbies: Object.values(lobbies) }));
});

function broadcastLobbies() {
  const msg = JSON.stringify({ type: 'lobbies', lobbies: Object.values(lobbies) });
  wss.clients.forEach(client => { if (client.readyState === WebSocket.OPEN) client.send(msg); });
}

function broadcastToLobby(lobbyId, data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.lobbyId === lobbyId && client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

console.log('WebSocket server running on ws://localhost:3001');
