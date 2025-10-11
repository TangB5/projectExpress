# 🛍 Memo-Backend (API E-commerce)

Ce projet est le backend d'une application e-commerce, construit avec Express.js et MongoDB, et déployé en tant que fonction Serverless sur Vercel. Il expose des API RESTful pour la gestion des produits, des utilisateurs, de l'authentification et des commandes.

## 🚀 Démarrer le Projet

Suivez ces étapes pour cloner le dépôt et lancer l'application en local.

### Prérequis

Assurez-vous d'avoir installé les éléments suivants :

* **Node.js** (version 18 ou supérieure)
* **npm** (npm est inclus avec Node.js)
* Un compte **MongoDB Atlas** (ou une instance MongoDB locale)

### Installation

1.  **Clonez le dépôt :**
    ```bash
    git clone [https://github.com/votre-utilisateur/memo-backend-sigma.git](https://github.com/votre-utilisateur/memo-backend-sigma.git)
    cd memo-backend-sigma
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Créez le fichier `.env` :**
    À la racine du projet, créez un fichier nommé `.env` et ajoutez vos variables d'environnement.

    ```dotenv
    # Configuration de la base de données
    MONGODB_URI="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/memo-ecommerce?retryWrites=true&w=majority"

    # Clé secrète pour les tokens JWT
    JWT_SECRET="votre_cle_secrete_tres_longue_et_complexe"

    # Port du serveur
    PORT=5000 
    
    # URL de votre frontend (pour les tests CORS en local)
    FRONTEND_URL="http://localhost:3001"
    ```

### Lancement en local

Lancez le serveur avec `nodemon` pour le rechargement automatique :

```bash
npm start
# ou directement
nodemon index.js