const path = require('path');
const fs = require('fs');

// Importation de nos modules personnalisés
const compiler = require('./src/compiler-handler');
const ui = require('./src/ui-controller');
const fileManager = require('./src/file-manager');
const terminalManager = require('./src/terminal-manager');

// 1. Initialiser le terminal au démarrage
const terminalContainer = document.getElementById('terminal-container');
terminalManager.init(terminalContainer);

// Message d'accueil pour les étudiants
terminalManager.write('Bienvenue dans C Studio Code (UNIKIN v1.0.0)\n', 'success');
terminalManager.write('Prêt pour la compilation C/C++.\n\n', 'info');

// 2. Gestion du bouton "Exécuter" (Compiler & Lancer)
ui.btnRun.addEventListener('click', async () => {
    const code = ui.editor.value;
    
    // Vérifier si l'éditeur est vide
    if (!code.trim()) {
        terminalManager.write('Erreur : Aucun code à compiler !\n', 'error');
        return;
    }

    // Définir les chemins temporaires
    // On crée un dossier 'temp' s'il n'existe pas
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
            // Afficher l'erreur GCC dans le terminal
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
                    // Afficher le résultat du programme de l'étudiant
                    terminalManager.write(runRes.message + '\n', 'info');
                }
                terminalManager.write('\n---------------------------\n', 'info');
                terminalManager.write('Fin du programme.\n', 'success');
                ui.setLoading(false);
            });
        }
    });
});

// 3. Raccourcis clavier (F5 pour compiler)
window.addEventListener('keydown', (e) => {
    if (e.key === 'F5') {
        ui.btnRun.click();
    }
});