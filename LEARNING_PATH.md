# 🗺️ Parcours d'Apprentissage DevOps

Ce document vous guide étape par étape dans votre apprentissage du DevOps et de la CI/CD.

---

## 📅 Planning Suggéré (8 semaines)

### Semaine 1 : Fondamentaux et Compréhension de l'Application

**Objectifs :**

- Comprendre l'architecture de l'application
- Faire fonctionner l'application en mode développement local
- Se familiariser avec Git et les workflows de développement

**Tâches :**

1. **Jour 1-2 : Configuration de l'environnement**

   ```bash
   # Installer les outils nécessaires
   - Git
   - Node.js
   - Docker Desktop
   - VS Code (ou votre éditeur préféré)
   ```

2. **Jour 3-4 : Comprendre le Backend**

   - Lisez le code dans `backend/src/server.js`
   - Lancez le backend localement
   - Testez les endpoints API avec curl ou Postman

   ```bash
   # Exemples de tests API
   curl http://localhost:5000/health
   curl http://localhost:5000/api/todos
   curl -X POST http://localhost:5000/api/todos \
     -H "Content-Type: application/json" \
     -d '{"title":"Apprendre DevOps","description":"Maîtriser Docker"}'
   ```

3. **Jour 5-6 : Comprendre le Frontend**

   - Lisez le code dans `frontend/app/page.tsx`
   - Lancez le frontend localement
   - Modifiez l'UI et observez les changements en temps réel

4. **Jour 7 : Git et Versioning**

   - Créez un dépôt GitHub pour votre projet
   - Poussez votre code
   - Créez une branche, faites des modifications, ouvrez une PR

   ```bash
   git checkout -b feature/mon-amelioration
   # Faites vos modifications
   git add .
   git commit -m "Ajout d'une fonctionnalité"
   git push origin feature/mon-amelioration
   ```

**✅ Validation :**

- [ ] L'application fonctionne localement (frontend + backend + database)
- [ ] Vous comprenez le flux de données entre frontend et backend
- [ ] Vous avez créé votre premier commit et votre première PR

---

### Semaine 2 : Docker - Conteneurisation

**Objectifs :**

- Comprendre les concepts de conteneurisation
- Créer et optimiser des Dockerfiles
- Lancer des conteneurs Docker

**Tâches :**

1. **Jour 1-2 : Théorie Docker**

   - Regardez les vidéos de formation sur Docker
   - Lisez la documentation Docker officielle
   - Concepts clés : Image, Container, Volume, Network

   ```bash
   # Commandes essentielles à maîtriser
   docker build -t mon-image .
   docker run -d --name mon-conteneur mon-image
   docker ps
   docker logs mon-conteneur
   docker exec -it mon-conteneur /bin/sh
   docker stop mon-conteneur
   docker rm mon-conteneur
   ```

2. **Jour 3-4 : Dockerfile Backend**

   - Analysez `backend/Dockerfile`
   - Comprenez chaque instruction
   - Buildez l'image backend
   - Lancez un conteneur backend

   ```bash
   cd backend
   docker build -t devops-backend:v1 .
   docker images
   docker run -d -p 5000:5000 --name backend devops-backend:v1
   ```

3. **Jour 5-6 : Dockerfile Frontend**

   - Analysez `frontend/Dockerfile`
   - Comprenez le multi-stage build
   - Buildez l'image frontend

   ```bash
   cd frontend
   docker build -t devops-frontend:v1 .
   docker run -d -p 3000:3000 --name frontend devops-frontend:v1
   ```

4. **Jour 7 : Networking Docker**

   - Créez un réseau Docker
   - Connectez les conteneurs entre eux

   ```bash
   docker network create devops-network
   docker run -d --name postgres --network devops-network postgres:15-alpine
   docker run -d --name backend --network devops-network -e DB_HOST=postgres devops-backend:v1
   ```

**Exercices Pratiques :**

1. **Optimiser la taille de l'image**
   - Utilisez des images de base plus légères
   - Supprimez les fichiers inutiles
   - Combinez les commandes RUN
