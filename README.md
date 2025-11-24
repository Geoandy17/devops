# 🚀 Projet DevOps - Application Full-Stack avec CI/CD

Bienvenue dans votre projet d'apprentissage DevOps ! Ce projet est une **application complète de gestion de tâches (Todo App)** qui démontre tous les concepts essentiels du DevOps et de la CI/CD.

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture](#-architecture)
- [Technologies Utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation et Lancement](#-installation-et-lancement)
- [Guide d'Apprentissage](#-guide-dapprentissage)
- [Concepts DevOps Démontrés](#-concepts-devops-démontrés)
- [Commandes Utiles](#-commandes-utiles)
- [Ressources d'Apprentissage](#-ressources-dapprentissage)

---

## 🎯 Vue d'ensemble

Ce projet est conçu pour vous apprendre les concepts DevOps de manière pratique :

- **Frontend** : Application Next.js (React) moderne et responsive
- **Backend** : API REST avec Node.js/Express
- **Base de données** : PostgreSQL
- **Conteneurisation** : Docker et Docker Compose
- **CI/CD** : GitHub Actions avec pipeline complet
- **Orchestration** : Kubernetes (K8s) avec manifests
- **Monitoring** : Prometheus & Grafana

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend API   │─────▶│  PostgreSQL  │
│  (Node/Express) │      │   Database   │
│   Port: 5000    │      │  Port: 5432  │
└─────────────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Prometheus    │─────▶│   Grafana    │
│   (Metrics)     │      │  (Dashboard) │
│   Port: 9090    │      │  Port: 3001  │
└─────────────────┘      └──────────────┘
```

---

## 🛠️ Technologies Utilisées

### Frontend

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimaliste
- **PostgreSQL** - Base de données relationnelle

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-conteneurs
- **Kubernetes** - Orchestration en production
- **GitHub Actions** - CI/CD automatisé
- **Prometheus** - Collecte de métriques
- **Grafana** - Visualisation et monitoring

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Git** - [Télécharger Git](https://git-scm.com/downloads)
2. **Docker** - [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
3. **Node.js (v18+)** - [Télécharger Node.js](https://nodejs.org/)
4. **kubectl** (optionnel pour Kubernetes) - [Installer kubectl](https://kubernetes.io/docs/tasks/tools/)

### Vérifier l'installation

```bash
git --version
docker --version
docker-compose --version
node --version
npm --version
```

---

## 🚀 Installation et Lancement

### Option 1 : Lancement avec Docker Compose (Recommandé)

C'est la méthode la plus simple pour démarrer l'application complète :

```bash
# 1. Cloner le dépôt
git clone <votre-repo>
cd devops

# 2. Lancer tous les services
docker-compose up --build

# En arrière-plan (mode détaché)
docker-compose up -d --build
```

**Accéder aux services :**

- Frontend : http://localhost:3000
- Backend API : http://localhost:5000
- Prometheus : http://localhost:9090
- Grafana : http://localhost:3001 (admin/admin)

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (nettoyer les données)
docker-compose down -v
```

---

### Option 2 : Lancement en développement local

#### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer un fichier .env
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devops_db
DB_USER=postgres
DB_PASSWORD=postgres
EOF

# Démarrer PostgreSQL (avec Docker)
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=devops_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Lancer le backend
npm run dev
```

#### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer un fichier .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Lancer le frontend
npm run dev
```

---

## 📚 Guide d'Apprentissage

Suivez ce parcours progressif pour maîtriser le DevOps :

### Phase 1 : Comprendre l'application (Semaine 1)

1. **Explorer le code**

   - Analysez la structure du projet
   - Comprenez comment le frontend communique avec le backend
   - Testez l'API avec des outils comme Postman ou curl

2. **Lancer l'application localement**

   ```bash
   # Sans Docker (développement)
   cd backend && npm install && npm run dev
   cd frontend && npm install && npm run dev
   ```

3. **Exercices**
   - Ajoutez un nouveau champ à la table `todos` (ex: `priority`)
   - Créez un nouvel endpoint API (ex: `GET /api/todos/completed`)
   - Modifiez l'UI pour afficher les tâches complétées différemment

---

### Phase 2 : Maîtriser Docker (Semaine 2)

1. **Comprendre les Dockerfiles**

   - Lisez `backend/Dockerfile` et `frontend/Dockerfile`
   - Comprenez le multi-stage build du frontend

2. **Build des images**

   ```bash
   # Builder l'image backend
   cd backend
   docker build -t devops-backend:v1 .

   # Builder l'image frontend
   cd frontend
   docker build -t devops-frontend:v1 .
   ```

3. **Lancer les conteneurs**

   ```bash
   # Réseau Docker
   docker network create devops-net

   # PostgreSQL
   docker run -d --name postgres --network devops-net \
     -e POSTGRES_DB=devops_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     postgres:15-alpine

   # Backend
   docker run -d --name backend --network devops-net \
     -e DB_HOST=postgres \
     -e DB_PORT=5432 \
     -e DB_NAME=devops_db \
     -e DB_USER=postgres \
     -e DB_PASSWORD=postgres \
     -p 5000:5000 \
     devops-backend:v1

   # Frontend
   docker run -d --name frontend --network devops-net \
     -e NEXT_PUBLIC_API_URL=http://localhost:5000 \
     -p 3000:3000 \
     devops-frontend:v1
   ```

4. **Exercices**
   - Optimisez les Dockerfiles pour réduire la taille des images
   - Ajoutez des variables d'environnement personnalisées
   - Créez un conteneur pour Redis (cache)

---

### Phase 3 : Docker Compose (Semaine 3)

1. **Comprendre docker-compose.yml**

   - Analysez les services définis
   - Comprenez les volumes et les réseaux
   - Étudiez les health checks

2. **Utiliser Docker Compose**

   ```bash
   # Lancer tous les services
   docker-compose up -d

   # Voir les logs
   docker-compose logs -f

   # Voir l'état des services
   docker-compose ps

   # Reconstruire et redémarrer un service
   docker-compose up -d --build backend

   # Arrêter tout
   docker-compose down
   ```

3. **Exercices**
   - Ajoutez un service Redis au docker-compose.yml
   - Configurez des limites de ressources (CPU, mémoire)
   - Créez un docker-compose.dev.yml pour le développement

---

### Phase 4 : CI/CD avec GitHub Actions (Semaine 4)

1. **Comprendre le pipeline CI/CD**

   - Lisez `.github/workflows/ci-cd.yml`
   - Identifiez les différents jobs et leurs dépendances

2. **Pousser votre code sur GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit - DevOps project"
   git branch -M main
   git remote add origin <votre-repo-github>
   git push -u origin main
   ```

3. **Observer l'exécution**

   - Allez dans l'onglet "Actions" de votre dépôt GitHub
   - Observez les jobs s'exécuter automatiquement

4. **Exercices**
   - Ajoutez un job de notification (Slack, Discord)
   - Créez un environnement de staging
   - Ajoutez des tests d'intégration

---

### Phase 5 : Kubernetes (Semaine 5-6)

1. **Installer un cluster Kubernetes local**

   ```bash
   # Avec Minikube
   minikube start

   # Ou avec Docker Desktop (activer Kubernetes dans les paramètres)
   ```

2. **Déployer l'application sur Kubernetes**

   ```bash
   # Créer le namespace
   kubectl apply -f k8s/namespace.yaml

   # Déployer la base de données
   kubectl apply -f k8s/postgres-deployment.yaml

   # Déployer le backend
   kubectl apply -f k8s/backend-deployment.yaml

   # Déployer le frontend
   kubectl apply -f k8s/frontend-deployment.yaml

   # Configurer l'Ingress
   kubectl apply -f k8s/ingress.yaml
   ```

3. **Vérifier le déploiement**

   ```bash
   # Voir les pods
   kubectl get pods -n devops-app

   # Voir les services
   kubectl get services -n devops-app

   # Voir les logs d'un pod
   kubectl logs -f <pod-name> -n devops-app

   # Accéder au shell d'un pod
   kubectl exec -it <pod-name> -n devops-app -- /bin/sh
   ```

4. **Exercices**
   - Configurez les ressources requests/limits
   - Ajoutez un HorizontalPodAutoscaler
   - Créez un ConfigMap pour les variables d'environnement
   - Mettez en place un rolling update

---

### Phase 6 : Monitoring (Semaine 7)

1. **Accéder à Prometheus et Grafana**

   - Prometheus : http://localhost:9090
   - Grafana : http://localhost:3001 (admin/admin)

2. **Explorer les métriques**

   - Dans Prometheus, testez des requêtes PromQL
   - Dans Grafana, créez un dashboard personnalisé

3. **Exercices**
   - Ajoutez des métriques personnalisées dans le backend
   - Créez un dashboard Grafana avec des alertes
   - Configurez des notifications par email

---

## 🎓 Concepts DevOps Démontrés

### ✅ 1. Conteneurisation

- **Dockerfiles** optimisés avec multi-stage builds
- **Images légères** basées sur Alpine Linux
- **Health checks** pour la surveillance des conteneurs

### ✅ 2. Orchestration

- **Docker Compose** pour le développement local
- **Kubernetes** pour le déploiement en production
- **Auto-scaling** avec HorizontalPodAutoscaler

### ✅ 3. CI/CD

- **Pipeline automatisé** avec GitHub Actions
- **Tests automatiques** (backend et frontend)
- **Build et push** d'images Docker
- **Security scanning** avec Trivy
- **Déploiement continu**

### ✅ 4. Infrastructure as Code

- Manifests Kubernetes déclaratifs (YAML)
- Configuration reproductible
- Gestion de versions de l'infrastructure

### ✅ 5. Monitoring & Observabilité

- **Prometheus** pour la collecte de métriques
- **Grafana** pour la visualisation
- **Health checks** et **readiness probes**

### ✅ 6. Bonnes Pratiques

- Utilisateurs non-root dans les conteneurs
- Secrets séparés du code
- Limites de ressources (CPU/mémoire)
- High availability avec plusieurs replicas

---

## 🔧 Commandes Utiles

### Docker

```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Voir toutes les images
docker images

# Supprimer tous les conteneurs arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune -a

# Voir les logs d'un conteneur
docker logs -f <container-id>

# Entrer dans un conteneur
docker exec -it <container-id> /bin/sh

# Voir l'utilisation des ressources
docker stats
```

### Docker Compose

```bash
# Lancer en mode détaché
docker-compose up -d

# Reconstruire les images
docker-compose build

# Voir les logs
docker-compose logs -f [service]

# Redémarrer un service
docker-compose restart [service]

# Arrêter et supprimer tout
docker-compose down -v
```

### Kubernetes

```bash
# Contexte et configuration
kubectl config get-contexts
kubectl config use-context <context-name>

# Ressources
kubectl get all -n devops-app
kubectl describe pod <pod-name> -n devops-app
kubectl logs -f <pod-name> -n devops-app

# Débogage
kubectl exec -it <pod-name> -n devops-app -- /bin/sh
kubectl port-forward <pod-name> 8080:3000 -n devops-app

# Mise à jour
kubectl apply -f k8s/
kubectl rollout status deployment/backend -n devops-app
kubectl rollout undo deployment/backend -n devops-app

# Nettoyage
kubectl delete -f k8s/
kubectl delete namespace devops-app
```

### Git

```bash
# Initialiser un nouveau dépôt
git init

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Message de commit"

# Pousser vers GitHub
git push origin main

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Fusionner une branche
git checkout main
git merge feature/nouvelle-fonctionnalite
```

---

## 📖 Ressources d'Apprentissage

### Documentation Officielle

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prometheus](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/docs/)

### Tutoriels Recommandés

- [Docker Tutorial for Beginners](https://docker-curriculum.com/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [CI/CD with GitHub Actions](https://docs.github.com/en/actions/learn-github-actions)

### Exercices Pratiques

- [Play with Docker](https://labs.play-with-docker.com/)
- [Kubernetes Playground](https://www.katacoda.com/courses/kubernetes)
- [GitHub Actions Playground](https://github.com/skills)

---

## 🎯 Prochaines Étapes

Une fois que vous maîtrisez ce projet, explorez :

1. **Helm** - Gestionnaire de packages Kubernetes
2. **Terraform** - Infrastructure as Code
3. **ArgoCD** - GitOps pour Kubernetes
4. **Ansible** - Automatisation de la configuration
5. **Service Mesh** - Istio ou Linkerd
6. **Logging** - Stack ELK (Elasticsearch, Logstash, Kibana)

---

## 🤝 Contribution

N'hésitez pas à contribuer à ce projet d'apprentissage :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

---

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 💬 Questions ou Problèmes ?

Si vous rencontrez des problèmes ou avez des questions :

1. Vérifiez que tous les services Docker sont en cours d'exécution
2. Consultez les logs avec `docker-compose logs -f`
3. Assurez-vous que les ports ne sont pas déjà utilisés
4. Vérifiez que Docker a suffisamment de ressources allouées

---

## 🎉 Bonne Chance !

Vous avez maintenant un projet complet pour apprendre le DevOps de A à Z ! N'oubliez pas :

- **La pratique** est la clé
- **Expérimentez** et n'ayez pas peur de casser les choses
- **Documentez** ce que vous apprenez
- **Partagez** vos progrès et posez des questions

Bon apprentissage DevOps ! 🚀
