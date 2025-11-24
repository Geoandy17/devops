# 🎼 Guide Complet : Docker Compose (Orchestration)

## 📚 Table des Matières

1. [Le Problème : Gérer Plusieurs Conteneurs](#le-problème--gérer-plusieurs-conteneurs)
2. [La Solution : Docker Compose](#la-solution--docker-compose)
3. [Qu'est-ce que Docker Compose ?](#quest-ce-que-docker-compose-)
4. [Structure du fichier docker-compose.yml](#structure-du-fichier-docker-composeyml)
5. [Les Sections Principales](#les-sections-principales)
6. [Commandes Docker Compose](#commandes-docker-compose)
7. [Exemples Pratiques](#exemples-pratiques)
8. [Services, Networks, Volumes](#services-networks-volumes)
9. [Bonnes Pratiques](#bonnes-pratiques)
10. [Exercices](#exercices)

---

## Le Problème : Gérer Plusieurs Conteneurs 😫

### Votre Application Complète

Une application moderne a plusieurs composants :

```
┌─────────────────────────────────────┐
│      VOTRE APPLICATION              │
├─────────────────────────────────────┤
│  🎨 Frontend (Next.js)              │
│  🔌 Backend (Node.js)               │
│  💾 Base de données (PostgreSQL)    │
└─────────────────────────────────────┘
```

**Chaque composant = UN conteneur séparé !**

---

### Sans Docker Compose : Le Cauchemar 😱

Pour lancer ces 3 conteneurs, vous devez faire :

```bash
# 1. Créer un réseau pour qu'ils communiquent
docker network create mon-reseau

# 2. Lancer PostgreSQL
docker run -d \
  --name postgres \
  --network mon-reseau \
  -e POSTGRES_DB=devops_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# 3. Attendre que PostgreSQL soit prêt...
sleep 10

# 4. Construire l'image backend
cd backend
docker build -t mon-backend:v1 .

# 5. Lancer le backend
docker run -d \
  --name backend \
  --network mon-reseau \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=devops_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -p 5000:5000 \
  mon-backend:v1

# 6. Attendre que le backend soit prêt...
sleep 10

# 7. Construire l'image frontend
cd ../frontend
docker build -t mon-frontend:v1 .

# 8. Lancer le frontend
docker run -d \
  --name frontend \
  --network mon-reseau \
  -e NEXT_PUBLIC_API_URL=http://localhost:5000 \
  -p 3000:3000 \
  mon-frontend:v1

# 9. Pour tout arrêter
docker stop frontend backend postgres
docker rm frontend backend postgres
docker network rm mon-reseau
```

**😫 Problèmes :**

- Trop de commandes
- Gestion manuelle de l'ordre
- Difficile de tout redémarrer
- Erreurs fréquentes
- Impossible à maintenir

---

## La Solution : Docker Compose ✨

### Avec Docker Compose : Simple et Élégant

**Un seul fichier :**

```yaml
# docker-compose.yml
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
    volumes:
      - postgres_data:/var/lib/postgresql/data

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

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Une seule commande :**

```bash
docker-compose up
```

**🎉 Tout démarre automatiquement dans le bon ordre !**

```bash
# Pour tout arrêter
docker-compose down
```

---

## Qu'est-ce que Docker Compose ? 🤔

### Définition Simple

**Docker Compose** est un outil pour définir et gérer des **applications multi-conteneurs** avec un fichier YAML.

### Analogie : Le Chef d'Orchestre

```
Sans Docker Compose :
🎻 Vous lancez le violon manuellement
🎺 Vous lancez la trompette manuellement
🥁 Vous lancez la batterie manuellement
→ Vous devez tout coordonner à la main !

Avec Docker Compose :
      👨‍🎤 Chef d'orchestre
         │
    ┌────┼────┐
    │    │    │
   🎻   🎺   🥁
→ Le chef coordonne tout automatiquement !
```

### Ce Que Docker Compose Fait Pour Vous

✅ **Crée les réseaux** automatiquement  
✅ **Build les images** si nécessaire  
✅ **Lance les conteneurs** dans le bon ordre  
✅ **Gère les dépendances** entre services  
✅ **Redémarre** les conteneurs qui plantent  
✅ **Arrête tout proprement** en une commande  
✅ **Partage la configuration** facilement (fichier YAML)

---

## Structure du fichier docker-compose.yml 📝

### Anatomie Complète

```yaml
# Version de la syntaxe Docker Compose
version: "3.8"

# Définition des services (conteneurs)
services:
  # Service 1 : Nom du service
  nom-service-1:
    image: postgres:15
    # ou
    build: ./chemin/vers/dockerfile
    container_name: mon-conteneur
    environment:
      VAR: valeur
    ports:
      - "host:conteneur"
    volumes:
      - volume-name:/chemin/dans/conteneur
    networks:
      - mon-reseau
    depends_on:
      - autre-service
    restart: unless-stopped

  # Service 2
  nom-service-2:
    # ...

# Définition des volumes (données persistantes)
volumes:
  nom-volume:

# Définition des réseaux (optionnel)
networks:
  mon-reseau:
    driver: bridge
```

---

## Les Sections Principales 🔍

### 1. version

```yaml
version: "3.8"
```

**Rôle :** Indique la version de la syntaxe Docker Compose.

**Versions courantes :**

- `3.8` : Moderne, recommandée
- `3.9` : Plus récente
- `2.x` : Ancienne (évitez)

**📌 Règle :** Utilisez toujours `"3.8"` ou `"3.9"`.

---

### 2. services

```yaml
services:
  backend:
    # Configuration du service backend
  frontend:
    # Configuration du service frontend
```

**Rôle :** Définit tous les conteneurs de votre application.

**Chaque service = UN conteneur !**

```
services:
  postgres:   → Conteneur PostgreSQL
  backend:    → Conteneur Backend
  frontend:   → Conteneur Frontend
  redis:      → Conteneur Redis
```

---

### 3. volumes

```yaml
volumes:
  postgres_data:
  uploads:
```

**Rôle :** Définit les volumes pour les données persistantes.

**Pourquoi ?** Les données dans un conteneur sont **perdues** quand il est supprimé.  
Les volumes **persistent** les données.

```
Conteneur supprimé → Données perdues ❌
Volume utilisé → Données conservées ✅
```

---

### 4. networks (optionnel)

```yaml
networks:
  frontend-network:
  backend-network:
```

**Rôle :** Définit des réseaux personnalisés.

**Par défaut :** Docker Compose crée un réseau automatiquement.  
**Utilisation avancée :** Pour isoler des services entre eux.

---

## Configuration d'un Service 🛠️

### Propriétés Essentielles

#### image

```yaml
services:
  postgres:
    image: postgres:15-alpine
```

**Rôle :** Utilise une image existante (depuis Docker Hub).

---

#### build

```yaml
services:
  backend:
    build: ./backend
    # ou avec options
    build:
      context: ./backend
      dockerfile: Dockerfile
```

**Rôle :** Construit une image à partir d'un Dockerfile.

**📌 Règle :**

- `image` : Pour les images officielles (postgres, redis, nginx...)
- `build` : Pour votre code (backend, frontend...)

---

#### container_name

```yaml
services:
  backend:
    container_name: devops-backend
```

**Rôle :** Donne un nom personnalisé au conteneur.

**Par défaut :** `<projet>_<service>_1` (ex: `devops_backend_1`)  
**Avec container_name :** `devops-backend`

---

#### environment

```yaml
services:
  backend:
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: postgres
```

**Rôle :** Définit les variables d'environnement.

**Alternative (fichier .env) :**

```yaml
services:
  backend:
    env_file:
      - ./backend/.env
```

---

#### ports

```yaml
services:
  backend:
    ports:
      - "5000:5000" # host:conteneur
      - "8080:3000" # mapper 3000 du conteneur vers 8080 de l'hôte
```

**Rôle :** Expose les ports du conteneur vers votre machine.

**Format :** `"PORT_MACHINE:PORT_CONTENEUR"`

```
localhost:5000 → conteneur:5000
localhost:8080 → conteneur:3000
```

---

#### volumes

```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data # Volume nommé
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql # Bind mount
```

**Types :**

1. **Volume nommé** : Données persistantes gérées par Docker

   ```yaml
   - postgres_data:/var/lib/postgresql/data
   ```

2. **Bind mount** : Monter un dossier de votre machine
   ```yaml
   - ./backend/src:/app/src # Hot reload en dev
   ```

---

#### depends_on

```yaml
services:
  backend:
    depends_on:
      - postgres
```

**Rôle :** Définit l'ordre de démarrage.

```
postgres démarre AVANT backend
backend démarre AVANT frontend
```

**⚠️ Attention :** `depends_on` attend que le conteneur démarre, **PAS** qu'il soit prêt !

**Solution avancée (avec health check) :**

```yaml
services:
  backend:
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

---

#### restart

```yaml
services:
  backend:
    restart: unless-stopped
```

**Valeurs possibles :**

- `no` : Ne pas redémarrer (défaut)
- `always` : Toujours redémarrer
- `on-failure` : Redémarrer seulement si erreur
- `unless-stopped` : Toujours sauf si arrêté manuellement ✅ Recommandé

---

#### healthcheck

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Rôle :** Vérifie que le service est en bonne santé.

---

#### networks

```yaml
services:
  backend:
    networks:
      - backend-network
      - frontend-network
```

**Rôle :** Connecte le service à des réseaux spécifiques.

---

## Commandes Docker Compose 🔧

### Commandes de Base

```bash
# Lancer tous les services
docker-compose up

# Lancer en arrière-plan (détaché)
docker-compose up -d

# Reconstruire les images avant de lancer
docker-compose up --build

# Lancer un seul service
docker-compose up backend

# Arrêter tous les services
docker-compose down

# Arrêter ET supprimer les volumes (⚠️ perte de données)
docker-compose down -v
```

### Gestion des Services

```bash
# Voir l'état des services
docker-compose ps

# Voir les logs (tous les services)
docker-compose logs

# Suivre les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Arrêter un service (sans le supprimer)
docker-compose stop backend

# Démarrer un service arrêté
docker-compose start backend
```

### Build et Images

```bash
# Construire/reconstruire les images
docker-compose build

# Reconstruire sans cache
docker-compose build --no-cache

# Construire un seul service
docker-compose build backend

# Voir les images créées
docker-compose images
```

### Exécution de Commandes

```bash
# Exécuter une commande dans un service
docker-compose exec backend /bin/sh

# Exécuter en tant qu'utilisateur root
docker-compose exec -u root backend /bin/sh

# Lancer une commande ponctuelle
docker-compose run backend npm install

# Voir les processus
docker-compose top
```

### Nettoyage

```bash
# Supprimer les conteneurs arrêtés
docker-compose rm

# Supprimer tout (conteneurs + réseaux)
docker-compose down

# Supprimer tout + volumes
docker-compose down -v

# Supprimer tout + images
docker-compose down --rmi all
```

---

## Exemples Pratiques 💻

### Exemple 1 : Backend + Base de Données (Simple)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: my-postgres
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: my-backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: mydb
      DB_USER: admin
      DB_PASSWORD: secret
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  db_data:
```

**Utilisation :**

```bash
# Lancer
docker-compose up -d

# Tester
curl http://localhost:5000/health

# Voir les logs
docker-compose logs -f backend

# Arrêter
docker-compose down
```

---

### Exemple 2 : Application Complète (Frontend + Backend + DB)

```yaml
version: "3.8"

services:
  # Base de données PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: devops-postgres
    environment:
      POSTGRES_DB: devops_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
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
      postgres:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - devops-network
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

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
      backend:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - devops-network

volumes:
  postgres_data:
    driver: local

networks:
  devops-network:
    driver: bridge
```

---

### Exemple 3 : Avec Hot Reload (Développement)

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    volumes:
      - ./backend/src:/app/src # Montage du code source
      - /app/node_modules # Exclure node_modules
    environment:
      NODE_ENV: development
    ports:
      - "5000:5000"
    command: npm run dev # Lancer en mode dev avec nodemon

  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      NODE_ENV: development
    ports:
      - "3000:3000"
    command: npm run dev
```

**Avantage :** Vos modifications de code sont immédiatement reflétées !

---

### Exemple 4 : Application Multi-Services Complète

```yaml
version: "3.8"

services:
  # Base de données
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

  # Cache Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Backend API
  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis

  # Frontend
  frontend:
    build: ./frontend
    environment:
      API_URL: http://backend:5000
    ports:
      - "3000:3000"
    depends_on:
      - backend

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  db_data:
```

---

## Services, Networks, Volumes en Détail 🔬

### Services

**Un service = UN conteneur**

```yaml
services:
  service-1: # → Conteneur 1
  service-2: # → Conteneur 2
  service-3: # → Conteneur 3
```

**Nom du service = nom DNS dans le réseau**

```yaml
services:
  postgres:
    # ...
  backend:
    environment:
      DB_HOST: postgres # ← Utilise le nom du service !
```

Les services peuvent communiquer entre eux par leurs noms !

---

### Networks

**Par défaut :** Docker Compose crée un réseau automatiquement.

```
Tous les services du même docker-compose.yml
    ↓
Sont sur le même réseau
    ↓
Peuvent communiquer entre eux
```

**Personnalisation :**

```yaml
services:
  backend:
    networks:
      - backend-net

  frontend:
    networks:
      - frontend-net
      - backend-net # Accès au backend

networks:
  frontend-net:
  backend-net:
```

---

### Volumes

**Volume nommé** (géré par Docker) :

```yaml
services:
  postgres:
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data: # Docker gère où c'est stocké
```

**Bind mount** (dossier de votre machine) :

```yaml
services:
  backend:
    volumes:
      - ./backend/src:/app/src # Votre dossier → conteneur
```

**Volume anonyme** (temporaire) :

```yaml
services:
  backend:
    volumes:
      - /app/node_modules # Exclure node_modules du bind mount
```

---

## Bonnes Pratiques 🌟

### 1. Utilisez des Health Checks

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 2. Définissez restart: unless-stopped

```yaml
services:
  backend:
    restart: unless-stopped
```

### 3. Utilisez depends_on avec condition

```yaml
services:
  backend:
    depends_on:
      postgres:
        condition: service_healthy
```

### 4. Nommez vos Volumes

```yaml
volumes:
  postgres_data: # Nom clair
  uploads_folder:
```

### 5. Utilisez .env pour les Secrets

**Fichier .env :**

```
DB_PASSWORD=supersecret
API_KEY=myapikey
```

**docker-compose.yml :**

```yaml
services:
  backend:
    env_file:
      - .env
```

### 6. Séparez Dev et Prod

```yaml
# docker-compose.yml (base)
services:
  backend:
    build: ./backend

# docker-compose.override.yml (dev, auto-chargé)
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

# docker-compose.prod.yml (prod, explicite)
services:
  backend:
    restart: always
    environment:
      NODE_ENV: production
```

**Utilisation :**

```bash
# Dev (charge automatiquement .override.yml)
docker-compose up

# Prod
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### 7. Limitez les Ressources

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

### 8. Utilisez container_name avec Précaution

```yaml
# ❌ Évitez avec scaling
services:
  backend:
    container_name: backend  # Ne peut pas scaler (docker-compose up --scale backend=3)

# ✅ Sans container_name pour permettre le scaling
services:
  backend:
    # Pas de container_name
    # Crée : project_backend_1, project_backend_2, ...
```

---

## Exercices 🏋️

### Exercice 1 : Backend + PostgreSQL Simple

**Objectif :** Créer un docker-compose.yml avec backend et PostgreSQL.

**À faire :**

1. Service PostgreSQL (image officielle)
2. Service backend (build depuis ./backend)
3. Backend doit dépendre de PostgreSQL
4. Exposer les ports appropriés

<details>
<summary>Voir la solution</summary>

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: mydb
      DB_USER: admin
      DB_PASSWORD: secret
    ports:
      - "5000:5000"
    depends_on:
      - postgres

volumes:
  db_data:
```

**Tester :**

```bash
docker-compose up -d
docker-compose ps
docker-compose logs backend
docker-compose down
```

</details>

---

### Exercice 2 : Ajouter Redis

**Objectif :** Ajouter Redis au docker-compose.yml précédent.

**À faire :**

1. Ajouter un service Redis
2. Le backend doit pouvoir communiquer avec Redis
3. Pas besoin de volume (cache temporaire)

<details>
<summary>Voir la solution</summary>

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis # Utilise le nom du service
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis

volumes:
  db_data:
```

</details>

---

### Exercice 3 : Configuration Dev avec Hot Reload

**Objectif :** Modifier le docker-compose.yml pour le développement.

**À faire :**

1. Monter le code source en volume (bind mount)
2. Exclure node_modules
3. Utiliser la commande de dev (npm run dev)

<details>
<summary>Voir la solution</summary>

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    volumes:
      - ./backend/src:/app/src # Montage du code
      - /app/node_modules # Exclure node_modules
    environment:
      NODE_ENV: development
      DB_HOST: postgres
    ports:
      - "5000:5000"
    command: npm run dev # Utiliser nodemon
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

</details>

---

## Aide-Mémoire (Cheat Sheet) 📋

### Commandes Essentielles

```bash
# Lancer
docker-compose up                    # Au premier plan
docker-compose up -d                 # En arrière-plan
docker-compose up --build            # Reconstruire avant

# Arrêter
docker-compose down                  # Arrêter et supprimer
docker-compose stop                  # Arrêter seulement

# Logs
docker-compose logs                  # Tous les logs
docker-compose logs -f backend       # Suivre backend

# État
docker-compose ps                    # État des services
docker-compose top                   # Processus

# Gestion
docker-compose restart backend       # Redémarrer
docker-compose exec backend sh       # Shell dans backend
docker-compose build                 # Reconstruire images
```

### Structure Minimale

```yaml
version: "3.8"

services:
  mon-service:
    image: nginx:alpine
    # ou
    build: ./mon-app
    ports:
      - "8080:80"
    environment:
      VAR: valeur
    volumes:
      - data:/data
    depends_on:
      - autre-service

volumes:
  data:
```

---

## Récapitulatif 🎯

### Docker Compose en 5 Points

1. **Un fichier YAML** définit toute votre application
2. **Une commande** lance tous les conteneurs
3. **Gère automatiquement** les réseaux et dépendances
4. **Parfait pour le développement** local
5. **Base de Kubernetes** (orchestration production)

### Quand Utiliser Docker Compose ?

✅ **Développement local** (plusieurs conteneurs)  
✅ **Tests d'intégration** (stack complète)  
✅ **Environnements de staging**  
✅ **Petites applications** en production

❌ **Grandes infrastructures** → Utilisez Kubernetes

---

**Félicitations ! Vous maîtrisez maintenant Docker Compose ! 🎉**

**Prochaine étape :** Créer votre `docker-compose.yml` pour votre projet backend + frontend + PostgreSQL ! 🚀
