const fs = require('fs');
const path = require('path');

class FileManager {
    constructor() {
        this.currentProjectDir = null;
    }

    /**
     * Ouvre une boîte de dialogue pour sélectionner un dossier de projet
     * Note: Dans les versions récentes d'Electron, cette logique est gérée via IPC 
     * dans le processus main.js
     */
    async selectProjectDirectory() {
        return new Promise((resolve, reject) => {
            // Renvoie le dossier actuel ou null si non défini
            resolve(this.currentProjectDir);
        });
    }

    /**
     * Lit le contenu du dossier actuel pour l'afficher dans la sidebar
     * Version robuste avec vérification du type d'objet (fichier vs dossier)
     */
    getFilesInDirectory(dirPath) {
        if (!dirPath) return [];
        
        this.currentProjectDir = dirPath; // Mémorisation du dossier actuel

        try {
            const items = fs.readdirSync(dirPath);
            
            // On ne garde que les fichiers (pas les dossiers) C, C++ et Headers
            return items.filter(file => {
                try {
                    const fullPath = path.join(dirPath, file);
                    const stat = fs.statSync(fullPath);
                    
                    return stat.isFile() && (
                        file.endsWith('.c') || 
                        file.endsWith('.cpp') || 
                        file.endsWith('.h')
                    );
                } catch (e) {
                    return false; // Ignorer les fichiers inaccessibles
                }
            });
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
            console.error("Erreur de lecture fichier:", err);
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
     * Crée un nouveau fichier sur le disque avec un template de base
     */
    createNewFile(fileName) {
        if (!this.currentProjectDir) {
            return { success: false, message: "Aucun dossier projet ouvert" };
        }
        
        const filePath = path.join(this.currentProjectDir, fileName);
        
        // Vérifier si le fichier existe déjà
        if (fs.existsSync(filePath)) {
            return { success: false, message: "Ce fichier existe déjà !" };
        }

        try {
            // Template de base pour les nouveaux fichiers C
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

// Export d'une instance unique (Singleton)
module.exports = new FileManager();