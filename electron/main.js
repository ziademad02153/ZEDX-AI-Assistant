const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, clipboard, session, desktopCapturer } = require('electron');
const path = require('path');

let floatingIconWindow = null;
let mainAppWindow = null;
let tray = null;
let isAppVisible = false;

const isDev = process.env.NODE_ENV !== 'production';
const APP_URL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../.next/server/app/index.html')}`;

function initStealth() {
    if (process.platform === 'win32') {
        app.setAppUserModelId('System.Helper');
    }

    if (process.platform === 'darwin') {
        app.dock.hide();
    }
}

function createFloatingIcon() {
    const { width } = screen.getPrimaryDisplay().workAreaSize;

    // Create the window
    floatingIconWindow = new BrowserWindow({
        width: 56,
        height: 56,
        x: Math.floor(width / 2) - 28,
        y: 10,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        movable: true,
        hasShadow: false,
        show: true, // Explicitly show the window
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Content Protection
    floatingIconWindow.setContentProtection(true);

    if (process.platform === 'darwin') {
        floatingIconWindow.setAlwaysOnTop(true, 'screen-saver', 1);
        floatingIconWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }

    if (process.platform === 'win32') {
        floatingIconWindow.setAlwaysOnTop(true, 'screen-saver');
    }

    floatingIconWindow.loadFile(path.join(__dirname, 'floating-icon.html'));
    floatingIconWindow.setIgnoreMouseEvents(false);

    // Debug: log when icon is loaded
    floatingIconWindow.webContents.on('did-finish-load', () => {
        console.log('[Electron] Floating icon loaded at position:', floatingIconWindow.getBounds());
    });
}

function createMainAppWindow() {
    const { width } = screen.getPrimaryDisplay().workAreaSize;

    mainAppWindow = new BrowserWindow({
        width: 500,
        height: 750,
        minWidth: 400,
        minHeight: 600,
        x: Math.floor(width / 2) - 250,
        y: 50,
        frame: false,
        transparent: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: true,
        movable: true,
        hasShadow: true,
        focusable: true,
        show: false,
        backgroundColor: '#18181b',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true,
            partition: 'persist:main',
            allowRunningInsecureContent: false
        }
    });

    mainAppWindow.setContentProtection(true);

    // FIX: Set standard Chrome User-Agent to allow Web Speech API usage
    // Google blocks non-standard user agents from accessing the free Speech API
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    mainAppWindow.webContents.setUserAgent(userAgent);

    if (process.platform === 'darwin') {
        mainAppWindow.setAlwaysOnTop(true, 'screen-saver', 1);
        mainAppWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }

    // Load desktop entry page - handles auth check and redirects properly
    // If logged in → dashboard, if not → login
    // QA FIX: Direct to login if desktop route is flaky
    mainAppWindow.loadURL(`${APP_URL}/login?desktop=true`);

    mainAppWindow.on('close', (e) => {
        e.preventDefault();
        mainAppWindow.hide();
        isAppVisible = false;
    });
}

function toggleApp() {
    if (!mainAppWindow) return;

    if (isAppVisible) {
        mainAppWindow.hide();
        isAppVisible = false;
    } else {
        mainAppWindow.show();
        mainAppWindow.focus();
        isAppVisible = true;
    }
}

function setupIpcHandlers() {
    ipcMain.on('toggle-app', () => {
        toggleApp();
    });

    ipcMain.on('hide-app', () => {
        if (mainAppWindow && isAppVisible) {
            mainAppWindow.hide();
            isAppVisible = false;
        }
    });

    ipcMain.on('go-back', () => {
        if (mainAppWindow && mainAppWindow.webContents.canGoBack()) {
            mainAppWindow.webContents.goBack();
        }
    });

    ipcMain.on('copy-to-clipboard', (event, text) => {
        clipboard.writeText(text);
    });

    ipcMain.on('get-desktop-mode', (event) => {
        event.returnValue = true;
    });

    ipcMain.on('can-go-back', (event) => {
        event.returnValue = mainAppWindow ? mainAppWindow.webContents.canGoBack() : false;
    });

    // System Audio Capture handlers
    ipcMain.handle('get-system-audio-source', async () => {
        try {
            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: { width: 0, height: 0 }
            });

            if (sources.length > 0) {
                return { success: true, sourceId: sources[0].id };
            }
            return { success: false, error: 'No screen sources found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('start-system-audio-capture', async () => {
        try {
            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: { width: 0, height: 0 }
            });

            if (sources.length > 0) {
                if (mainAppWindow) {
                    mainAppWindow.webContents.send('audio-source-ready', sources[0].id);
                }
                return { success: true, sourceId: sources[0].id };
            }
            return { success: false, error: 'No screen sources found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('stop-system-audio-capture', async () => {
        return { success: true };
    });

    // IPC Relay: Main Window -> Overlay
    ipcMain.on('transcript-update', (event, text) => {
        if (floatingIconWindow && !floatingIconWindow.isDestroyed()) {
            // Note: overlay logic seems to be in floatingIconWindow (or overlayWindow if separate)
            // The user's page.tsx refers to 'OverlayPage', usually loaded in floatingIconWindow or separate.
            // Based on context, floatingIconWindow.loadFile('floating-icon.html'). 
            // Wait, floating-icon.html might not be the overlay. 
            // Let's assume overlay is separate or it is the floating icon expanded.
            // Actually, usually Overlay is a separate window. 
            // But looking at main.js, we only have `floatingIconWindow` and `mainAppWindow`. 
            // The floating icon expands?
            // Let's safe-send to floatingIconWindow just in case, or if there is an overlayWindow variable I missed.
            // Looking at line 4: `let floatingIconWindow = null;`
            // There is no `overlayWindow`.
            // So the "Overlay" must be the floating window expanded or I am missing something. 
            // But valid `preload.js` works for `floatingIconWindow` too.
            floatingIconWindow.webContents.send('transcript', text);
        }
    });

    ipcMain.on('answer-update', (event, text) => {
        if (floatingIconWindow && !floatingIconWindow.isDestroyed()) {
            floatingIconWindow.webContents.send('answer', text);
        }
    });

    // Handle Overlay Resizing (Expand/Collapse)
    ipcMain.on('resize-overlay', (event, { width, height }) => {
        if (floatingIconWindow && !floatingIconWindow.isDestroyed()) {
            floatingIconWindow.setSize(width, height);
            console.log(`[Electron] Resized Overlay to ${width}x${height}`);
        }
    });

    // Make window clickable or click-through
    ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
        if (floatingIconWindow && !floatingIconWindow.isDestroyed()) {
            const win = floatingIconWindow; // capture ref
            win.setIgnoreMouseEvents(ignore, options);
        }
    });
}

