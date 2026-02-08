const path = require('path');
const fs = require('fs');
const { ipcRenderer } = require('electron');

// Chargement de l'AMD Loader de Monaco
const amdLoader = require('./node_modules/monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;

// Importation de vos modules personnalisés
const compiler = require('./src/compiler-handler');
const ui = require('./src/ui-controller');
const fileManager = require('./src/file-manager');
const terminalManager = require('./src/terminal-manager');

let editor; // Instance de l'éditeur Monaco

// --- 1. CONFIGURATION ET CHARGEMENT DE MONACO EDITOR ---

amdRequire.config({
    baseUrl: path.join(__dirname, './node_modules/monaco-editor/min')
});

amdRequire(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: [
            '#include <stdio.h>',
            '',
            'int main() {',
            '    printf("Bonjour UNIKIN !\\n");',
            '    return 0;',
            '}'
        ].join('\n'),
        language: 'c',
        theme: 'vs-dark', 
        automaticLayout: true, 
        fontSize: 14,
        minimap: { enabled: true } 
    });
    
    terminalManager.write('Éditeur Monaco chargé avec succès.\n', 'success');

    // Une fois Monaco chargé, on active la logique d'ouverture de fichiers
    setupFileEvents();
});

// --- 2. LOGIQUE DES FICHIERS (OUVERTURE ET CRÉATION) ---

function openFile(fileName) {
    const fileData = fileManager.getFileFullData(fileName);
    if (fileData) {
        editor.setValue(fileData.content);
        
        // Détection du langage selon l'extension
        const extension = fileName.split('.').pop();
        const lang = (extension === 'cpp' || extension === 'cc') ? 'cpp' : 'c';
        monaco.editor.setModelLanguage(editor.getModel(), lang);
        
        terminalManager.write(`Fichier ouvert : ${fileName}\n`, 'info');
    }
}

function setupFileEvents() {
    // Intercepter les clics sur la sidebar
    if (ui.fileList) {
        ui.fileList.addEventListener('click', (e) => {
            const item = e.target.closest('.file-item');
            if (item) {
                const fileName = item.getAttribute('data-filename');
                openFile(fileName);
            }
        });
    }

    // Gestion du bouton "Nouveau Fichier"
    const btnNewFile = document.getElementById('btn-new-file');
    if (btnNewFile) {
        btnNewFile.addEventListener('click', () => {
            const fileName = prompt("Nom du nouveau fichier (ex: exercice1.c) :");
            
            if (fileName) {
                if (!fileName.endsWith('.c') && !fileName.endsWith('.h') && !fileName.endsWith('.cpp')) {
                    alert("Veuillez ajouter une extension valide (.c, .h, .cpp)");
                    return;
                }

                const result = fileManager.createNewFile(fileName);
                
                if (result.success) {
                    terminalManager.write(`Fichier créé : ${fileName}\n`, 'success');
                    
                    // Rafraîchir la liste et ouvrir
                    const files = fileManager.getFilesInDirectory(fileManager.currentProjectDir);
                    ui.updateFileList(files);
                    openFile(fileName);
                } else {
                    alert(result.message);
                }
            }
        });
    }
}

// --- 3. INITIALISATION DU TERMINAL ---

const terminalContainer = document.getElementById('terminal-container');
terminalManager.init(terminalContainer);

terminalManager.write('Bienvenue dans C Studio Code (UNIKIN v1.0.0)\n', 'success');
terminalManager.write('Prêt pour la compilation C/C++.\n\n', 'info');

// --- 4. GESTION DU BOUTON "EXÉCUTER" ---

ui.btnRun.addEventListener('click', async () => {
    if (!editor) {
        terminalManager.write('Erreur : L\'éditeur n\'est pas encore chargé.\n', 'error');
        return;
    }
    
    const code = editor.getValue(); 
    
    if (!code.trim()) {
        terminalManager.write('Erreur : Aucun code à compiler !\n', 'error');
        return;
    }

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const sourcePath = path.join(tempDir, 'main.c');
    const exePath = path.join(tempDir, 'main.exe');

    ui.setLoading(true);
    terminalManager.clear();
    terminalManager.write('--- Nouvelle session de compilation ---\n', 'info');
    
    const saveResult = fileManager.saveFile(sourcePath, code);
    
    if (!saveResult.success) {
        terminalManager.write(`Erreur de sauvegarde : ${saveResult.message}\n`, 'error');
        ui.setLoading(false);
        return;
    }

    terminalManager.write('Compilation en cours...\n', 'info');
    
    compiler.compile(sourcePath, exePath, (res) => {
        if (!res.success) {
            terminalManager.write('ERREUR GCC :\n', 'error');
            terminalManager.write(res.message + '\n', 'error');
            ui.setLoading(false);
        } else {
            terminalManager.write('Compilation réussie !\n', 'success');
            terminalManager.write('---------------------------\n', 'info');
            
            compiler.run(exePath, (runRes) => {
                if (!runRes.success) {
                    terminalManager.write('Erreur d\'exécution :\n', 'error');
                    terminalManager.write(runRes.message + '\n', 'error');
                } else {
                    terminalManager.write(runRes.message + '\n', 'info');
                }
                terminalManager.write('\n---------------------------\n', 'info');
                terminalManager.write('Fin du programme.\n', 'success');
                ui.setLoading(false);
            });
        }
    });
});

// --- 5. RACCOURCIS CLAVIER ---

window.addEventListener('keydown', (e) => {
    if (e.key === 'F5') {
        ui.btnRun.click();
    }
});

// --- 6. GESTION DES COMMUNICATIONS IPC (OUVERTURE DOSSIER) ---

ipcRenderer.on('selected-directory', (event, pathDir) => {
    fileManager.currentProjectDir = pathDir;
    
    // Scanner les fichiers du nouveau dossier
    const files = fileManager.getFilesInDirectory(pathDir);
    
    // Mettre à jour l'interface (Sidebar)
    ui.updateFileList(files);
    
    // Message de confirmation
    terminalManager.clear();
    terminalManager.write(`Dossier chargé : ${pathDir}\n`, 'success');
});

// Initialisation par défaut (Optionnel : charge le dossier actuel au démarrage)
fileManager.currentProjectDir = __dirname; 
const defaultFiles = fileManager.getFilesInDirectory(__dirname);
ui.updateFileList(defaultFiles);