/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lan-broadcast.ts":
/*!******************************!*\
  !*** ./src/lan-broadcast.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var dgram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dgram */ \"dgram\");\n/* harmony import */ var dgram__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dgram__WEBPACK_IMPORTED_MODULE_1__);\n// LAN broadcast for game start/countdown (main process)\n\n\nconst LOBBY_PORT = 41234;\nconst BROADCAST_ADDR = '255.255.255.255';\nconst udp = dgram__WEBPACK_IMPORTED_MODULE_1___default().createSocket('udp4');\nudp.bind(LOBBY_PORT, () => {\n    udp.setBroadcast(true);\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle('lan-broadcast', async (_event, data) => {\n    const message = Buffer.from(JSON.stringify(data));\n    udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);\n});\n\n// Forward UDP LAN events to all renderer windows\nudp.on('message', (msg) => {\n    let data;\n    try {\n        data = JSON.parse(msg.toString());\n    }\n    catch {\n        return;\n    }\n    electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getAllWindows().forEach(win => {\n        win.webContents.send('lan-event', data);\n    });\n});\n\n\n//# sourceURL=webpack://lobby-app/./src/lan-broadcast.ts?\n}");

/***/ }),

/***/ "./src/lan-main.ts":
/*!*************************!*\
  !*** ./src/lan-main.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var dgram__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dgram */ \"dgram\");\n/* harmony import */ var dgram__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dgram__WEBPACK_IMPORTED_MODULE_2__);\n\n// Map game IDs to executable paths (update these paths as needed)\nconst GAME_PATHS = {\n    homm2: 'C:/Games/Heroes2/HEROES2.EXE',\n    homm3: 'C:/Games/Heroes3/HEROES3.EXE',\n};\nelectron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle('start-game', async (_event, gameId, exePath) => {\n    const exe = exePath || GAME_PATHS[gameId];\n    if (exe) {\n        (0,child_process__WEBPACK_IMPORTED_MODULE_0__.execFile)(exe, (err) => {\n            if (err)\n                console.error('Failed to launch game:', err);\n        });\n    }\n});\n// Electron main process: UDP LAN discovery/announce using Node.js dgram\n\n\nconst LOBBY_PORT = 41234;\nconst BROADCAST_ADDR = '255.255.255.255';\nconst udp = dgram__WEBPACK_IMPORTED_MODULE_2___default().createSocket('udp4');\nudp.bind(LOBBY_PORT, () => {\n    udp.setBroadcast(true);\n});\nelectron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle('lan-discover', async () => {\n    return new Promise((resolve) => {\n        const lobbies = [];\n        const message = Buffer.from(JSON.stringify({ type: 'discover' }));\n        udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);\n        const handler = (msg) => {\n            try {\n                const data = JSON.parse(msg.toString());\n                if (data.type === 'lobbies')\n                    lobbies.push(...data.lobbies);\n            }\n            catch { }\n        };\n        udp.on('message', handler);\n        setTimeout(() => {\n            udp.off('message', handler);\n            resolve(lobbies);\n        }, 500);\n    });\n});\nelectron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle('lan-announce', async (_event, lobby) => {\n    const message = Buffer.from(JSON.stringify({ type: 'announce', lobby }));\n    udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);\n});\nelectron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle('lan-remove', async (_event, lobbyId) => {\n    const message = Buffer.from(JSON.stringify({ type: 'remove', lobbyId }));\n    udp.send(message, 0, message.length, LOBBY_PORT, BROADCAST_ADDR);\n});\n\n\n//# sourceURL=webpack://lobby-app/./src/lan-main.ts?\n}");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lan_main__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lan-main */ \"./src/lan-main.ts\");\n/* harmony import */ var _lan_broadcast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lan-broadcast */ \"./src/lan-broadcast.ts\");\n\n\n\n\nfunction createWindow() {\n    const win = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({\n        width: 1000,\n        height: 700,\n        webPreferences: {\n            preload: path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, 'preload.js'),\n            nodeIntegration: false,\n            contextIsolation: true,\n        },\n    });\n    win.loadFile(path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, '../src/renderer/index.html'));\n}\nelectron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady().then(createWindow);\nelectron__WEBPACK_IMPORTED_MODULE_0__.app.on('window-all-closed', () => {\n    if (process.platform !== 'darwin') {\n        electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();\n    }\n});\n\n\n//# sourceURL=webpack://lobby-app/./src/main.ts?\n}");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "dgram":
/*!************************!*\
  !*** external "dgram" ***!
  \************************/
/***/ ((module) => {

module.exports = require("dgram");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;