import React, { useState, useEffect } from 'react';
import { discoverLobbies, announceLobby, removeLobby, startGame, broadcastLAN, listenLAN } from './lan';
import GamePathSettings from './GamePathSettings';
import Chat from './Chat';
import LobbyList from './LobbyList';

interface Lobby {
  id: string;
  name: string;
  game: string;
  users: string[];
  messages?: { nickname: string; text: string }[];
  host?: string;
  options?: Record<string, any>;
  settings?: { maxPlayers: number; password: string };
}

const GAMES = [
  {
    id: 'homm2',
    name: 'Heroes of Might and Magic II',
    instructions: 'Make sure the game is installed and the path is set in Settings. Multiplayer is supported via hotseat or TCP/IP.'
  },
  {
    id: 'homm3',
    name: 'Heroes of Might and Magic III',
    instructions: 'Set the game path in Settings. Multiplayer is supported via hotseat or TCP/IP.'
  }
];

function App() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [inLobby, setInLobby] = useState<Lobby | null>(null);
  const [messages, setMessages] = useState<{ nickname: string; text: string }[]>([]);
  const [nickname, setNickname] = useState('');
  const [game, setGame] = useState(() => (GAMES[0]?.id ?? ''));
  const [gameOptions, setGameOptions] = useState<Record<string, any>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [gamePaths, setGamePaths] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('gamePaths') || '{}');
    } catch {
      return {};
    }
  });
  const [lobbyName, setLobbyName] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [mode, setMode] = useState<'internet' | 'lan'>('internet');
  const [error, setError] = useState<string | null>(null);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [lobbyPassword, setLobbyPassword] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);

  function handleModeChange(newMode: 'internet' | 'lan') {
    if (mode !== newMode) {
      setLobbies([]);
      setInLobby(null);
      setMessages([]);
      setLobbyName('');
      setMode(newMode);
    }
  }

  useEffect(() => {
    if (mode === 'internet') {
      const socket = new window.WebSocket('ws://localhost:3001');
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'lobbies') setLobbies(msg.lobbies);
        if (msg.type === 'lobbyCreated' || msg.type === 'joinedLobby') {
          setInLobby(msg.lobby);
          setMessages(msg.lobby.messages || []);
        }
        if (msg.type === 'userJoined') setMessages(m => [...m, { nickname: 'System', text: `${msg.nickname} joined.` }]);
        if (msg.type === 'userLeft') setMessages(m => [...m, { nickname: 'System', text: `${msg.nickname} left.` }]);
        if (msg.type === 'message') setMessages(m => [...m, msg.message]);
      };
      setWs(socket);
      return () => { socket.close(); };
    } else {
      let running = true;
      async function pollLAN() {
        while (running) {
          const found = await discoverLobbies();
          setLobbies(found);
          await new Promise(res => setTimeout(res, 1000));
        }
      }
      pollLAN();
      return () => { running = false; };
    }
  }, [mode]);

  function handleJoin(id: string) {
    if (mode === 'internet') {
      if (ws && nickname) ws.send(JSON.stringify({ type: 'joinLobby', lobbyId: id, nickname }));
    } else {
      const lobby = lobbies.find(l => l.id === id);
      if (lobby) {
        setInLobby(lobby);
        broadcastLAN({ type: 'lan-join', lobbyId: id, nickname });
      }
    }
  }
  function handleSend(msg: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (mode === 'internet') {
      if (ws && inLobby && msg.trim()) ws.send(JSON.stringify({ type: 'sendMessage', text: msg, time }));
    } else {
      if (msg.trim() && inLobby) {
        broadcastLAN({ type: 'lan-chat', lobbyId: inLobby.id, nickname: nickname || 'You', text: msg, time });
      }
    }
  }
  function handleCreateLobby() {
    setError(null);
    const gamePath = gamePaths[game];
    if (!gamePath) {
      setError('Please set the game path in Settings before creating a lobby.');
      return;
    }
    const lobbySettings = {
      maxPlayers,
      password: lobbyPassword
    };
    if (mode === 'internet') {
      if (ws && nickname && lobbyName.trim()) ws.send(JSON.stringify({ type: 'createLobby', name: lobbyName, game: GAMES.find(g => g.id === game)?.name || '', nickname, options: gameOptions, settings: lobbySettings }));
    } else {
      if (!lobbyName.trim()) return;
      const newLobby: Lobby = { id: Date.now().toString(), name: lobbyName, game: GAMES.find(g => g.id === game)?.name || '', users: [nickname || 'You'], host: nickname || 'You', options: gameOptions, settings: lobbySettings };
      announceLobby(newLobby);
      setLobbies(l => [...l, newLobby]);
      setInLobby(newLobby);
      setMessages([]);
    }
  }
  function handleLeaveLobby() {
    if (mode === 'internet') {
      if (ws && inLobby) ws.send(JSON.stringify({ type: 'leaveLobby' }));
      setInLobby(null);
      setMessages([]);
    } else {
      if (inLobby) {
        if ((inLobby as any).host === (nickname || 'You')) {
          broadcastLAN({ type: 'lobby-closed', lobbyId: inLobby.id });
          removeLobby(inLobby.id);
        } else {
          broadcastLAN({ type: 'lan-leave', lobbyId: inLobby.id, nickname });
        }
      }
      setInLobby(null);
      setMessages([]);
    }
  }
  const isHost = mode === 'lan' && inLobby && inLobby.users[0] === (nickname || 'You');

  useEffect(() => {
    if (mode === 'lan' && inLobby) {
      listenLAN((data: any) => {
        if (data.lobbyId === inLobby.id) {
          if (data.type === 'countdown') {
            setCountdown(data.value);
            setMessages(m => [...m, { nickname: 'System', text: `Game starting in ${data.value}...` }]);
          }
          if (data.type === 'start') {
            setCountdown(null);
            setMessages(m => [...m, { nickname: 'System', text: 'Launching game!' }]);
            startGame(game, gamePaths[game]);
          }
          if (data.type === 'lobby-closed') {
            setInLobby(null);
            setMessages(m => [...m, { nickname: 'System', text: 'Lobby closed by host.' }]);
          }
          if (data.type === 'lan-join') {
            setInLobby(lobby => lobby ? { ...lobby, users: Array.from(new Set([...lobby.users, data.nickname])) } : lobby);
            setMessages(m => [...m, { nickname: 'System', text: `${data.nickname} joined the lobby.` }]);
          }
          if (data.type === 'lan-leave') {
            setInLobby(lobby => lobby ? { ...lobby, users: lobby.users.filter(u => u !== data.nickname) } : lobby);
            setMessages(m => [...m, { nickname: 'System', text: `${data.nickname} left the lobby.` }]);
          }
          if (data.type === 'lan-chat') {
            setMessages(m => [...m, { nickname: data.nickname, text: data.text }]);
          }
        }
      });
    }
  }, [mode, inLobby, game, gamePaths]);

  if (!nickname) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Enter your nickname</h2>
        <input value={nickname} onChange={e => setNickname(e.target.value)} />
      </div>
    );
  }

  if (inLobby) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Lobby: {inLobby.name} ({inLobby.game})</h2>
        <div style={{ marginBottom: 16 }}>
          <b>Users in lobby:</b>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {inLobby.users.map(u => (
              <li key={u} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{
                  display: 'inline-block',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#e0e7ef',
                  color: '#333',
                  textAlign: 'center',
                  lineHeight: '28px',
                  fontWeight: 'bold',
                  marginRight: 8
                }}>{u[0]?.toUpperCase() || 'U'}</span>
                {u}{u === (nickname || 'You') ? ' (You)' : ''}
              </li>
            ))}
          </ul>
        </div>
        <Chat messages={messages} onSend={handleSend} />
        {mode === 'lan' && isHost && (
          <button style={{ marginRight: 8 }} onClick={async () => {
            for (let i = 5; i > 0; i--) {
              await broadcastLAN({ type: 'countdown', value: i, lobbyId: inLobby.id });
              await new Promise(res => setTimeout(res, 1000));
            }
            await broadcastLAN({ type: 'start', lobbyId: inLobby.id });
          }}>Start Game</button>
        )}
        {countdown !== null && <div style={{ color: 'red', fontWeight: 'bold' }}>Game starting in {countdown}...</div>}
        <button onClick={handleLeaveLobby}>Leave Lobby</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <GamePathSettings
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={paths => {
          setGamePaths(paths);
          localStorage.setItem('gamePaths', JSON.stringify(paths));
          setShowSettings(false);
        }}
        initialPaths={gamePaths}
      />
      <h1>Game Lobby App</h1>
      <button style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setShowSettings(true)}>Settings</button>
      <div style={{ marginBottom: 16 }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 8,
          background: mode === 'internet' ? '#007bff' : '#28a745',
          color: 'white',
          fontWeight: 'bold',
          marginRight: 16
        }}>
          {mode === 'internet' ? 'Internet Mode' : 'LAN Mode'}
        </span>
        <label>
          <input type="radio" checked={mode === 'internet'} onChange={() => handleModeChange('internet')} /> Internet
        </label>
        <label style={{ marginLeft: 16 }}>
          <input type="radio" checked={mode === 'lan'} onChange={() => handleModeChange('lan')} /> LAN
        </label>
      </div>
      <div style={{ marginBottom: 24, padding: 12, border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafbfc' }}>
        <h2>Create Lobby</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input placeholder="Lobby name" value={lobbyName} onChange={e => setLobbyName(e.target.value)} />
          <select value={game} onChange={e => {
            setGame(e.target.value);
            setGameOptions({});
          }}>
            {GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input type="number" min={2} max={16} value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} style={{ width: 60 }} placeholder="Max players" />
          <input type="password" value={lobbyPassword} onChange={e => setLobbyPassword(e.target.value)} style={{ width: 120 }} placeholder="Password (optional)" />
          <button onClick={handleCreateLobby}>Create</button>
        </div>
        {/* Per-game launch options */}
        {(() => {
          const selected = GAMES.find(g => g.id === game);
          if (!selected) return null;
          return (
            <div style={{ margin: '8px 0', padding: 8, background: '#f8f9fa', borderRadius: 6 }}>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}><b>Instructions:</b> {selected.instructions}</div>
            </div>
          );
        })()}
      </div>
      <LobbyList lobbies={lobbies} onJoin={handleJoin} />
    </div>
  );
}

export default App;