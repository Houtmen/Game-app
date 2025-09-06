declare global {
    interface Window {
        electronAPI?: {
            onUpdateAvailable?: (callback: () => void) => void;
            onUpdateDownloaded?: (callback: () => void) => void;
        };
    }
}
declare function App(): import("react/jsx-runtime").JSX.Element;
export default App;
//# sourceMappingURL=App.d.ts.map