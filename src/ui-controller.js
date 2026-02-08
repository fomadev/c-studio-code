/**
 * UIController - Gère les interactions visuelles de C Studio Code
 */
class UIController {
    constructor() {
        // Sélection des éléments clés
        this.btnRun = document.getElementById('btn-run');
        this.editorContainer = document.getElementById('editor-container');
        this.fileList = document.getElementById('file-list');
        
        // Initialisation des tooltips
        this.setupTooltips();
    }

    /**
     * Met à jour la liste des fichiers dans la sidebar
     * @param {Array} files - Liste des noms de fichiers
     */
    updateFileList(files) {
        if (!this.fileList) return;
        
        this.fileList.innerHTML = '';
        
        if (!files || files.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'file-item-empty';
            emptyDiv.style.padding = '10px';
            emptyDiv.style.fontSize = '12px';
            emptyDiv.style.color = '#858585';
            emptyDiv.innerText = 'Aucun fichier';
            this.fileList.appendChild(emptyDiv);
            return;
        }

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item';
            
            // Stocke le nom du fichier pour renderer.js
            div.setAttribute('data-filename', file); 
            
            // Détermination de l'icône
            let icon = '📄'; 
            if (file.endsWith('.h')) icon = '📑';
            if (file.endsWith('.cpp') || file.endsWith('.cc')) icon = '🔷';
            
            // STRUCTURE AMÉLIORÉE : On sépare l'icône du texte pour un alignement parfait
            div.innerHTML = `
                <span class="file-icon" style="margin-right: 8px; opacity: 0.8;">${icon}</span>
                <span class="file-name">${file}</span>
            `;

            this.fileList.appendChild(div);
        });
    }

    /**
     * Configuration des bulles d'aide
     */
    setupTooltips() {
        if (this.btnRun) {
            this.btnRun.title = "Compiler et Exécuter (F5)";
        }
    }

    /**
     * Affiche un indicateur de chargement sur le bouton
     */
    setLoading(isLoading) {
        if (!this.btnRun) return;

        if (isLoading) {
            this.btnRun.innerHTML = "<span>⌛ Compilation...</span>";
            this.btnRun.disabled = true;
            this.btnRun.style.opacity = "0.7";
            this.btnRun.style.cursor = "not-allowed";
        } else {
            // On remet l'icône et le texte original
            this.btnRun.innerHTML = "▶ Exécuter";
            this.btnRun.disabled = false;
            this.btnRun.style.opacity = "1";
            this.btnRun.style.cursor = "pointer";
        }
    }
}

module.exports = new UIController();