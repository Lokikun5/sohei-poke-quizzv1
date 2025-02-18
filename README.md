
# 🎮 Master Quizz Pokémon V1 - Association Sohei

Bienvenue dans **Master Quizz Pokémon**, un jeu de quiz basé sur l'univers Pokémon où vous devez retrouver un maximum de Pokémon en fonction de leur génération et de leur type.

## 🚀 Stack Technique

Ce projet est construit avec :
- ⚛ **React** (Vite)
- 🎨 **Sass** pour le stylisme
- 🛠 **React Router** pour la gestion des routes
- 📡 **PokéAPI** ([pokeapi.co](https://pokeapi.co/)) pour la récupération des données

---

## 🔧 Installation du Projet en Local

### **1️⃣ Pré-requis**
Avant d'installer le projet, assurez-vous d'avoir installé :
- **Node.js** (>= 16.x) ➝ [Téléchargement ici](https://nodejs.org/)
- **Git** ➝ [Téléchargement ici](https://git-scm.com/)

### **2️⃣ Cloner le projet**
Dans votre terminal, exécutez :

```sh
git clone https://github.com/votre-repo/master-quizz-pokemon.git
cd master-quizz-pokemon
```

### **3️⃣ Installer les dépendances**
```sh
npm install
```

### **4️⃣ Lancer le serveur de développement**
```sh
npm run dev
```

Le projet sera accessible à l'adresse **http://localhost:5173/**.

---

## 🎲 Règles du Jeu

- Une **génération** et un **type** de Pokémon sont choisis **aléatoirement**.
- Votre objectif est de **deviner tous les Pokémon correspondant** à ces critères.
- Les Pokémon **ne sont pas affichés au départ** (seulement le nombre total).
- Vous pouvez **cliquer sur un Pokémon** ou appuyer sur **`Y`** pour valider une bonne réponse.
- Une fois **toutes les bonnes réponses trouvées**, la liste des Pokémon s'affiche automatiquement.
- rafraîchir la page (f5) pour charger un nouveau résulta.

---

## ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `S`    | Afficher/Masquer les réponses |
| `Y`    | Valider une bonne réponse |
| `R`    | Relancer une nouvelle partie (si implémenté) |

---

## 🎤 Vue Présentateur

Une **vue dédiée** au présentateur permet d'afficher directement les réponses :

- Accès via **`/presentateur`** ou depuis le menu de navigation.
- Sélectionnez une **génération** et un **type** via des **menus déroulants**.
- La liste des Pokémon **s'affiche immédiatement** sans validation nécessaire.

---

## 📡 Source des Données

Toutes les données proviennent de **PokéAPI** :  
🔗 [https://pokeapi.co/](https://pokeapi.co/)

Merci aux créateurs de cette API pour leur travail incroyable !

---

## 💡 Améliorations futures

- ✅ Ajout d'un **système de score**.

- ✅ Effets sonores et animations pour une meilleure immersion.

---

**🚀 Attrapez-les tous et testez vos connaissances Pokémon !** 🎉  
💡 *Association Sohei* - *Master Quizz Pokémon V1*
```

---
