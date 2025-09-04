// LAN lobby client for Electron/React (browser)
// Uses UDP via Node.js child process (main process) for LAN discovery/announce
// This is a stub for the renderer; real UDP is handled in Electron main process
export async function discoverLobbies(): Promise<any[]> {
  // In production, this would use Electron's IPC to call the main process
  // Here, just return an empty array as a placeholder
  return [];
}

export async function announceLobby(lobby: any) {
  // In production, this would use Electron's IPC to call the main process
}

export async function removeLobby(lobbyId: string) {
  // In production, this would use Electron's IPC to call the main process
}

export async function startGame(gameId: string, exePath?: string) {
  if ((window as any).electronAPI) {
    await (window as any).electronAPI.startGame(gameId, exePath);
  }
}

export async function broadcastLAN(data: any) {
  if ((window as any).electronAPI) {
    await (window as any).electronAPI.lanBroadcast(data);
  }
}

export function listenLAN(onMessage: (data: any) => void) {
  if ((window as any).electron && (window as any).electron.ipcRenderer) {
    (window as any).electron.ipcRenderer.on('lan-event', (_event: any, data: any) => {
      onMessage(data);
    });
  } else if ((window as any).require) {
    // Fallback for Electron context
    const { ipcRenderer } = (window as any).require('electron');
    ipcRenderer.on('lan-event', (_event: any, data: any) => {
      onMessage(data);
    });
  }
}
