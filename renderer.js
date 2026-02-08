const path = require('path');
const fs = require('fs');
const amdLoader = require('./node_modules/monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;

// Importation de nos modules personnalisés
const compiler = require('./src/compiler-handler');
const ui = require('./src/ui-controller');
const fileManager = require('./src/file-manager');
const terminalManager = require('./src/terminal-manager');

let editor; // Cette variable contiendra l'instance de l'éditeur Monaco

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
});

// --- 2. INITIALISATION DU TERMINAL ---

const terminalContainer = document.getElementById('terminal-container');
terminalManager.init(terminalContainer);

// Message d'accueil pour les étudiants
terminalManager.write('Bienvenue dans C Studio Code (UNIKIN v1.0.0)\n', 'success');
terminalManager.write('Prêt pour la compilation C/C++.\n\n', 'info');

// --- 3. GESTION DU BOUTON "EXÉCUTER" ---

ui.btnRun.addEventListener('click', async () => {
    // MODIFICATION ICI : On récupère le code via l'API de Monaco
    if (!editor) {
        terminalManager.write('Erreur : L\'éditeur n\'est pas encore chargé.\n', 'error');
        return;
    }
    
    const code = editor.getValue(); 
    
    // Vérifier si l'éditeur est vide
    if (!code.trim()) {
        terminalManager.write('Erreur : Aucun code à compiler !\n', 'error');
        return;
    }

    // Définir les chemins temporaires
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const sourcePath = path.join(tempDir, 'main.c');
    const exePath = path.join(tempDir, 'main.exe');

    // Étape A : Sauvegarder le code actuel
    ui.setLoading(true);
    terminalManager.clear();
    terminalManager.write('--- Nouvelle session de compilation ---\n', 'info');
    
    const saveResult = fileManager.saveFile(sourcePath, code);
    
    if (!saveResult.success) {
        terminalManager.write(`Erreur de sauvegarde : ${saveResult.message}\n`, 'error');
        ui.setLoading(false);
        return;
    }

    // Étape B : Compiler via le CompilerHandler
    terminalManager.write('Compilation en cours...\n', 'info');
    
    compiler.compile(sourcePath, exePath, (res) => {
        if (!res.success) {
            terminalManager.write('ERREUR GCC :\n', 'error');
            terminalManager.write(res.message + '\n', 'error');
            ui.setLoading(false);
        } else {
            // Étape C : Succès ! Lancer l'exécutable
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

// --- 4. RACCOURCIS CLAVIER ---

window.addEventListener('keydown', (e) => {
    if (e.key === 'F5') {
        ui.btnRun.click();
    }
});