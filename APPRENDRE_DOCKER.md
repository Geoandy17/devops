# 🐳 Apprendre Docker - Guide Complet pour Débutants

## 📚 Table des Matières

1. [Qu'est-ce que Docker ?](#quest-ce-que-docker-)
2. [Pourquoi utiliser Docker ?](#pourquoi-utiliser-docker-)
3. [Concepts Fondamentaux](#concepts-fondamentaux)
4. [Installation de Docker](#installation-de-docker)
5. [Votre Premier Conteneur](#votre-premier-conteneur)
6. [Créer un Dockerfile](#créer-un-dockerfile)
7. [Les Commandes Docker Essentielles](#les-commandes-docker-essentielles)
8. [Docker Compose (Orchestration)](#docker-compose-orchestration)
9. [Exercices Pratiques](#exercices-pratiques)
10. [Ressources et Prochaines Étapes](#ressources-et-prochaines-étapes)

---

## Qu'est-ce que Docker ? 🤔

### Définition Simple

**Docker** est un outil qui vous permet de **mettre votre application dans une "boîte"** (appelée conteneur) avec tout ce dont elle a besoin pour fonctionner.

### L'Analogie du Conteneur Maritime 🚢

Imaginez un conteneur de transport maritime :

- Il contient des marchandises
- Il est **standardisé** (même taille, même forme)
- Il peut être transporté **n'importe où** (bateau, train, camion)
- Le contenu est **isolé** et protégé

Docker fait la même chose avec votre application !

### Le Problème que Docker Résout

**Avant Docker :**

```
Développeur : "Ça marche sur ma machine !" 🤷‍♂️
Ops : "Mais pas en production..." 😤
```

**Pourquoi ?**

- Différentes versions de Node.js
- Dépendances système manquantes
- Configurations différentes
- Variables d'environnement qui changent

**Avec Docker :**

```
Développeur : "Ça marche dans mon conteneur !" ✅
Ops : "Parfait, ça marchera partout !" 🎉
```

---

## Pourquoi utiliser Docker ? 💡

### 1. **Portabilité**

Votre application fonctionne de la même manière :

- Sur votre Mac/Windows/Linux
- Sur le serveur de production
- Dans le cloud (AWS, Azure, Google Cloud)

### 2. **Isolation**

Chaque conteneur est isolé :

- Pas de conflits entre applications
- Pas de pollution de votre système
- Facile de supprimer (aucune trace)

### 3. **Reproductibilité**

Le conteneur contient **TOUT** :

- Le code
- Les dépendances
- Les configurations
- Les outils système

### 4. **Rapidité**

- Démarrage en quelques secondes (vs minutes pour une VM)
- Facile à distribuer et déployer
- Gain de temps massif en développement

### 5. **Économie de Ressources**

- Plus léger qu'une machine virtuelle
- Plusieurs conteneurs sur une même machine
- Meilleure utilisation du CPU et de la RAM

---

## Concepts Fondamentaux 📖

### 1. Image vs Conteneur

#### 🖼️ **Image Docker**

Une **image** est comme une **recette de cuisine** ou un **modèle** :

- C'est un fichier **immuable** (ne change pas)
- Contient le code + dépendances + configuration
- Peut être partagée et réutilisée
- Créée à partir d'un **Dockerfile**

**Analogie :** C'est comme un CD ou DVD - vous pouvez le lire, mais pas le modifier.

```bash
# Exemples d'images populaires
node:18-alpine          # Image Node.js officielle
postgres:15-alpine      # Image PostgreSQL
nginx:latest            # Serveur web Nginx
```

#### 📦 **Conteneur Docker**

Un **conteneur** est une **instance en cours d'exécution** d'une image :

- C'est l'image qui "prend vie"
- Vous pouvez en créer plusieurs à partir d'une même image
- Chaque conteneur est **isolé** des autres
- Peut être démarré, arrêté, supprimé

**Analogie :** Si l'image est un CD de musique, le conteneur est le lecteur CD qui joue la musique.

```
IMAGE (Recette)  →  docker run  →  CONTENEUR (Plat préparé)
```

**Exemple concret :**

```bash
# 1. Vous avez une image "node:18"
docker pull node:18

# 2. Vous créez 3 conteneurs différents à partir de cette image
docker run --name app1 node:18
docker run --name app2 node:18
docker run --name app3 node:18

# Résultat : 3 conteneurs indépendants, même image de base !
```

---

### 2. Dockerfile

Le **Dockerfile** est un fichier texte qui contient les **instructions** pour construire une image.

**Analogie :** C'est la recette de cuisine complète, étape par étape.

**Exemple simple :**

```dockerfile
# 1. Partir d'une image de base
FROM node:18-alpine

# 2. Définir le répertoire de travail
WORKDIR /app

# 3. Copier les fichiers de dépendances
COPY package*.json ./

# 4. Installer les dépendances
RUN npm install

# 5. Copier le code source
COPY . .

# 6. Exposer le port
EXPOSE 5000

# 7. Commande de démarrage
CMD ["npm", "start"]
```

**Chaque ligne = une instruction = une couche (layer)**

---

### 3. Conteneurisation

**Conteneurisation** = L'action de mettre une application dans un conteneur.

**Qu'est-ce qu'on conteneurise ?**

```
┌─────────────────────────────────┐
│      Votre Application          │
├─────────────────────────────────┤
│  • Code source (JS, Python...)  │
│  • Dépendances (npm, pip...)    │
│  • Runtime (Node, Python...)    │
│  • Configuration (.env...)      │
│  • Outils système (curl, git...)│
└─────────────────────────────────┘
         ⬇️  Conteneurisation
┌─────────────────────────────────┐
│      🐳 Conteneur Docker        │
│    Tout est isolé et packagé    │
└─────────────────────────────────┘
```

**Avantages :**

- ✅ Pas besoin d'installer Node.js sur la machine hôte
- ✅ Pas de conflit avec d'autres versions
- ✅ Suppression propre (pas de résidus)

---

### 4. Orchestration

**Orchestration** = Gérer plusieurs conteneurs qui travaillent ensemble.

**Pourquoi ?**

Une application moderne a souvent plusieurs parties :

- Frontend (React, Vue...)
- Backend (Node.js, Python...)
- Base de données (PostgreSQL, MongoDB...)
- Cache (Redis)
- Monitoring (Prometheus)

**Outils d'orchestration :**

#### 🎼 **Docker Compose** (Local/Dev)

Pour le **développement local** et les environnements simples.

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - database

  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

**Une seule commande :**

```bash
docker-compose up
# Démarre backend + database + frontend ensemble !
```

#### ☸️ **Kubernetes** (Production)

Pour la **production** et les grandes infrastructures :

- Gère des centaines/milliers de conteneurs
- Auto-scaling (ajuste automatiquement le nombre de conteneurs)
- Self-healing (redémarre les conteneurs en erreur)
- Load balancing (répartit le trafic)

**On verra Kubernetes plus tard !** Pour l'instant, concentrons-nous sur Docker.

---

### 5. Registre d'Images (Registry)

Un **registre** est un endroit où on **stocke** et **partage** des images Docker.

**Le plus connu : Docker Hub** (https://hub.docker.com)

```bash
# Télécharger une image depuis Docker Hub
docker pull node:18

# Publier votre propre image
docker push monusername/monapp:v1
```

**Autres registres :**

- GitHub Container Registry (ghcr.io)
- AWS ECR
- Google Container Registry
- Azure Container Registry

---

## Installation de Docker 🛠️

### MacOS

1. Téléchargez **Docker Desktop** : https://www.docker.com/products/docker-desktop
2. Installez en glissant l'app dans Applications
3. Lancez Docker Desktop
4. Vérifiez l'installation :

```bash
docker --version
# Docker version 24.0.6

docker-compose --version
# Docker Compose version v2.23.0
```

### Windows

1. Téléchargez **Docker Desktop** : https://www.docker.com/products/docker-desktop
2. Activez WSL2 si demandé
3. Installez Docker Desktop
4. Vérifiez l'installation (PowerShell ou CMD) :

```bash
docker --version
docker-compose --version
```

### Linux (Ubuntu/Debian)

```bash
# Mettre à jour les paquets
sudo apt update

# Installer Docker
sudo apt install docker.io docker-compose

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrer la session
newgrp docker

# Vérifier
docker --version
```

---

## Votre Premier Conteneur 🎉

### Test Rapide : Hello World

```bash
docker run hello-world
```

**Ce qui se passe :**

1. Docker cherche l'image `hello-world` localement
2. Ne la trouve pas → la télécharge depuis Docker Hub
3. Crée un conteneur à partir de l'image
4. Lance le conteneur qui affiche un message
5. Le conteneur s'arrête

```
┌─────────────────────────────────────────┐
│  Hello from Docker!                     │
│  This message shows that your           │
│  installation appears to be working.    │
└─────────────────────────────────────────┘
```

### Lancer un Serveur Web Nginx

```bash
# Lancer Nginx en arrière-plan
docker run -d -p 8080:80 --name mon-nginx nginx

# Explication :
# -d          : mode détaché (arrière-plan)
# -p 8080:80  : map le port 80 du conteneur vers 8080 de votre machine
# --name      : donne un nom au conteneur
# nginx       : nom de l'image à utiliser
```

Ouvrez votre navigateur : http://localhost:8080

🎉 **Vous voyez la page d'accueil de Nginx !**

### Gérer le Conteneur

```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Arrêter le conteneur
docker stop mon-nginx

# Démarrer à nouveau
docker start mon-nginx

# Voir les logs
docker logs mon-nginx

# Supprimer le conteneur (il doit être arrêté)
docker rm mon-nginx
```

---

## Créer un Dockerfile 📝

### Exemple : Conteneuriser notre Backend Node.js

**Fichier : `backend/Dockerfile`**

```dockerfile
# ========================================
# 1. IMAGE DE BASE
# ========================================
# On part d'une image Node.js officielle
# alpine = version ultra-légère de Linux
FROM node:18-alpine

# ========================================
# 2. MÉTADONNÉES (optionnel mais recommandé)
# ========================================
LABEL maintainer="votre@email.com"
LABEL description="Backend API pour l'apprentissage DevOps"

# ========================================
# 3. RÉPERTOIRE DE TRAVAIL
# ========================================
# Tous les chemins seront relatifs à /app
WORKDIR /app

# ========================================
# 4. COPIER LES FICHIERS DE DÉPENDANCES
# ========================================
# On copie d'abord package.json et package-lock.json
# Pourquoi séparément ? Pour optimiser le cache Docker !
COPY package*.json ./

# ========================================
# 5. INSTALLER LES DÉPENDANCES
# ========================================
# npm ci = installation propre (plus rapide que npm install)
# --only=production = on n'installe pas les devDependencies
RUN npm ci --only=production

# ========================================
# 6. COPIER LE CODE SOURCE
# ========================================
# On copie tout le reste du code
COPY . .

# ========================================
# 7. EXPOSER LE PORT
# ========================================
# Indique que l'app écoute sur le port 5000
# (C'est juste informatif, ne publie pas réellement le port)
EXPOSE 5000

# ========================================
# 8. UTILISATEUR NON-ROOT (Sécurité)
# ========================================
# On utilise l'utilisateur "node" plutôt que root
USER node

# ========================================
# 9. COMMANDE DE DÉMARRAGE
# ========================================
# CMD = commande exécutée au lancement du conteneur
CMD ["npm", "start"]
```

---

### Build de l'Image

```bash
# Se placer dans le dossier backend
cd backend

# Construire l'image
docker build -t mon-backend:v1 .

# Explication :
# build        : commande pour construire
# -t           : tag (nom) de l'image
# mon-backend  : nom de l'image
# v1           : version (tag)
# .            : contexte = répertoire courant
```

**Ce qui se passe :**

```
[+] Building 45.3s (10/10) FINISHED
 => [1/6] FROM node:18-alpine           5.2s
 => [2/6] WORKDIR /app                  0.1s
 => [3/6] COPY package*.json ./         0.1s
 => [4/6] RUN npm ci --only=production  28.4s
 => [5/6] COPY . .                      0.2s
 => [6/6] USER node                     0.1s
 => exporting to image                  1.2s
```

Chaque ligne du Dockerfile = une étape (layer)

### Vérifier l'Image

```bash
# Lister les images
docker images

# Résultat :
# REPOSITORY     TAG    IMAGE ID      CREATED         SIZE
# mon-backend    v1     abc123def456  2 minutes ago   180MB
```

### Lancer le Conteneur

```bash
# Lancer le backend
docker run -d -p 5000:5000 --name backend mon-backend:v1

# Vérifier qu'il tourne
docker ps

# Tester l'API
curl http://localhost:5000/health
# {"status":"healthy","timestamp":"2024-11-13T10:30:00.000Z"}
```

🎉 **Votre backend tourne dans un conteneur !**

---

## Les Commandes Docker Essentielles 🔧

### Gestion des Images

```bash
# Télécharger une image
docker pull node:18

# Lister les images
docker images

# Construire une image
docker build -t monapp:v1 .

# Supprimer une image
docker rmi monapp:v1

# Supprimer toutes les images non utilisées
docker image prune -a
```

### Gestion des Conteneurs

```bash
# Lancer un conteneur
docker run -d --name monapp monapp:v1

# Lister les conteneurs actifs
docker ps

# Lister TOUS les conteneurs (actifs + arrêtés)
docker ps -a

# Arrêter un conteneur
docker stop monapp

# Démarrer un conteneur arrêté
docker start monapp

# Redémarrer un conteneur
docker restart monapp

# Supprimer un conteneur
docker rm monapp

# Supprimer un conteneur en cours d'exécution (force)
docker rm -f monapp

# Supprimer tous les conteneurs arrêtés
docker container prune
```

### Debugging et Logs

```bash
# Voir les logs d'un conteneur
docker logs monapp

# Suivre les logs en temps réel (-f = follow)
docker logs -f monapp

# Voir les 50 dernières lignes
docker logs --tail 50 monapp

# Entrer dans un conteneur (ouvrir un shell)
docker exec -it monapp /bin/sh
# ou
docker exec -it monapp /bin/bash

# Inspecter un conteneur (détails complets)
docker inspect monapp

# Voir les statistiques en temps réel (CPU, RAM)
docker stats

# Voir les processus dans un conteneur
docker top monapp
```

### Réseaux et Volumes

```bash
# Créer un réseau
docker network create mon-reseau

# Lister les réseaux
docker network ls

# Créer un volume (pour les données persistantes)
docker volume create mes-donnees

# Lister les volumes
docker volume ls

# Lancer un conteneur avec un volume
docker run -v mes-donnees:/data monapp
```

---

## Docker Compose (Orchestration) 🎼

### Qu'est-ce que Docker Compose ?

**Docker Compose** permet de définir et gérer une **application multi-conteneurs** avec un seul fichier YAML.

**Sans Docker Compose :**

```bash
# Lancer PostgreSQL
docker run -d --name db -e POSTGRES_PASSWORD=secret postgres

# Créer un réseau
docker network create mon-reseau

# Connecter la DB au réseau
docker network connect mon-reseau db

# Lancer le backend
docker run -d --name backend --network mon-reseau -e DB_HOST=db mon-backend

# Lancer le frontend
docker run -d --name frontend -p 3000:3000 mon-frontend
```

😫 **Complexe et répétitif !**

**Avec Docker Compose :**

```yaml
# docker-compose.yml
version: "3.8"

services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: database
    depends_on:
      - database

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  db-data:
```

**Une seule commande :**

```bash
docker-compose up
```

🎉 **Tout démarre automatiquement !**

---

### Exemple Complet : Notre Projet DevOps

**Fichier : `docker-compose.yml`**

```yaml
version: "3.8"

services:
  # Base de données PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: devops-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: devops_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - devops-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: devops-backend
    environment:
      PORT: 5000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: devops_db
      DB_USER: postgres
      DB_PASSWORD: postgres
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    networks:
      - devops-network

  # Frontend Next.js
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: devops-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - devops-network

volumes:
  postgres_data:

networks:
  devops-network:
    driver: bridge
```

### Commandes Docker Compose

```bash
# Lancer tous les services
docker-compose up

# Lancer en arrière-plan (-d = detached)
docker-compose up -d

# Reconstruire les images avant de lancer
docker-compose up --build

# Arrêter tous les services
docker-compose down

# Arrêter ET supprimer les volumes (⚠️ perte de données)
docker-compose down -v

# Voir les logs de tous les services
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend

# Lister les services en cours
docker-compose ps

# Redémarrer un service
docker-compose restart backend

# Arrêter un service
docker-compose stop backend

# Exécuter une commande dans un service
docker-compose exec backend /bin/sh
```

---

## Exercices Pratiques 🏋️

### Exercice 1 : Hello Docker

**Objectif :** Se familiariser avec les commandes de base

```bash
# 1. Lancer un conteneur Ubuntu
docker run -it ubuntu /bin/bash

# 2. Vous êtes maintenant DANS le conteneur Ubuntu !
# Testez quelques commandes :
whoami
ls
cat /etc/os-release

# 3. Sortir du conteneur
exit

# 4. Le conteneur est arrêté mais existe toujours
docker ps -a

# 5. Le supprimer
docker rm <container-id>
```

### Exercice 2 : Créer Votre Première Image

**Objectif :** Créer une image Docker simple

1. Créez un fichier `Dockerfile` :

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN echo "console.log('Hello Docker!')" > hello.js
CMD ["node", "hello.js"]
```

2. Construisez l'image :

```bash
docker build -t hello-docker .
```

3. Lancez-la :

```bash
docker run hello-docker
# Affiche : Hello Docker!
```

### Exercice 3 : Conteneuriser le Backend

**Objectif :** Mettre votre backend dans un conteneur

1. Créez `backend/Dockerfile` (voir section précédente)

2. Créez `backend/.dockerignore` :

```
node_modules
npm-debug.log
.env
.git
```

3. Construisez l'image :

```bash
cd backend
docker build -t mon-backend:v1 .
```

4. Lancez un PostgreSQL :

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_DB=devops_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

5. Lancez le backend :

```bash
docker run -d \
  --name backend \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=devops_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -p 5000:5000 \
  mon-backend:v1
```

6. Testez :

```bash
curl http://localhost:5000/health
```

### Exercice 4 : Docker Compose

**Objectif :** Orchestrer backend + database avec Docker Compose

1. Créez `docker-compose.yml` à la racine :

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: devops_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: devops_db
      DB_USER: postgres
      DB_PASSWORD: postgres
    ports:
      - "5000:5000"
    depends_on:
      - postgres
```

2. Lancez tout :

```bash
docker-compose up --build
```

3. Testez dans un autre terminal :

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/todos
```

---

## Bonnes Pratiques Docker 🌟

### 1. Utilisez des Images Légères

```dockerfile
# ❌ Évitez les images lourdes
FROM node:18

# ✅ Préférez Alpine (beaucoup plus léger)
FROM node:18-alpine
```

### 2. Optimisez le Cache Docker

```dockerfile
# ✅ Bon ordre (package.json change moins souvent que le code)
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Mauvais ordre (npm install à chaque changement de code)
COPY . .
RUN npm install
```

### 3. Multi-Stage Build (pour le Frontend)

```dockerfile
# Stage 1 : Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 : Production (image finale plus légère)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "start"]
```

### 4. Utilisez .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.env
README.md
.vscode
```

### 5. N'Utilisez PAS Root

```dockerfile
# ✅ Créer et utiliser un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### 6. Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

---

## Ressources et Prochaines Étapes 📚

### Documentation Officielle

- **Docker Docs** : https://docs.docker.com/
- **Docker Hub** : https://hub.docker.com/
- **Docker Compose Docs** : https://docs.docker.com/compose/

### Tutoriels Recommandés

- **Play with Docker** : https://labs.play-with-docker.com/ (Gratuit, dans le navigateur)
- **Docker Curriculum** : https://docker-curriculum.com/
- **Awesome Docker** : https://github.com/veggiemonk/awesome-docker

### Prochaines Étapes

Une fois Docker maîtrisé :

1. ✅ **Docker** (Vous êtes ici)
2. 🎼 **Docker Compose** (Orchestration locale)
3. 🔄 **CI/CD** (GitHub Actions)
4. ☸️ **Kubernetes** (Orchestration production)
5. 📊 **Monitoring** (Prometheus/Grafana)

---

## Quiz de Validation 📝

### Testez vos connaissances :

1. **Quelle est la différence entre une image et un conteneur ?**

   - Image = modèle immuable (recette)
   - Conteneur = instance en cours d'exécution (plat préparé)

2. **À quoi sert un Dockerfile ?**

   - Définir les instructions pour construire une image

3. **Quelle commande pour construire une image ?**

   - `docker build -t monapp:v1 .`

4. **Quelle commande pour lancer un conteneur en arrière-plan ?**

   - `docker run -d monapp`

5. **Qu'est-ce que Docker Compose ?**

   - Outil pour orchestrer plusieurs conteneurs avec un fichier YAML

6. **Quelle commande pour voir les logs d'un conteneur ?**
   - `docker logs monapp` ou `docker logs -f monapp` (temps réel)

---

## Aide-Mémoire (Cheat Sheet) 📋

```bash
# ============ IMAGES ============
docker pull <image>              # Télécharger
docker images                    # Lister
docker build -t <nom:tag> .      # Construire
docker rmi <image>               # Supprimer
docker image prune               # Nettoyer

# ========== CONTENEURS ==========
docker run <image>               # Lancer
docker run -d <image>            # Arrière-plan
docker run -p 8080:80 <image>    # Mapper un port
docker ps                        # Lister (actifs)
docker ps -a                     # Lister (tous)
docker stop <conteneur>          # Arrêter
docker start <conteneur>         # Démarrer
docker restart <conteneur>       # Redémarrer
docker rm <conteneur>            # Supprimer
docker logs <conteneur>          # Logs
docker exec -it <conteneur> sh   # Entrer dans le conteneur

# ======== DOCKER COMPOSE ========
docker-compose up                # Lancer
docker-compose up -d             # Arrière-plan
docker-compose up --build        # Reconstruire
docker-compose down              # Arrêter
docker-compose logs -f           # Logs
docker-compose ps                # État
docker-compose restart <service> # Redémarrer

# ========== NETTOYAGE ===========
docker system prune              # Tout nettoyer
docker system prune -a           # Nettoyage complet
docker volume prune              # Supprimer volumes
```

---

**Félicitations ! Vous avez maintenant les bases solides de Docker ! 🎉**

**Prochaine étape :** Passez aux exercices pratiques et conteneurisez votre application backend et frontend !

**Besoin d'aide ?** Relisez les sections nécessaires ou consultez la documentation officielle.

**Bon apprentissage Docker ! 🐳**
