# React-App

## 1. Introduction

- **Nom du projet** : React-App
- **Description** : Cette application React permet d'afficher des données GPS sur des interfaces interactives. Elle inclut des fonctionnalités d'authentification, de gestion des utilisateurs, et d'affichage des données en temps réel ou historiques. L'interface utilisateur est construite avec `shadcn/ui` pour une expérience moderne et réactive.

---

## 2. Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Node.js** : Version recommandée >= 16.x  
- **npm** ou **yarn** : Pour gérer les dépendances  
- **Fichier `.env`** : Contient les variables d'environnement nécessaires (voir la section [Configuration](#4-configuration)).

---

## 3. Installation

Suivez ces étapes pour cloner et installer le projet :

```bash
# Clonez le dépôt
git clone git@github.com:Projet-IoT-REIN-Arnaud-DIMANCHE-Quentin/React-App.git

# Installez les dépendances
npm install
```

---

## 4. Configuration

Créez un fichier `.env` à la racine du projet et configurez les variables d'environnement nécessaires. Voici un exemple :

```env
# Exemple de fichier .env
VITE_MAPBOX_KEY=pk.eyJ1IjoicWRpbWFuY2hdfdffddaivDPn7NOAyieVOrTRoFFTA
VITE_API_URL=http://localhost:3000
```

---

## 5. Lancer le projet

Démarrez l'application en mode développement ou production :

```bash
# Lancer en mode développement
npm run dev

# Lancer en mode production
npm run build
npm run preview
```

---

## 6. Fonctionnalités principales

### Authentification
- Connexion et inscription des utilisateurs.
- Gestion des sessions utilisateur avec un contexte React.

### Données GPS
- Affichage des données GPS en temps réel sur une carte interactive (Mapbox).
- Historique des positions GPS.

### Interface utilisateur
- Interface moderne et réactive grâce à `shadcn/ui`.

---

## 7. Tests

Exécutez les tests unitaires pour vérifier le bon fonctionnement de l'application :

```bash
# Lancer les tests
npm run test

# Lancer les tests en mode surveillance
npm run test:watch
```

---

## 8. Structure du projet

La structure des dossiers est organisée comme suit :

```
src/
├── auth/             # Composants et hooks liés à l'authentification
├── components/       # Composants réutilisables (UI, cartes, etc.)
├── contexts/         # Contextes React (par exemple, `session.ts` pour la gestion des sessions utilisateur)
├── pages/            # Pages principales de l'application
├── router/           # Configuration des routes
├── styles/           # Fichiers CSS et Tailwind
├── __tests__/        # Tests unitaires et d'intégration
└── main.tsx          # Point d'entrée de l'application
```
```

---

## 9. Technologies utilisées

- **React** : Bibliothèque JavaScript pour construire l'interface utilisateur.  
- **TypeScript** : Typage statique pour un code plus robuste.  
- **Vite** : Outil de build rapide pour les projets modernes.  
- **Mapbox GL** : Affichage des données GPS sur une carte interactive.  
- **shadcn/ui** : Composants UI modernes et accessibles.  
- **React Router** : Gestion des routes de l'application.  
- **Tailwind CSS** : Framework CSS utilitaire pour le style.

---

## 10. Contribution

Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour toute suggestion ou amélioration.