2. **Ajouter des variables d'environnement**

   - Créez un fichier `.env`
   - Passez les variables au conteneur avec `-e` ou `--env-file`

3. **Créer un volume persistant**
   ```bash
   docker volume create postgres-data
   docker run -d -v postgres-data:/var/lib/postgresql/data postgres:15-alpine
   ```

**✅ Validation :**

- [ ] Vous comprenez la différence entre image et conteneur
- [ ] Vous savez créer un Dockerfile optimisé
- [ ] Vous pouvez lancer plusieurs conteneurs qui communiquent
- [ ] Vous maîtrisez les commandes Docker essentielles

---

### Semaine 3 : Docker Compose - Orchestration Multi-Conteneurs

**Objectifs :**

- Maîtriser Docker Compose
- Lancer une application multi-services
- Gérer les dépendances entre services

**Tâches :**

1. **Jour 1-2 : Comprendre docker-compose.yml**

   - Analysez le fichier `docker-compose.yml`
   - Comprenez chaque section : services, networks, volumes
   - Étudiez les health checks et depends_on

   ```yaml
   services:
     backend:
       depends_on:
         postgres:
           condition: service_healthy
   ```

2. **Jour 3-4 : Lancer la stack complète**

   ```bash
   # Lancer tous les services
   docker-compose up -d

   # Observer les logs
   docker-compose logs -f

   # Vérifier l'état des services
   docker-compose ps

   # Arrêter tout
   docker-compose down
   ```

3. **Jour 5-6 : Debugging et Troubleshooting**

   ```bash
   # Logs d'un service spécifique
   docker-compose logs -f backend

   # Reconstruire un service
   docker-compose up -d --build backend

   # Entrer dans un conteneur
   docker-compose exec backend /bin/sh

   # Voir l'utilisation des ressources
   docker stats
   ```

4. **Jour 7 : Optimisation et Best Practices**
   - Configurez les limites de ressources
   - Ajoutez des policies de restart
   - Organisez les variables d'environnement

**Exercices Pratiques :**

1. **Ajouter Redis au stack**

   ```yaml
   redis:
     image: redis:7-alpine
     ports:
       - "6379:6379"
     networks:
       - devops-network
   ```

2. **Créer un docker-compose.dev.yml**

   - Configurez le hot-reload pour le développement
   - Montez les volumes pour le code source

   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

3. **Configurer des limites de ressources**
   ```yaml
   backend:
     deploy:
       resources:
         limits:
           cpus: "0.5"
           memory: 512M
   ```

**✅ Validation :**

- [ ] Vous pouvez lancer toute l'application avec une seule commande
- [ ] Vous comprenez les dépendances entre services
- [ ] Vous savez débugger des problèmes de conteneurs
- [ ] Vous maîtrisez docker-compose pour le développement local

---

### Semaine 4 : CI/CD avec GitHub Actions

**Objectifs :**

- Comprendre les pipelines CI/CD
- Configurer GitHub Actions
- Automatiser les tests et le déploiement

**Tâches :**

1. **Jour 1-2 : Théorie CI/CD**
   - Concepts : Continuous Integration, Continuous Deployment
   - Avantages de l'automatisation
   - Étapes d'un pipeline : Build → Test → Deploy
2. **Jour 3-4 : Comprendre le workflow GitHub Actions**

   - Analysez `.github/workflows/ci-cd.yml`
   - Comprenez les concepts : triggers, jobs, steps
   - Étudiez les dépendances entre jobs

   ```yaml
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   ```

3. **Jour 5-6 : Pousser le code et observer le pipeline**

   ```bash
   git add .
   git commit -m "Configure CI/CD pipeline"
   git push origin main
   ```

   - Allez sur GitHub → Actions
   - Observez l'exécution du workflow
   - Analysez les logs de chaque job

4. **Jour 7 : Personnaliser le pipeline**
   - Ajoutez des notifications (Slack, Discord)
   - Créez un environnement de staging
   - Configurez des secrets GitHub

**Exercices Pratiques :**

