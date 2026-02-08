const { exec } = require('child_process');
const path = require('path');
const os = require('os');

class CompilerHandler {
    constructor() {
        this.platform = process.platform; // win32, linux, or darwin
        this.basePath = path.join(__dirname, '..', 'resources', 'compilers');
    }

    /**
     * Détermine le chemin du compilateur selon l'OS
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

        return path.join(binPath, executable);
    }

    /**
     * Prépare les arguments de compilation (Inclusion des headers communs)
     */
    getIncludeArgs() {
        const commonInclude = path.join(this.basePath, 'common', 'include');
        return `-I "${commonInclude}"`;
    }

    /**
     * Exécute la compilation
     * @param {string} sourceFile - Chemin du fichier .c ou .cpp
     * @param {string} outputFile - Chemin de l'exécutable à générer
     * @param {function} callback - Pour renvoyer le résultat (succès ou erreur)
     */
    compile(sourceFile, outputFile, callback) {
        const isCpp = sourceFile.endsWith('.cpp');
        const compiler = this.getCompilerPath(isCpp);
        const includes = this.getIncludeArgs();

        // Commande : gcc "source.c" -I "headers" -o "destination.exe"
        const command = `"${compiler}" "${sourceFile}" ${includes} -o "${outputFile}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                callback({ success: false, message: stderr || error.message });
            } else {
                callback({ success: true, message: "Compilation réussie !" });
            }
        });
    }

    /**
     * Lance l'exécutable généré
     */
    run(exePath, callback) {
        // Sur Windows, on lance directement. Sur Unix, on ajoute "./"
        const command = this.platform === 'win32' ? `"${exePath}"` : `./"${exePath}"`;
        
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