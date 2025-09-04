export declare function discoverLobbies(): Promise<any[]>;
export declare function announceLobby(lobby: any): Promise<void>;
export declare function removeLobby(lobbyId: string): Promise<void>;
export declare function startGame(gameId: string, exePath?: string): Promise<void>;
export declare function broadcastLAN(data: any): Promise<void>;
export declare function listenLAN(onMessage: (data: any) => void): void;
//# sourceMappingURL=lan.d.ts.map