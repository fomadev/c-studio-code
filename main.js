const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
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
                { 
                    label: 'Nouveau Fichier', 
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        // On simule un clic sur le bouton "+" du renderer
                        mainWindow.webContents.send('trigger-new-file');
                    }
                },
                { 
                    label: 'Ouvrir Dossier', 
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const result = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openDirectory'],
                            title: 'Sélectionner votre dossier de projet C',
                            buttonLabel: 'Choisir ce dossier'
                        });
                        
                        if (!result.canceled && result.filePaths.length > 0) {
                            // Envoi du chemin sélectionné vers renderer.js
                            mainWindow.webContents.send('selected-directory', result.filePaths[0]);
                        }
                    }
                },
                { 
                    label: 'Enregistrer', 
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.send('save-current-file');
                    }
                },
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
                { 
                    label: 'Documentation UNIKIN',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://www.unikin.ac.cd');
                    }
                },
                { 
                    label: 'À propos', 
                    click: () => { 
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'À propos',
                            message: 'C Studio Code v1.0.0',
                            detail: 'Un IDE léger conçu pour les étudiants de l\'Université de Kinshasa.\nBasé sur Monaco Editor et GCC.'
                        });
                    } 
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// --- GESTION DES ÉVÉNEMENTS DE L'APPLICATION ---

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});