function createTray() {
    try {
        const iconPath = path.join(__dirname, '..', 'public', 'favicon.jpg');
        let icon = nativeImage.createEmpty();

        try {
            const loadedIcon = nativeImage.createFromPath(iconPath);
            if (!loadedIcon.isEmpty()) {
                icon = loadedIcon;
            }
        } catch (e) {
            console.log('Tray icon not found, using empty icon');
        }

        tray = new Tray(icon.resize({ width: 16, height: 16 }));

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show/Hide ZEDX AI',
                click: () => toggleApp()
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    mainAppWindow = null;
                    app.quit();
                }
            }
        ]);

        tray.setToolTip('ZEDX AI');
        tray.setContextMenu(contextMenu);

        tray.on('click', () => {
            toggleApp();
        });
    } catch (error) {
        console.error('Failed to create tray:', error);
    }
}

async function initialize() {
    initStealth();

    // Grant permissions for Web Speech API
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowedPermissions = ['media', 'audioCapture', 'speech'];
        if (allowedPermissions.includes(permission)) {
            callback(true);
        } else {
            callback(false);
        }
    });

    // Also grant permissions check handler
    session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
        const allowedPermissions = ['media', 'audioCapture', 'speech'];
        return allowedPermissions.includes(permission);
    });

    createFloatingIcon();
    createMainAppWindow();
    createTray();
    setupIpcHandlers();

    // Auto-Updater Logic
    if (!isDev) {
        const { autoUpdater } = require('electron-updater');
        autoUpdater.checkForUpdatesAndNotify();

        autoUpdater.on('update-available', () => {
             if (mainAppWindow) mainAppWindow.webContents.send('update-available');
        });

        autoUpdater.on('update-downloaded', () => {
            if (mainAppWindow) mainAppWindow.webContents.send('update-downloaded');
            // Silent restart after download
            // autoUpdater.quitAndInstall(); 
        });
    }
}

app.whenReady().then(initialize);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        initialize();
    }
});

app.on('before-quit', () => {
    mainAppWindow = null;
});
