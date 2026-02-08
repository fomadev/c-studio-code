const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // Configuration de la fenêtre principale
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "C Studio Code - Université de Kinshasa",
        icon: path.join(__dirname, 'assets/icons/logo.png'),
        webPreferences: {
            nodeIntegration: true, // Autorise l'utilisation de 'require' dans le renderer
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile('index.html');

    // --- CONFIGURATION DU MENU ---
    const template = [
        {
            label: 'Fichier',
            submenu: [
                { 
                    label: 'Nouveau Fichier', 
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        // Envoie un signal au renderer pour déclencher la création
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
                            // Envoie le chemin sélectionné vers renderer.js
                            mainWindow.webContents.send('selected-directory', result.filePaths[0]);
                        }
                    }
                },
                { 
                    label: 'Enregistrer', 
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        // Envoie un signal pour sauvegarder le fichier en cours
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

// --- GESTION DU CYCLE DE VIE DE L'APPLICATION ---

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    // Sur macOS, les applications restent actives jusqu'à la fermeture explicite
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});