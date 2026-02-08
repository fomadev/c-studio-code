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

    /**
     * Récupère le chemin complet et le contenu d'un fichier sélectionné
     */
    getFileFullData(fileName) {
        if (!this.currentProjectDir) return null;
        const filePath = path.join(this.currentProjectDir, fileName);
        const content = this.readFile(filePath);
        return { path: filePath, content: content };
    }

    /**
     * Crée un nouveau fichier sur le disque
     */
    createNewFile(fileName) {
        if (!this.currentProjectDir) return { success: false, message: "Aucun dossier ouvert" };
        
        const filePath = path.join(this.currentProjectDir, fileName);
        
        // Vérifier si le fichier existe déjà
        if (fs.existsSync(filePath)) {
            return { success: false, message: "Ce fichier existe déjà !" };
        }

        try {
            // Créer un fichier vide avec un petit template de base si c'est un .c
            const template = fileName.endsWith('.c') 
                ? '#include <stdio.h>\n\nint main() {\n    printf("Nouveau fichier C\\n");\n    return 0;\n}' 
                : '';
                
            fs.writeFileSync(filePath, template, 'utf8');
            return { success: true, path: filePath };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = new FileManager();