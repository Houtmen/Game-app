import React from 'react';
import logger from './logger';

interface Lobby {
  id: string;
  name: string;
  game: string;
  users: string[];
}

interface LobbyListProps {
  lobbies: Lobby[];
  onJoin: (id: string) => void;
}

const LobbyList: React.FC<LobbyListProps> = ({ lobbies, onJoin }) => {
  React.useEffect(() => {
    logger.info('LobbyList mounted', { lobbyCount: lobbies.length });
    return () => {
      logger.info('LobbyList unmounted');
    };
  }, [lobbies]);
  if (!lobbies.length) {
    return <div style={{ color: '#888', marginTop: 16 }}>No lobbies found.</div>;
  }
  return (
    <div style={{ marginTop: 16 }}>
      <h2>Available Lobbies</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {lobbies.map(lobby => (
          <li key={lobby.id} style={{ marginBottom: 8, border: '1px solid #e0e0e0', borderRadius: 6, padding: 8 }}>
            <div><b>{lobby.name}</b> ({lobby.game})</div>
            <div>Players: {lobby.users.length}</div>
            <button onClick={() => {
              logger.info('Joining lobby', { lobbyId: lobby.id });
              onJoin(lobby.id);
            }}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyList;
