/**
 * ThemeLoader - Gère les thèmes et les futures extensions .csc
 */
class ThemeLoader {
    constructor() {
        this.themes = {
            'dark': {
                '--bg-dark': '#1e1e1e',
                '--bg-sidebar': '#252526',
                '--accent-color': '#007acc'
            },
            'unikin-blue': {
                '--bg-dark': '#0a192f',
                '--bg-sidebar': '#112240',
                '--accent-color': '#64ffda'
            }
        };
    }

    /**
     * Applique un thème en modifiant les variables CSS
     * @param {string} themeName 
     */
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        Object.keys(theme).forEach(property => {
            root.style.setProperty(property, theme[property]);
        });
        
        console.log(`Thème [${themeName}] appliqué avec succès.`);
    }

    /**
     * Future fonction pour charger un fichier .csc (extension compressée)
     */
    async loadExtensionFile(filePath) {
        // Logique de décompression et lecture du manifest.json
        // À implémenter dans la v1.1.0
        console.log("Chargement de l'extension :", filePath);
    }
}

module.exports = new ThemeLoader();