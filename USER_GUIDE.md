# User Guide: Lobby App

Welcome to the Lobby App! This guide will help you get started, explain the main features, and answer common questions.

---

## How the Application Works

### 1. Choose Your Mode
- **Internet Mode:** Connects to a central server for online lobbies and chat.
- **LAN Mode:** Automatically discovers and joins lobbies on your local network.

### 2. Set Your Nickname
- Enter a nickname when you first launch the app. This will be visible to other players.

### 3. Select a Game
- Choose from supported games (e.g., Heroes II, Heroes III, DOOM).
- You can add more games in the settings if needed.

### 4. Configure Game Paths
- Go to **Settings** and set the executable path for each game you want to play.
- This is required for launching games from the lobby.

### 5. Create or Join a Lobby
- **Create Lobby:** Set a name, max players, and (optionally) a password. Choose game-specific options if available.
- **Join Lobby:** Select from the list of available lobbies and enter a password if required.

### 6. Chat and Coordinate
- Use the chat to communicate with other players in the lobby.
- See who is in the lobby, with avatars and nicknames.

### 7. Start the Game
- The host can start the game for all players. The app will launch the game executable for everyone in the lobby.

---

## FAQ (Frequently Asked Questions)

### Q: Why can't I see any lobbies in LAN mode?
A: Make sure all devices are on the same local network and that firewalls allow UDP traffic. The app uses UDP broadcasts for LAN discovery.

### Q: The game doesn't launch when I click "Start Game". What should I do?
A: Check that the game path is set correctly in Settings. Also, ensure you have permission to run the executable (try running the app as administrator on Windows).

### Q: How do I add more games?
A: Edit the games list in the app settings or ask your admin to add more games to the configuration. Each game needs its executable path set.

### Q: What is the difference between LAN and Internet mode?
A: LAN mode is for local network play (no internet required). Internet mode connects to a central server for online play with friends anywhere.

### Q: How do I host the backend server for Internet mode?
A: Run `node server/lobby-server.js` on your server or PC. Make sure the port is open and accessible to all players.

### Q: Is my data secure?
A: The app uses secure communication and does not expose sensitive APIs to the UI. Only your nickname and chat messages are shared with other players.

### Q: Can I set a password for my lobby?
A: Yes! When creating a lobby, enter a password. Others will need it to join.

### Q: What platforms are supported?
A: Windows, Mac, and Linux. Installers are available for each platform.

---

For more help, see the README or contact support.
