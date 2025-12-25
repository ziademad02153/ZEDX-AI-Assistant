const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    toggleApp: () => ipcRenderer.send('toggle-app'),
    hideApp: () => ipcRenderer.send('hide-app'),
    goBack: () => ipcRenderer.send('go-back'),
    copyToClipboard: (text) => ipcRenderer.send('copy-to-clipboard', text),
    isDesktopMode: () => ipcRenderer.sendSync('get-desktop-mode'),

    // Audio capture
    getSystemAudioSource: () => ipcRenderer.invoke('get-system-audio-source'),
    startSystemAudioCapture: () => ipcRenderer.invoke('start-system-audio-capture'),
    stopSystemAudioCapture: () => ipcRenderer.invoke('stop-system-audio-capture'),

    // Broadcast updates to Overlay
    sendTranscript: (text) => ipcRenderer.send('transcript-update', text),
    sendAnswer: (text) => ipcRenderer.send('answer-update', text),

    // Overlay Controls
    resizeOverlay: (width, height) => ipcRenderer.send('resize-overlay', { width, height }),
    setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),

    // Callbacks
    onTranscript: (callback) => {
        const wrapper = (event, text) => callback(text);
        ipcRenderer.on('transcript', wrapper);
        return () => ipcRenderer.removeListener('transcript', wrapper);
    },

    onAnswer: (callback) => {
        const wrapper = (event, answer) => callback(answer);
        ipcRenderer.on('answer', wrapper);
        return () => ipcRenderer.removeListener('answer', wrapper);
    },

    onAudioSourceReady: (callback) => {
        // Force removal of any existing listeners to prevent zombie callbacks
        ipcRenderer.removeAllListeners('audio-source-ready');
        const wrapper = (event, sourceId) => callback(sourceId);
        ipcRenderer.on('audio-source-ready', wrapper);
        return () => ipcRenderer.removeListener('audio-source-ready', wrapper);
    },

    isElectron: true
});
