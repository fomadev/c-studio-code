const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class CompilerHandler {
    constructor() {
        this.platform = process.platform;
        // Chemin vers les compilateurs embarqués
        this.basePath = path.join(__dirname, '..', 'resources', 'compilers');
    }

    /**
     * Détermine le chemin du compilateur
     */
    getCompilerPath(isCpp = false) {
        let binPath = '';
        let executable = '';

        if (this.platform === 'win32') {
            binPath = path.join(this.basePath, 'win64', 'bin');
            executable = isCpp ? 'g++.exe' : 'gcc.exe';
        } else if (this.platform === 'linux') {
            binPath = path.join(this.basePath, 'linux', 'bin');
            executable = isCpp ? 'g++' : 'gcc';
        } else if (this.platform === 'darwin') {
            binPath = path.join(this.basePath, 'darwin', 'bin');
            executable = isCpp ? 'clang++' : 'clang';
        }

        const fullPath = path.join(binPath, executable);

        // --- AMÉLIORATION : Fallback ---
        // Si le compilateur n'est pas trouvé dans 'resources', on utilise celui du système (PATH)
        if (!fs.existsSync(fullPath)) {
            return isCpp ? (this.platform === 'darwin' ? 'clang++' : 'g++') : (this.platform === 'darwin' ? 'clang' : 'gcc');
        }

        return fullPath;
    }

    getIncludeArgs() {
        const commonInclude = path.join(this.basePath, 'common', 'include');
        // On ne rajoute l'argument que si le dossier existe
        if (fs.existsSync(commonInclude)) {
            return `-I "${commonInclude}"`;
        }
        return '';
    }

    /**
     * Compilation
     */
    compile(sourceFile, outputFile, callback) {
        const isCpp = sourceFile.endsWith('.cpp') || sourceFile.endsWith('.cc');
        const compiler = this.getCompilerPath(isCpp);
        const includes = this.getIncludeArgs();

        // Utilisation de guillemets pour gérer les espaces dans les chemins
        const command = `"${compiler}" "${sourceFile}" ${includes} -o "${outputFile}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                // On renvoie stderr car c'est là que GCC écrit les erreurs de syntaxe
                callback({ success: false, message: stderr || error.message });
            } else {
                callback({ success: true, message: "Compilation réussie !" });
            }
        });
    }

    /**
     * Exécution
     */
    run(exePath, callback) {
        // Validation : Vérifier si l'exécutable existe vraiment
        if (!fs.existsSync(exePath)) {
            return callback({ success: false, message: "Erreur : L'exécutable est introuvable." });
        }

        // Sur Unix, il faut parfois rendre le fichier exécutable
        const command = this.platform === 'win32' ? `"${exePath}"` : `chmod +x "${exePath}" && "${exePath}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                callback({ success: false, message: stderr || error.message });
            } else {
                callback({ success: true, message: stdout });
            }
        });
    }
}

module.exports = new CompilerHandler();