1. **Ajouter des tests unitaires**

   ```javascript
   // backend/src/server.test.js
   describe("GET /api/todos", () => {
     it("should return all todos", async () => {
       const res = await request(app).get("/api/todos");
       expect(res.statusCode).toBe(200);
       expect(Array.isArray(res.body)).toBe(true);
     });
   });
   ```

2. **Configurer le build d'images Docker**

   - Publiez les images sur GitHub Container Registry
   - Utilisez des tags versionnés

   ```yaml
   - name: Build and push
     uses: docker/build-push-action@v5
     with:
       push: true
       tags: ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
   ```

3. **Ajouter un scan de sécurité**
   - Utilisez Trivy pour scanner les vulnérabilités
   - Bloquez le déploiement si des failles critiques sont trouvées

**✅ Validation :**

- [ ] Votre pipeline s'exécute automatiquement sur chaque push
- [ ] Les tests passent avec succès
- [ ] Les images Docker sont construites et publiées
- [ ] Vous comprenez comment débugger un pipeline qui échoue

---

### Semaine 5-6 : Kubernetes - Orchestration en Production

**Objectifs :**

- Comprendre Kubernetes et ses concepts
- Déployer l'application sur un cluster K8s
- Gérer les mises à jour et le scaling

**Semaine 5 : Concepts et Premiers Déploiements**

1. **Jour 1-2 : Théorie Kubernetes**
   - Concepts clés : Pod, Deployment, Service, Namespace
   - Architecture K8s : Master, Nodes, kubectl
   - Différence avec Docker Compose
2. **Jour 3-4 : Installer un cluster local**

   ```bash
   # Option 1 : Minikube
   minikube start
   kubectl cluster-info

   # Option 2 : Docker Desktop (activer Kubernetes dans les settings)
   ```

3. **Jour 5-7 : Premier déploiement**

   ```bash
   # Créer le namespace
   kubectl apply -f k8s/namespace.yaml

   # Déployer PostgreSQL
   kubectl apply -f k8s/postgres-deployment.yaml

   # Vérifier le déploiement
   kubectl get pods -n devops-app
   kubectl logs -f <pod-name> -n devops-app
   ```

**Semaine 6 : Déploiements Avancés et Production**

1. **Jour 1-2 : Déployer backend et frontend**

   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

2. **Jour 3-4 : ConfigMaps et Secrets**

   ```bash
   # Créer un ConfigMap
   kubectl create configmap app-config \
     --from-literal=API_URL=http://backend:5000 \
     -n devops-app

   # Créer un Secret
   kubectl create secret generic db-secret \
     --from-literal=password=monmotdepasse \
     -n devops-app
   ```

3. **Jour 5-6 : Scaling et High Availability**

   ```bash
   # Scaler manuellement
   kubectl scale deployment backend --replicas=5 -n devops-app

   # Auto-scaling (HPA)
   kubectl apply -f k8s/backend-deployment.yaml  # Contient HPA
   kubectl get hpa -n devops-app
   ```

4. **Jour 7 : Rolling Updates et Rollbacks**

   ```bash
   # Mettre à jour une image
   kubectl set image deployment/backend backend=devops-backend:v2 -n devops-app

   # Vérifier le rollout
   kubectl rollout status deployment/backend -n devops-app

   # Rollback si nécessaire
   kubectl rollout undo deployment/backend -n devops-app
   ```

**Exercices Pratiques :**

1. **Configurer les ressources requests/limits**

   ```yaml
   resources:
     requests:
       memory: "128Mi"
       cpu: "100m"
     limits:
       memory: "256Mi"
       cpu: "200m"
   ```

2. **Ajouter des probes**

   ```yaml
   livenessProbe:
     httpGet:
       path: /health
       port: 5000
     initialDelaySeconds: 30
     periodSeconds: 10

   readinessProbe:
     httpGet:
       path: /health
       port: 5000
     initialDelaySeconds: 10
     periodSeconds: 5
   ```

3. **Configurer un Ingress avec TLS**
   ```yaml
   spec:
     tls:
       - hosts:
           - myapp.example.com
         secretName: tls-secret
   ```

