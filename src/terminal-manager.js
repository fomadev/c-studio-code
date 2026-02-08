const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');

class TerminalManager {
    constructor() {
        this.terminal = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#000000',
                foreground: '#ffffff',
                cursor: '#00ff00',
                selectionBackground: '#5c5c5c'
            },
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            convertEol: true // Important pour que \n fonctionne correctement
        });

        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
    }

    /**
     * Initialise le terminal dans l'élément HTML
     * @param {HTMLElement} container - Le div qui va contenir le terminal
     */
    init(container) {
        this.terminal.open(container);
        this.fitAddon.fit();

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.fitAddon.fit();
        });

        this.write('--- C Studio Code Terminal Ready ---\n', 'success');
    }

    /**
     * Écrit dans le terminal avec des couleurs
     * @param {string} text 
     * @param {string} type - 'info', 'success', 'error', 'warning'
     */
    write(text, type = 'info') {
        const colors = {
            info: '\x1b[37m',    // Blanc
            success: '\x1b[32m', // Vert
            error: '\x1b[31m',   // Rouge
            warning: '\x1b[33m'  // Jaune
        };
        const reset = '\x1b[0m';
        
        this.terminal.write(`${colors[type]}${text}${reset}`);
    }

    clear() {
        this.terminal.clear();
    }
}

module.exports = new TerminalManager();