const fs = require('fs');
const path = require('path');
const { dialog } = require('electron').remote; // Nécessite 'remote' ou IPC, nous utiliserons une approche simple ici

class FileManager {
    constructor() {
        this.currentProjectDir = null;
    }

    /**
     * Ouvre une boîte de dialogue pour sélectionner un dossier de projet
     */
    async selectProjectDirectory() {
        // Note: Dans Electron moderne, on utilise souvent IPC, 
        // mais pour la v1, nous allons simuler ou utiliser le module 'fs'
        // pour scanner un chemin spécifique.
        return new Promise((resolve, reject) => {
            // Logique de sélection (pour la v1.0.0, on peut fixer un dossier par défaut)
            // ou utiliser l'API Electron via le processus principal
            resolve(this.currentProjectDir);
        });
    }

    /**
     * Lit le contenu du dossier actuel pour l'afficher dans la sidebar
     */
    getFilesInDirectory(dirPath) {
        if (!dirPath) return [];
        try {
            const files = fs.readdirSync(dirPath);
            // On ne garde que les fichiers C, C++ et Headers
            return files.filter(file => 
                file.endsWith('.c') || 
                file.endsWith('.cpp') || 
                file.endsWith('.h')
            );
        } catch (err) {
            console.error("Erreur de lecture dossier:", err);
            return [];
        }
    }

    /**
     * Sauvegarde le code dans un fichier
     */
    saveFile(filePath, content) {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    /**
     * Charge le contenu d'un fichier pour l'afficher dans l'éditeur
     */
    readFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (err) {
            return "";
        }
    }
}

module.exports = new FileManager();