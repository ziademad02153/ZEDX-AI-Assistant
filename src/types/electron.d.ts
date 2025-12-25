export interface ElectronAPI {
    toggleOverlay: () => void;
    hideOverlay: () => void;
    // Main process control
    hideApp: () => void;
    showApp: () => void;
    closeApp: () => void;
    toggleApp: () => void;
    goBack: () => void;
    isDesktopMode: () => boolean;
    // Utils
    copyToClipboard: (text: string) => void;
    sendTranscript: (transcript: string) => void;
    sendAnswer: (answer: string) => void;
    // Audio
    startSystemAudioCapture: () => Promise<{ success: boolean; sourceId?: string; error?: string }>;
    stopSystemAudioCapture: () => Promise<void>;
    onAudioSourceReady: (callback: (sourceId: string) => void) => void;
    // Events
    onTranscript: (callback: (text: string) => void) => void;
    onAnswer: (callback: (answer: string) => void) => void;
    // Overlay Controls
    resizeOverlay: (width: number, height: number) => void;
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward?: boolean }) => void;
    isElectron: boolean;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export { };
