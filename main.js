const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "C Studio Code - Université de Kinshasa",
        icon: path.join(__dirname, 'assets/icons/logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile('index.html');

    // Menu personnalisé en Français
    const template = [
        {
            label: 'Fichier',
            submenu: [
                { label: 'Nouveau Fichier', accelerator: 'CmdOrCtrl+N' },
                { label: 'Ouvrir Dossier', accelerator: 'CmdOrCtrl+O' },
                { label: 'Enregistrer', accelerator: 'CmdOrCtrl+S' },
                { type: 'separator' },
                { label: 'Quitter', role: 'quit' }
            ]
        },
        {
            label: 'Édition',
            submenu: [
                { label: 'Annuler', role: 'undo' },
                { label: 'Rétablir', role: 'redo' },
                { type: 'separator' },
                { label: 'Couper', role: 'cut' },
                { label: 'Copier', role: 'copy' },
                { label: 'Coller', role: 'paste' }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                { label: 'Documentation UNIKIN' },
                { label: 'À propos', click: () => { console.log("C Studio Code v1.0.0"); } }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});