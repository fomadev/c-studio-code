/**
 * UIController - Gère les interactions visuelles de C Studio Code
 */
class UIController {
    constructor() {
        // Sélection des éléments clés
        this.btnRun = document.getElementById('btn-run');
        this.editor = document.getElementById('code-editor');
        this.outputArea = document.getElementById('output');
        this.fileList = document.getElementById('file-list');
        
        // Initialisation des tooltips (bulles d'aide)
        this.setupTooltips();
    }

    /**
     * Affiche un message dans le terminal de l'IDE
     * @param {string} text - Le texte à afficher
     * @param {string} type - 'info', 'success', ou 'error'
     */
    logToTerminal(text, type = 'info') {
        const colors = {
            info: '#d4d4d4',    // Gris clair
            success: '#4ec9b0', // Vert émeraude
            error: '#f44747'    // Rouge vif
        };

        const timestamp = new Date().toLocaleTimeString('fr-FR');
        const formattedText = `[${timestamp}] ${text}\n`;
        
        this.outputArea.innerText += formattedText;
        this.outputArea.style.color = colors[type];
        
        // Auto-scroll vers le bas
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }

    /**
     * Efface le contenu du terminal
     */
    clearTerminal() {
        this.outputArea.innerText = '';
    }

    /**
     * Met à jour la liste des fichiers dans la sidebar
     * @param {Array} files - Liste des noms de fichiers
     */
    updateFileList(files) {
        this.fileList.innerHTML = '';
        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item';
            // Icône simple selon l'extension
            const icon = file.endsWith('.c') ? '📄' : '⚙️';
            div.innerHTML = `<span>${icon} ${file}</span>`;
            this.fileList.appendChild(div);
        });
    }

    /**
     * Configuration des raccourcis et bulles d'aide
     */
    setupTooltips() {
        // Exemple : quand on survole le bouton Run
        this.btnRun.title = "Compiler et Exécuter (F5)";
    }

    /**
     * Affiche une barre de progression ou un indicateur de chargement
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.btnRun.innerText = "⌛ Compilation...";
            this.btnRun.disabled = true;
        } else {
            this.btnRun.innerText = "▶ Compiler & Exécuter";
            this.btnRun.disabled = false;
        }
    }
}

module.exports = new UIController();