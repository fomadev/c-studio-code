/**
 * UIController - Gère les interactions visuelles de C Studio Code
 */
class UIController {
    constructor() {
        // Sélection des éléments clés
        this.btnRun = document.getElementById('btn-run');
        // Note: l'éditeur est désormais géré par Monaco dans renderer.js, 
        // nous gardons la référence au conteneur si besoin.
        this.editorContainer = document.getElementById('editor-container');
        this.fileList = document.getElementById('file-list');
        
        // Initialisation des tooltips (bulles d'aide)
        this.setupTooltips();
    }

    /**
     * Met à jour la liste des fichiers dans la sidebar
     * @param {Array} files - Liste des noms de fichiers
     */
    updateFileList(files) {
        this.fileList.innerHTML = '';
        
        if (!files || files.length === 0) {
            this.fileList.innerHTML = '<div class="file-item-empty">Aucun fichier</div>';
            return;
        }

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item';
            
            // ÉTAPE CRUCIALE : Stocke le nom du fichier pour renderer.js
            div.setAttribute('data-filename', file); 
            
            // Icônes personnalisées selon l'extension
            let icon = '📄'; // Par défaut .c
            if (file.endsWith('.h')) icon = '📑';
            if (file.endsWith('.cpp') || file.endsWith('.cc')) icon = '🔷';
            
            div.innerHTML = `<span>${icon} ${file}</span>`;
            this.fileList.appendChild(div);
        });
    }

    /**
     * Configuration des raccourcis et bulles d'aide
     */
    setupTooltips() {
        if (this.btnRun) {
            this.btnRun.title = "Compiler et Exécuter (F5)";
        }
    }

    /**
     * Affiche une barre de progression ou un indicateur de chargement
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.btnRun.innerHTML = "<span>⌛ Compilation...</span>";
            this.btnRun.disabled = true;
            this.btnRun.classList.add('loading');
        } else {
            this.btnRun.innerHTML = "<span>▶ Exécuter</span>";
            this.btnRun.disabled = false;
            this.btnRun.classList.remove('loading');
        }
    }
}

module.exports = new UIController();