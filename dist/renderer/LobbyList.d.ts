import React from 'react';
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
declare const LobbyList: React.FC<LobbyListProps>;
export default LobbyList;
//# sourceMappingURL=LobbyList.d.ts.map