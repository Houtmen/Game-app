# Lobby App

A cross-platform desktop lobby application for classic multiplayer games (inspired by VCMI lobby), supporting both LAN and internet play.

## Features
- LAN and internet lobbies
- Real-time chat and user list
- Game launching for all lobby members
- User-configurable game paths
- Supports Heroes of Might and Magic II & III (more can be added)
- Electron + React + TypeScript

<<<<<<< HEAD
=======
## Download

See the [Releases](https://github.com/Houtmen/Game-app/releases) page for the latest Windows installer:
- [Download Lobby App Setup.exe](https://github.com/Houtmen/Game-app/releases/latest)

>>>>>>> 4f73588524a1adec1e37b563f70c2ee3854d1200
## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
	```sh
	git clone <your-repo-url>
	cd Lobby-app
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn
	```

<<<<<<< HEAD

=======
>>>>>>> 4f73588524a1adec1e37b563f70c2ee3854d1200
### Running the App
To start the Electron app in development mode:
```sh
npm run dev
# or
yarn dev
```
<<<<<<< HEAD

To build for production:
```sh
npm run build
npm run start
```

### Packaging & Distribution
To create installers for Windows, Mac, or Linux:
```sh
npm run dist
```
The output installers will be in the `dist/` folder. Supported targets:
- Windows: NSIS installer (`.exe`)
- Mac: DMG image (`.dmg`)
- Linux: AppImage (`.AppImage`)


#### Bundling/Running the Backend Server
- The backend WebSocket server for internet lobbies is in `server/lobby-server.js`.
- For local use, run it with:
	```sh
	node server/lobby-server.js
	```
- For distribution, you can bundle it with the app or host it online.

## Security & Permissions

- The Electron app uses a secure `preload.js` with `contextBridge` to expose only safe APIs to the renderer. No Node.js or Electron internals are exposed to untrusted code.
- All user input is validated before being sent over the network or to the backend.
- No remote code execution or dangerous APIs are exposed to the UI.

### Windows UAC & Mac Permissions
- On Windows, launching games may trigger a UAC prompt if the game requires elevated permissions. If you encounter issues, try running the app as administrator.
- On Mac, you may need to grant the app permission to control other apps or access files. Check System Preferences > Security & Privacy if you have trouble launching games.

## Usage

See the [User Guide and FAQ](USER_GUIDE.md) for a step-by-step walkthrough and answers to common questions.
- Launch the app.
- Choose LAN or Internet mode.
- Set your nickname and select a game.
- Create or join a lobby.
- Chat with other users.
- When ready, click "Start Game" to launch the game for all lobby members.
- Configure game executable paths in the settings dialog.

### LAN Lobbies
- Lobbies are automatically discovered on your local network.
- If the host leaves, the lobby is closed for all users.
- User list and chat are synchronized in real time.

### Internet Lobbies
- Requires the included WebSocket server (`server/lobby-server.js`) to be running.
- Connects to the server for lobby and chat features.

## Adding More Games
- Edit the `GAMES` array in `src/renderer/App.tsx` to add more supported games.
- Ensure the executable path can be set in the settings dialog.

## Troubleshooting
- If games do not launch, check your game path settings.
- For LAN issues, ensure all devices are on the same network and firewall allows UDP traffic.
- For internet lobbies, ensure the server is running and accessible.

## Download

See the [Releases](https://github.com/Houtmen/Game-app/releases) page for the latest Windows installer:
- [Download Lobby App Setup.exe](https://github.com/Houtmen/Game-app/releases/latest)

## License
MIT
=======
>>>>>>> 4f73588524a1adec1e37b563f70c2ee3854d1200