**✅ Validation :**

- [ ] Vous comprenez l'architecture Kubernetes
- [ ] Vous savez déployer une application multi-tiers sur K8s
- [ ] Vous maîtrisez kubectl et les commandes essentielles
- [ ] Vous pouvez scaler et mettre à jour une application sans downtime

---

### Semaine 7 : Monitoring et Observabilité

**Objectifs :**

- Mettre en place Prometheus et Grafana
- Créer des dashboards personnalisés
- Configurer des alertes

**Tâches :**

1. **Jour 1-2 : Lancer Prometheus et Grafana**

   ```bash
   # Avec Docker Compose
   docker-compose up -d prometheus grafana

   # Accès
   # Prometheus: http://localhost:9090
   # Grafana: http://localhost:3001 (admin/admin)
   ```

2. **Jour 3-4 : Comprendre les métriques**

   - Explorez l'interface Prometheus
   - Testez des requêtes PromQL

   ```promql
   # Exemples de requêtes
   up
   rate(http_requests_total[5m])
   node_memory_usage_bytes
   ```

3. **Jour 5-6 : Créer un dashboard Grafana**

   - Ajoutez Prometheus comme datasource
   - Créez un dashboard avec plusieurs panels
   - Métriques à suivre :
     - CPU/Memory usage
     - Nombre de requêtes HTTP
     - Temps de réponse API
     - Nombre de todos dans la DB

4. **Jour 7 : Configurer des alertes**
   ```yaml
   # prometheus/alerts.yml
   groups:
     - name: backend_alerts
       rules:
         - alert: HighMemoryUsage
           expr: memory_usage > 0.8
           for: 5m
           annotations:
             summary: "Memory usage is above 80%"
   ```

**Exercices Pratiques :**

1. **Ajouter des métriques custom dans le backend**

   ```javascript
   // Exemple avec prom-client
   const client = require("prom-client");
   const httpRequestsTotal = new client.Counter({
     name: "http_requests_total",
     help: "Total HTTP requests",
     labelNames: ["method", "route", "status"],
   });
   ```

2. **Créer un dashboard système complet**

   - CPU, Memory, Disk, Network
   - Métriques applicatives
   - Logs en temps réel

3. **Configurer des notifications**
   - Email, Slack, ou Discord
   - Test des alertes

**✅ Validation :**

- [ ] Prometheus collecte les métriques de vos services
- [ ] Vous avez créé un dashboard Grafana fonctionnel
- [ ] Vous comprenez comment écrire des requêtes PromQL
- [ ] Vous avez configuré au moins une alerte

---

### Semaine 8 : Sécurité et Best Practices

**Objectifs :**

- Sécuriser l'application et l'infrastructure
- Appliquer les best practices DevOps
- Préparer pour la production

**Tâches :**

1. **Jour 1-2 : Sécurité des conteneurs**

   - Utiliser des utilisateurs non-root
   - Scanner les vulnérabilités avec Trivy
   - Minimiser la surface d'attaque

   ```bash
   # Scanner une image
   trivy image devops-backend:latest
   ```

2. **Jour 3-4 : Gestion des secrets**

   - Ne jamais commiter les secrets dans Git
   - Utiliser des outils comme :
     - GitHub Secrets
     - Kubernetes Secrets
     - HashiCorp Vault (avancé)

   ```bash
   # Créer un secret K8s
   kubectl create secret generic api-keys \
     --from-literal=api-key=supersecret \
     -n devops-app
   ```

3. **Jour 5-6 : Network Policies et RBAC**

   ```yaml
   # Limiter le trafic réseau
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: backend-policy
   spec:
     podSelector:
       matchLabels:
         app: backend
     ingress:
       - from:
           - podSelector:
               matchLabels:
                 app: frontend
   ```

4. **Jour 7 : Checklist Production**
   - [ ] Les secrets sont sécurisés
   - [ ] Les images sont scannées
   - [ ] Le monitoring est en place
   - [ ] Les backups sont configurés
   - [ ] La documentation est à jour
   - [ ] Les limites de ressources sont définies
   - [ ] Le logging est centralisé
   - [ ] Les health checks fonctionnent

