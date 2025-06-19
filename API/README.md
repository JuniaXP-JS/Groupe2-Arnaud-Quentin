# API Documentation

## 1. Introduction

**Nom du projet** : API
**Description** : Cette API permet de gérer les données GPS des appareils IoT. Elle inclut des fonctionnalités d'authentification, de gestion des utilisateurs et de récupération des données GPS.

---

## 2. Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Node.js** : Version recommandée >= 16.x
- **npm** ou **yarn** : Pour gérer les dépendances
- **MongoDB** : Base de données (si applicable)
- **Fichier `.env`** : Contient les variables d'environnement nécessaires (voir la section [Configuration](#4-configuration)).

---

## 3. Installation

Suivez ces étapes pour cloner et installer le projet :

```bash
# Clonez le dépôt
git clone git@github.com:Projet-IoT-REIN-Arnaud-DIMANCHE-Quentin/API.git

# Installez les dépendances
npm install
```

---

## 4. Configuration

Créez un fichier `.env` à la racine du projet et configurez les variables d'environnement nécessaires. Voici un exemple :

```env
# Exemple de fichier .env
PORT=3000
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
MONGO_URI=mongodb://localhost:27017/your_database
```

---

## 5. Lancer le projet

Démarrez le serveur en mode développement ou production :

```bash
# Lancer en mode développement
npm run dev

# Lancer en mode production
npm run build
npm start
```

---

## 6. Documentation Swagger

Accédez à la documentation Swagger pour explorer et tester les endpoints de l'API :

- **URL Swagger** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
- **Description** : Swagger fournit une interface interactive pour tester les endpoints directement.

---

## 7. Tests

Exécutez les tests unitaires et d'intégration pour vérifier le bon fonctionnement de l'API :

```bash
# Lancer les tests
npm run test
```

---

## 8. Endpoints principaux

Voici un aperçu des principaux endpoints de l'API :

### **Authentification**
- `POST /api/auth/login` : Authentification d'un utilisateur.
- `POST /api/auth/register` : Inscription d'un nouvel utilisateur.

### **Données GPS**
- `GET /api/gps/:imei` : Récupérer l'historique GPS d'un appareil.
- `POST /api/gps` : Ajouter de nouvelles données GPS.

---

## 9. Structure du projet

La structure des dossiers est organisée comme suit :

```
src/
├── config/          # Configuration (Swagger, Passport, etc.)
├── controllers/     # Logique métier des endpoints
├── middlewares/     # Middlewares (authentification, validation, etc.)
├── models/          # Modèles Mongoose
├── routes/          # Définition des routes
├── __tests__/       # Tests unitaires et d'intégration
├── __mocks__/       # Utilisés dans les tests unitaires pour remplacer des modules réels par des versions simulées
└── app.ts           # Point d'entrée de l'application
```

---

## 10. Contribution

Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour toute suggestion ou amélioration.