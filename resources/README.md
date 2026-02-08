# 🛠️ Ressources des Compilateurs - C Studio Code

Ce dossier contient les binaires et les bibliothèques nécessaires pour permettre à **C Studio Code** de compiler du code C et C++ sans exiger que l'étudiant installe manuellement un compilateur sur son système.

> **Note :** Pour garder le dépôt GitHub léger, les fichiers exécutables (.exe) et les grosses bibliothèques (.a, .lib) ne sont pas suivis par Git. Ce guide explique comment reconstituer la structure.

---

## 📂 Arborescence Requise

Pour que l'IDE fonctionne, vous devez respecter la structure suivante dans votre environnement local :

### 1. Partie Commune (`/compilers/common/`)
Contient les fichiers qui ne dépendent pas de l'architecture processeur.
- `include/` : Copiez ici tous les headers standards (ex: `stdio.h`, `math.h`, `stdlib.h`, `string.h`).
- `share/` : Documentation, locales et données partagées par GCC.
- `src/` : Sources optionnelles ou scripts de configuration.

### 2. Windows 64-bit (`/compilers/win64/`)
Utilise la distribution **w64devkit** ou **MinGW-w64** (Version GCC 15.2.0 testée).
- `bin/` : Doit contenir `gcc.exe`, `g++.exe`, `make.exe`, `as.exe`, `ld.exe`.
- `lib/` : Bibliothèques de liaison statiques.
- `libexec/` : Composants internes critiques (ex: `cc1.exe`, `cc1plus.exe`).
  - *Structure spécifique constatée :* `libexec/gcc/x86_64-w64-mingw32/15.2.0/`

### 3. Linux & MacOS (`/linux/` & `/darwin/`)
- *Prévus pour les versions v1.1.0 et supérieures.*
- Devront contenir les binaires ELF (Linux) ou Mach-O (Mac) correspondants.

---

## 🚀 Comment remplir ces dossiers ? (Installation Manuelle)

Si vous clonez ce projet et que les dossiers sont vides :

1. **Téléchargez** une version portable de GCC pour Windows (Recommandé : [w64devkit](https://github.com/skeeto/w64devkit/releases)).
2. **Extrayez** le contenu.
3. **Copiez** les fichiers vers les destinations suivantes :
   - Les fichiers du dossier `bin` du compilateur vers `resources/compilers/win64/bin/`.
   - Les fichiers du dossier `libexec` vers `resources/compilers/win64/libexec/`.
   - Les fichiers du dossier `include` vers `resources/compilers/common/include/`.

---

## ⚙️ Configuration du compilateur dans l'IDE

L'IDE appelle le compilateur en utilisant des chemins relatifs basés sur cette structure :
- **Windows :** `resources/compilers/win64/bin/gcc.exe`
- **Arguments par défaut :** `-I "../common/include"` (pour forcer l'usage des headers locaux).

---
*Projet développé au sein de <a href="https://github.com/fomadev">FomaDev</a>  - Faculté des Sciences (Math-Info)*