**Exercices Pratiques :**

1. **Mettre en place HTTPS**
   - Obtenir un certificat SSL (Let's Encrypt)
   - Configurer l'Ingress avec TLS
2. **Automatiser les backups PostgreSQL**

   ```bash
   # CronJob Kubernetes pour les backups
   apiVersion: batch/v1
   kind: CronJob
   metadata:
     name: postgres-backup
   spec:
     schedule: "0 2 * * *"  # Tous les jours à 2h
     jobTemplate:
       spec:
         template:
           spec:
             containers:
             - name: backup
               image: postgres:15-alpine
               command: ["/bin/sh"]
               args: ["-c", "pg_dump -h postgres devops_db > /backup/db.sql"]
   ```

3. **Configurer le rate limiting**
   - Protéger l'API contre les abus
   - Utiliser nginx-ingress ou un API Gateway

**✅ Validation :**

- [ ] Votre application est sécurisée selon les best practices
- [ ] Les secrets ne sont pas exposés
- [ ] Les vulnérabilités connues sont corrigées
- [ ] Vous avez un plan de backup et recovery

---

## 🎯 Après les 8 Semaines

Vous avez maintenant une base solide en DevOps ! Voici les prochaines étapes :

### 🚀 Projets Avancés

1. **Ajouter un Service Mesh (Istio)**

   - Traffic management
   - Service-to-service authentication
   - Observability avancée

2. **Infrastructure as Code avec Terraform**

   ```hcl
   resource "aws_instance" "app_server" {
     ami           = "ami-0c55b159cbfafe1f0"
     instance_type = "t2.micro"
   }
   ```

3. **GitOps avec ArgoCD**

   - Déploiement déclaratif
   - Synchronisation automatique
   - Rollback facilité

4. **Logging Centralisé (ELK Stack)**
   - Elasticsearch pour le stockage
   - Logstash pour l'agrégation
   - Kibana pour la visualisation

### 📚 Certifications Recommandées

- **Docker Certified Associate (DCA)**
- **Certified Kubernetes Administrator (CKA)**
- **Certified Kubernetes Application Developer (CKAD)**
- **AWS Certified DevOps Engineer**
- **Azure DevOps Engineer Expert**

### 🛠️ Outils à Explorer

- **Helm** - Package manager pour Kubernetes
- **Ansible** - Automatisation de la configuration
- **Jenkins** - Alternative à GitHub Actions
- **Vault** - Gestion des secrets
- **Consul** - Service discovery
- **Jaeger** - Distributed tracing

---

## 💡 Conseils Finaux

1. **Pratiquez régulièrement**

   - 1 heure par jour vaut mieux que 7 heures le weekend
   - Créez des petits projets personnels

2. **Documentez votre apprentissage**

   - Tenez un blog technique
   - Partagez vos découvertes sur GitHub

3. **Rejoignez la communauté**

   - Participez aux forums (Reddit, Stack Overflow)
   - Assistez à des meetups DevOps
   - Contribuez à des projets open-source

4. **Restez à jour**
   - Les technologies évoluent rapidement
   - Suivez les blogs et newsletters DevOps
   - Testez les nouvelles versions des outils

---

## 📊 Auto-Évaluation

Après chaque semaine, évaluez-vous sur ces critères :

**Compréhension** : Est-ce que je comprends les concepts ?

- [ ] 1 - Pas du tout
- [ ] 2 - Partiellement
- [ ] 3 - Bien
- [ ] 4 - Très bien
- [ ] 5 - Parfaitement

**Pratique** : Est-ce que je sais l'appliquer ?

- [ ] 1 - Pas encore
- [ ] 2 - Avec de l'aide
- [ ] 3 - Seul, mais lentement
- [ ] 4 - Rapidement
- [ ] 5 - Expertise

Si vous êtes en dessous de 3/5, reprenez la semaine avant de continuer !

---

**Bonne chance dans votre parcours DevOps ! 🚀**
