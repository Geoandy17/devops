# 📝 Guide Complet : Maîtriser les Dockerfiles

## 📚 Table des Matières

1. [Qu'est-ce qu'un Dockerfile ?](#quest-ce-quun-dockerfile-)
2. [Anatomie d'un Dockerfile](#anatomie-dun-dockerfile)
3. [Les Instructions Essentielles](#les-instructions-essentielles)
4. [Le Système de Couches](#le-système-de-couches)
5. [L'Ordre des Instructions](#lordre-des-instructions)
6. [Optimiser le Cache Docker](#optimiser-le-cache-docker)
7. [Exemples Pratiques](#exemples-pratiques)
8. [Bonnes Pratiques](#bonnes-pratiques)
9. [Exercices](#exercices)

---

## Qu'est-ce qu'un Dockerfile ? 🤔

### Définition Simple

Un **Dockerfile** est un fichier texte qui contient **la recette** pour construire une image Docker.

```
Dockerfile (recette)  →  docker build  →  Image Docker
```

### Analogie : La Recette de Cuisine

```
📄 Recette de Gâteau (Dockerfile)
├─ Ingrédients : farine, œufs, sucre (FROM, COPY)
├─ Étapes : mélanger, cuire (RUN)
└─ Servir (CMD)
      ⬇️
🎂 Gâteau prêt (Image Docker)
```

### Caractéristiques

- ✅ Fichier texte simple (pas d'extension ou `.dockerfile`)
- ✅ Nommé exactement `Dockerfile` (avec un D majuscule)
- ✅ Placé à la racine de votre projet
- ✅ Une instruction par ligne
- ✅ Commentaires avec `#`

---

## Anatomie d'un Dockerfile 🔬

### Structure de Base

```dockerfile
# Commentaire : ceci est ignoré

# 1. IMAGE DE BASE (obligatoire, toujours en premier)
FROM node:18-alpine

# 2. INFORMATIONS (optionnel)
LABEL maintainer="vous@email.com"

# 3. VARIABLES D'ENVIRONNEMENT (optionnel)
ENV NODE_ENV=production

# 4. RÉPERTOIRE DE TRAVAIL (recommandé)
WORKDIR /app

# 5. COPIE DE FICHIERS
COPY package.json .

# 6. EXÉCUTION DE COMMANDES
RUN npm install

# 7. COPIE DU CODE
COPY . .

# 8. EXPOSITION DE PORT (informatif)
EXPOSE 3000

# 9. UTILISATEUR (sécurité)
USER node

# 10. COMMANDE DE DÉMARRAGE (obligatoire)
CMD ["npm", "start"]
```

---

## Les Instructions Essentielles 📖

### 1. FROM - Image de Base

**Rôle :** Définit l'image de base à partir de laquelle construire.

**Syntaxe :**

```dockerfile
FROM <image>:<tag>
```

**Exemples :**

```dockerfile
# Node.js version 18 (légère)
FROM node:18-alpine

# Python 3.11
FROM python:3.11-slim

# Ubuntu 22.04
FROM ubuntu:22.04

# Nginx
FROM nginx:alpine
```

**📌 Règles :**

- ✅ **TOUJOURS la première instruction** (sauf commentaires)
- ✅ Utilisez des tags spécifiques (`18-alpine` plutôt que `latest`)
- ✅ Préférez les versions `-alpine` (plus légères)

**Comparaison de tailles :**

```dockerfile
FROM node:18        # 950 MB  😱
FROM node:18-slim   # 240 MB  😊
FROM node:18-alpine # 180 MB  ✅ PRÉFÉRÉ
```

---

### 2. WORKDIR - Répertoire de Travail

**Rôle :** Définit le dossier de travail dans le conteneur.

**Syntaxe :**

```dockerfile
WORKDIR /chemin/vers/dossier
```

**Exemples :**

```dockerfile
# Se placer dans /app
WORKDIR /app

# Créer des sous-dossiers
WORKDIR /app/backend
```

**Ce qui se passe :**

```dockerfile
WORKDIR /app
# = cd /app
# Si le dossier n'existe pas, il est créé automatiquement
```

**📌 Règles :**

- ✅ Toujours utiliser des chemins absolus (`/app` pas `app`)
- ✅ Mettez-le tôt dans le Dockerfile
- ✅ Tous les `COPY`, `RUN`, `CMD` suivants l'utiliseront

---

### 3. COPY - Copier des Fichiers

**Rôle :** Copie des fichiers/dossiers de votre machine vers l'image.

**Syntaxe :**

```dockerfile
COPY <source> <destination>
```

**Exemples :**

```dockerfile
# Copier un fichier
COPY package.json /app/

# Copier tout le dossier actuel
COPY . /app/

# Si WORKDIR est défini, destination relative
WORKDIR /app
COPY package.json .        # → copie vers /app/package.json
COPY . .                    # → copie tout vers /app/

# Copier plusieurs fichiers
COPY file1.txt file2.txt ./

# Copier avec pattern
COPY *.json ./
```

**📌 Règles :**

- ✅ Le chemin source est **relatif au contexte de build** (dossier où vous faites `docker build`)
- ✅ Utilisez `.dockerignore` pour exclure des fichiers
- ❌ Ne copiez JAMAIS `node_modules/`, `.git/`, etc.

---

### 4. ADD - Copier avec Fonctionnalités Extra

**Rôle :** Comme `COPY` mais peut télécharger des URLs et décompresser des archives.

**Syntaxe :**

```dockerfile
ADD <source> <destination>
```

**Exemples :**

```dockerfile
# Télécharger un fichier
ADD https://example.com/file.tar.gz /tmp/

# Extraire automatiquement une archive
ADD archive.tar.gz /app/
```

**📌 Règles :**

- ⚠️ **Préférez COPY** dans 99% des cas
- ✅ Utilisez ADD uniquement si vous avez besoin de :
  - Télécharger une URL
  - Extraire une archive tar/gzip automatiquement

---

### 5. RUN - Exécuter des Commandes

**Rôle :** Exécute une commande **pendant la construction** de l'image.

**Syntaxe :**

```dockerfile
RUN <commande>
```

**Exemples :**

```dockerfile
# Installer des dépendances npm
RUN npm install

# Installer des packages système (Alpine)
RUN apk add --no-cache curl git

# Installer des packages système (Ubuntu/Debian)
RUN apt-get update && apt-get install -y curl

# Créer un utilisateur
RUN adduser -D myuser

# Compiler du code
RUN npm run build

# Plusieurs commandes (avec &&)
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean
```

**📌 Règles :**

- ✅ Chaque `RUN` crée une nouvelle couche
- ✅ Combinez les commandes avec `&&` pour réduire les couches
- ✅ Nettoyez dans la même instruction :

**❌ Mauvais :**

```dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean
# = 3 couches
```

**✅ Bon :**

```dockerfile
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# = 1 seule couche !
```

---

### 6. ENV - Variables d'Environnement

**Rôle :** Définit des variables d'environnement dans l'image.

**Syntaxe :**

```dockerfile
ENV <clé>=<valeur>
ENV <clé1>=<valeur1> <clé2>=<valeur2>
```

**Exemples :**

```dockerfile
# Une variable
ENV NODE_ENV=production

# Plusieurs variables
ENV PORT=3000 \
    DB_HOST=localhost \
    API_KEY=secret

# Utiliser une variable dans le Dockerfile
ENV APP_DIR=/app
WORKDIR $APP_DIR
```

**📌 Règles :**

- ✅ Disponibles pendant le build ET dans le conteneur
- ✅ Peuvent être surchargées au lancement : `docker run -e PORT=8080`
- ⚠️ NE PAS mettre de secrets ici (utilisez des secrets Docker)

---

### 7. ARG - Arguments de Build

**Rôle :** Définit des variables **uniquement pendant le build**.

**Syntaxe :**

```dockerfile
ARG <nom>[=<valeur par défaut>]
```

**Exemples :**

```dockerfile
# Définir un argument
ARG NODE_VERSION=18

# Utiliser l'argument
FROM node:${NODE_VERSION}-alpine

# Avec valeur par défaut
ARG APP_PORT=3000
ENV PORT=${APP_PORT}
```

**Utilisation :**

```bash
# Build avec valeur par défaut
docker build -t monapp .

# Build avec valeur personnalisée
docker build --build-arg NODE_VERSION=20 -t monapp .
```

**📌 Différence ENV vs ARG :**

|                                  | ARG    | ENV    |
| -------------------------------- | ------ | ------ |
| **Disponible pendant le build**  | ✅ Oui | ✅ Oui |
| **Disponible dans le conteneur** | ❌ Non | ✅ Oui |
| **Peut être changé au build**    | ✅ Oui | ❌ Non |
| **Peut être changé au run**      | ❌ Non | ✅ Oui |

---

### 8. EXPOSE - Exposer un Port

**Rôle :** Indique quel port l'application utilise (documentation).

**Syntaxe :**

```dockerfile
EXPOSE <port>
```

**Exemples :**

```dockerfile
# Port HTTP
EXPOSE 80

# Port Node.js
EXPOSE 3000

# Plusieurs ports
EXPOSE 3000 5000 8080
```

**📌 Règles :**

- ⚠️ **N'expose PAS réellement le port** (juste informatif)
- ✅ Pour exposer réellement : `docker run -p 3000:3000`
- ✅ Bonne pratique de le mettre quand même

---

### 9. VOLUME - Points de Montage

**Rôle :** Définit un point de montage pour les données persistantes.

**Syntaxe :**

```dockerfile
VOLUME ["/chemin"]
```

**Exemples :**

```dockerfile
# Dossier de données
VOLUME ["/data"]

# Logs
VOLUME ["/var/log"]

# Base de données PostgreSQL
VOLUME ["/var/lib/postgresql/data"]
```

**📌 Règles :**

- ✅ Les données dans un volume **survivent** à la suppression du conteneur
- ✅ Utile pour bases de données, uploads, logs
- ⚠️ Souvent mieux géré avec `docker-compose.yml`

---

### 10. USER - Utilisateur d'Exécution

**Rôle :** Définit l'utilisateur qui exécute les commandes.

**Syntaxe :**

```dockerfile
USER <utilisateur>
```

**Exemples :**

```dockerfile
# Utiliser l'utilisateur non-root "node" (dans l'image node)
USER node

# Créer et utiliser un utilisateur personnalisé
RUN adduser -D appuser
USER appuser
```

**📌 Règles :**

- ✅ **TOUJOURS utiliser un utilisateur non-root en production** (sécurité)
- ✅ Mettez cette instruction AVANT le `CMD`
- ❌ Par défaut, Docker utilise `root` (dangereux)

**Exemple complet :**

```dockerfile
FROM node:18-alpine

# Créer un groupe et utilisateur
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Utiliser l'utilisateur non-root
USER appuser

CMD ["npm", "start"]
```

---

### 11. CMD - Commande par Défaut

**Rôle :** Définit la commande à exécuter **au démarrage du conteneur**.

**Syntaxe :**

```dockerfile
# Format exec (recommandé)
CMD ["executable", "param1", "param2"]

# Format shell
CMD commande param1 param2
```

**Exemples :**

```dockerfile
# Démarrer une app Node.js
CMD ["node", "server.js"]

# Avec npm
CMD ["npm", "start"]

# Python
CMD ["python", "app.py"]

# Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**📌 Règles :**

- ✅ **Un seul CMD par Dockerfile** (le dernier gagne)
- ✅ Préférez le format JSON `["cmd", "arg"]`
- ✅ Peut être surchargé : `docker run monimage python autre.py`

---

### 12. ENTRYPOINT - Point d'Entrée

**Rôle :** Définit l'exécutable principal du conteneur.

**Syntaxe :**

```dockerfile
ENTRYPOINT ["executable", "param1"]
```

**Exemples :**

```dockerfile
# Script d'initialisation
ENTRYPOINT ["docker-entrypoint.sh"]

# Application
ENTRYPOINT ["node", "server.js"]
```

**📌 Différence ENTRYPOINT vs CMD :**

```dockerfile
# Avec CMD
CMD ["echo", "Hello"]
docker run monimage              # → echo Hello
docker run monimage echo World   # → echo World (remplace CMD)

# Avec ENTRYPOINT
ENTRYPOINT ["echo"]
CMD ["Hello"]
docker run monimage              # → echo Hello
docker run monimage World        # → echo World (complète ENTRYPOINT)
```

**Usage combiné (pratique courante) :**

```dockerfile
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]

# Permet de lancer des scripts d'init avant la commande
```

---

### 13. HEALTHCHECK - Vérification de Santé

**Rôle :** Définit comment vérifier si le conteneur est en bonne santé.

**Syntaxe :**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD <commande>
```

**Exemples :**

```dockerfile
# Vérifier un endpoint HTTP
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Pour Node.js sans curl
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# PostgreSQL
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres
```

**📌 Options :**

- `--interval` : Temps entre chaque check (30s par défaut)
- `--timeout` : Temps max d'attente (30s par défaut)
- `--start-period` : Délai avant le premier check (0s par défaut)
- `--retries` : Nombre d'échecs avant "unhealthy" (3 par défaut)

---

## Le Système de Couches 🎂

### Comment Ça Marche ?

Chaque instruction du Dockerfile crée une **couche** (layer) dans l'image.

```dockerfile
FROM node:18-alpine      # Couche 1 (base)
WORKDIR /app             # Couche 2
COPY package.json .      # Couche 3
RUN npm install          # Couche 4 ← La plus grosse !
COPY . .                 # Couche 5
CMD ["npm", "start"]     # Couche 6
```

### Visualiser les Couches

```bash
# Voir l'historique des couches
docker history mon-backend:v1
```

**Résultat :**

```
IMAGE          CREATED BY                              SIZE
abc123         CMD ["npm" "start"]                     0B
def456         COPY . .                                2.5MB
ghi789         RUN npm install                         45MB  ← Gros !
jkl012         COPY package.json .                     1.2kB
mno345         WORKDIR /app                            0B
pqr678         FROM node:18-alpine                     180MB
```

### Pourquoi C'est Important ?

#### 1. Cache Docker

Docker met en **cache** chaque couche. Si une couche n'a pas changé, il la réutilise !

**Exemple :**

```dockerfile
COPY package.json .     # Couche mise en cache
RUN npm install         # Couche mise en cache (si package.json n'a pas changé)
COPY . .                # Couche reconstruite (code a changé)
```

**Résultat :**

- 1er build : 2 minutes
- 2ème build : 5 secondes (grâce au cache !)

#### 2. Taille de l'Image

Chaque couche ajoute de la taille. Combinez les commandes pour réduire :

**❌ Mauvais (3 couches) :**

```dockerfile
RUN apt-get update           # Couche 1: +50MB
RUN apt-get install -y curl  # Couche 2: +10MB
RUN apt-get clean            # Couche 3: 0MB (n'efface pas les couches précédentes !)
# Total: 60MB
```

**✅ Bon (1 couche) :**

```dockerfile
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Total: 10MB seulement !
```

---

## L'Ordre des Instructions 📋

### Ordre Optimal (du plus stable au plus changeant)

```dockerfile
# 1. IMAGE DE BASE (change rarement)
FROM node:18-alpine

# 2. MÉTADONNÉES (change rarement)
LABEL maintainer="vous@email.com"

# 3. VARIABLES (change rarement)
ENV NODE_ENV=production

# 4. PACKAGES SYSTÈME (change rarement)
RUN apk add --no-cache curl

# 5. RÉPERTOIRE DE TRAVAIL
WORKDIR /app

# 6. FICHIERS DE DÉPENDANCES (change moyennement)
COPY package*.json ./

# 7. INSTALLATION DES DÉPENDANCES (lourd, on veut le cacher)
RUN npm ci --only=production

# 8. CODE SOURCE (change souvent)
COPY . .

# 9. BUILD (si nécessaire)
RUN npm run build

# 10. UTILISATEUR (sécurité)
USER node

# 11. PORT
EXPOSE 3000

# 12. HEALTHCHECK
HEALTHCHECK CMD node -e "require('http').get('http://localhost:3000/health')"

# 13. COMMANDE DE DÉMARRAGE
CMD ["npm", "start"]
```

### Pourquoi Cet Ordre ?

**Principe :** Mettez les instructions qui changent RAREMENT en haut, et celles qui changent SOUVENT en bas.

```
Plus l'instruction est haute
        ↓
Plus elle est mise en cache
        ↓
Plus le build est rapide
```

---

## Optimiser le Cache Docker 🚀

### Stratégie : Séparer Dépendances et Code

**❌ Mauvais (invalide le cache à chaque changement de code) :**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .                    # Copie TOUT (code + package.json)
RUN npm install             # Réinstalle TOUT à chaque changement
CMD ["npm", "start"]
```

**Problème :** Si vous modifiez UNE ligne de code, `npm install` est relancé (2 minutes) !

**✅ Bon (cache optimisé) :**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./       # Copie SEULEMENT les fichiers de dépendances
RUN npm install             # Installé UNE FOIS, puis mis en cache
COPY . .                    # Copie le code APRÈS
CMD ["npm", "start"]
```

**Avantage :** Si vous modifiez le code, `npm install` n'est PAS relancé (cache) !

### Résultat

```
1er build : 120 secondes
2ème build (code modifié) : 5 secondes ✅
```

---

## Exemples Pratiques 💻

### Exemple 1 : Backend Node.js Simple

```dockerfile
# Image de base légère
FROM node:18-alpine

# Métadonnées
LABEL maintainer="vous@email.com"
LABEL version="1.0"

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (production seulement)
RUN npm ci --only=production

# Copier le code source
COPY . .

# Créer un utilisateur non-root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Commande de démarrage
CMD ["node", "server.js"]
```

### Exemple 2 : Frontend Next.js (Multi-Stage)

```dockerfile
# ============================================
# STAGE 1 : BUILD
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier le code et builder
COPY . .
RUN npm run build

# ============================================
# STAGE 2 : PRODUCTION
# ============================================
FROM node:18-alpine AS runner

WORKDIR /app

# Créer utilisateur
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier seulement ce qui est nécessaire depuis le builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]
```

**Avantage du Multi-Stage :**

- Stage 1 (builder) : 600 MB
- Stage 2 (runner) : 200 MB ✅ (plus léger !)

### Exemple 3 : Python Flask

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copier requirements et installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Créer utilisateur
RUN useradd -m -u 1000 flaskuser && \
    chown -R flaskuser:flaskuser /app
USER flaskuser

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

CMD ["flask", "run", "--host=0.0.0.0"]
```

### Exemple 4 : Base de Données (PostgreSQL Custom)

```dockerfile
FROM postgres:15-alpine

# Variables d'environnement
ENV POSTGRES_DB=mydb
ENV POSTGRES_USER=admin

# Copier les scripts d'initialisation
COPY init-scripts/ /docker-entrypoint-initdb.d/

# Copier une configuration personnalisée
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Exposer le port
EXPOSE 5432

# Volume pour les données
VOLUME ["/var/lib/postgresql/data"]

# Utiliser la config personnalisée
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
```

---

## Bonnes Pratiques 🌟

### 1. Utilisez des Images Légères

```dockerfile
# ❌ Évitez
FROM node:18           # 950 MB

# ✅ Préférez
FROM node:18-alpine    # 180 MB
```

### 2. Un Processus par Conteneur

```
✅ Bon : 1 conteneur = 1 service
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Nginx   │  │  Node.js │  │ Postgres │
└──────────┘  └──────────┘  └──────────┘

❌ Mauvais : Tout dans 1 conteneur
┌────────────────────────────┐
│  Nginx + Node.js + Postgres│
└────────────────────────────┘
```

### 3. Utilisez .dockerignore

Créez un fichier `.dockerignore` :

```
# .dockerignore
node_modules/
npm-debug.log
.git/
.env
.DS_Store
*.md
.vscode/
dist/
coverage/
```

### 4. Ne Stockez PAS de Secrets

```dockerfile
# ❌ JAMAIS ça
ENV API_KEY=supersecret123
ENV DB_PASSWORD=motdepasse

# ✅ À la place, passez au runtime
docker run -e API_KEY=secret monapp
```

### 5. Combinez les Commandes RUN

```dockerfile
# ❌ Mauvais (3 couches)
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# ✅ Bon (1 couche)
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 6. Utilisez des Tags Spécifiques

```dockerfile
# ❌ Évitez
FROM node:latest

# ✅ Préférez
FROM node:18.17.1-alpine
```

### 7. Copiez les Dépendances Avant le Code

```dockerfile
# ✅ Ordre optimal pour le cache
COPY package*.json ./
RUN npm install
COPY . .
```

### 8. N'utilisez PAS Root

```dockerfile
# ✅ Toujours créer/utiliser un utilisateur non-root
RUN adduser -D myuser
USER myuser
```

### 9. Nettoyez dans la Même Couche

```dockerfile
# ❌ Mauvais (le nettoyage ne réduit pas la taille)
RUN apt-get update
RUN apt-get install -y package
RUN apt-get clean

# ✅ Bon (tout dans une couche)
RUN apt-get update && \
    apt-get install -y package && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 10. Utilisez HEALTHCHECK

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/health || exit 1
```

---

## Exercices 🏋️

### Exercice 1 : Dockerfile Simple

**Objectif :** Créer un Dockerfile pour une application Node.js simple.

Créez un fichier `app.js` :

```javascript
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Hello Docker!");
});
server.listen(3000);
console.log("Server running on port 3000");
```

Créez un `package.json` :

```json
{
  "name": "hello-docker",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  }
}
```

**À faire :**

1. Créez un `Dockerfile`
2. Utilisez `node:18-alpine`
3. Copiez les fichiers
4. Exposez le port 3000
5. Lancez avec `npm start`

<details>
<summary>Voir la solution</summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY app.js .
EXPOSE 3000
CMD ["npm", "start"]
```

**Build et run :**

```bash
docker build -t hello-docker .
docker run -p 3000:3000 hello-docker
# Ouvrir http://localhost:3000
```

</details>

---

### Exercice 2 : Optimiser le Cache

**Objectif :** Optimiser un Dockerfile mal écrit.

**Dockerfile initial (lent) :**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

**À faire :**

1. Réorganisez pour optimiser le cache
2. Ajoutez un utilisateur non-root
3. Ajoutez un HEALTHCHECK

<details>
<summary>Voir la solution</summary>

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Optimisation : copier package.json avant le code
COPY package*.json ./
RUN npm ci --only=production

# Copier le code APRÈS
COPY . .

# Sécurité : utilisateur non-root
RUN adduser -D appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health')" || exit 1

CMD ["npm", "start"]
```

</details>

---

### Exercice 3 : Multi-Stage Build

**Objectif :** Créer un Dockerfile multi-stage pour réduire la taille.

**Contraintes :**

- Stage 1 : Build (avec devDependencies)
- Stage 2 : Production (seulement ce qui est nécessaire)

<details>
<summary>Voir la solution</summary>

```dockerfile
# ==================
# STAGE 1 : BUILD
# ==================
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install  # Toutes les dépendances (dev incluses)
COPY . .
RUN npm run build

# ==================
# STAGE 2 : PRODUCTION
# ==================
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # Production seulement
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["npm", "start"]
```

</details>

---

## Aide-Mémoire (Cheat Sheet) 📋

### Instructions Essentielles

```dockerfile
FROM <image>:<tag>                    # Image de base
WORKDIR /app                          # Répertoire de travail
COPY <src> <dest>                     # Copier fichiers
ADD <src> <dest>                      # Copier + extraire + URL
RUN <commande>                        # Exécuter pendant le build
ENV <clé>=<valeur>                    # Variable d'environnement
ARG <nom>=<valeur>                    # Argument de build
EXPOSE <port>                         # Port exposé (doc)
VOLUME ["/data"]                      # Point de montage
USER <utilisateur>                    # Utilisateur d'exécution
CMD ["cmd", "arg"]                    # Commande par défaut
ENTRYPOINT ["cmd"]                    # Point d'entrée
HEALTHCHECK CMD <commande>            # Vérification de santé
LABEL <clé>=<valeur>                  # Métadonnées
```

### Commandes Docker

```bash
# Build
docker build -t nom:tag .
docker build -t nom:tag -f Dockerfile.prod .
docker build --no-cache -t nom:tag .

# Build avec arguments
docker build --build-arg VERSION=1.0 -t nom:tag .

# Inspecter
docker history nom:tag
docker inspect nom:tag

# Run
docker run nom:tag
docker run -p 8080:80 nom:tag
docker run -e VAR=value nom:tag
```

---

## Récapitulatif 🎯

### Dockerfile en 5 Points

1. **FROM** : Choisissez une image de base légère (`alpine`)
2. **Ordre** : Stable en haut, changeant en bas (optimise le cache)
3. **Couches** : Combinez les `RUN` pour réduire la taille
4. **Sécurité** : Utilisez un utilisateur non-root (`USER`)
5. **Cache** : Copiez `package.json` avant le code

### Ordre Optimal

```dockerfile
FROM             # Image de base
LABEL            # Métadonnées
ENV/ARG          # Variables
RUN              # Packages système
WORKDIR          # Répertoire
COPY package     # Dépendances
RUN install      # Installation
COPY code        # Code source
RUN build        # Build (si nécessaire)
USER             # Utilisateur non-root
EXPOSE           # Port
HEALTHCHECK      # Santé
CMD/ENTRYPOINT   # Démarrage
```

---

**Félicitations ! Vous maîtrisez maintenant les Dockerfiles ! 🎉**

**Prochaine étape :** Passez aux exercices pratiques et créez votre premier Dockerfile pour votre backend ! 🚀
