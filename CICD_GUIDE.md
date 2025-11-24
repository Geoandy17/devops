# 🔄 Guide Complet : CI/CD avec GitHub Actions

## 📚 Table des Matières

1. [Qu'est-ce que CI/CD ?](#quest-ce-que-cicd-)
2. [Le Problème Sans CI/CD](#le-problème-sans-cicd)
3. [La Solution : CI/CD](#la-solution--cicd)
4. [GitHub Actions](#github-actions)
5. [Structure d'un Workflow](#structure-dun-workflow)
6. [Les Composants d'un Workflow](#les-composants-dun-workflow)
7. [Pipeline Complet pour Backend](#pipeline-complet-pour-backend)
8. [Secrets et Variables](#secrets-et-variables)
9. [Exemples Pratiques](#exemples-pratiques)
10. [Bonnes Pratiques](#bonnes-pratiques)

---

## Qu'est-ce que CI/CD ? 🤔

### Définitions

**CI** = **Continuous Integration** (Intégration Continue)

- Tester automatiquement chaque changement de code
- S'assurer que rien n'est cassé
- Détecter les bugs rapidement

**CD** = **Continuous Deployment** (Déploiement Continu)

- Déployer automatiquement en production
- Si les tests passent
- Sans intervention humaine

---

### L'Analogie de l'Usine

```
Sans CI/CD (Manuel) :
👨‍💻 Dev code
     ↓
📧 Envoie au testeur
     ↓
🧪 Tests manuels (2h)
     ↓
📦 Build manuel (30min)
     ↓
🚀 Déploiement manuel (1h)
     ↓
🐛 Bug trouvé ? Recommence tout !

Total : 3h30 + risque d'erreurs humaines


Avec CI/CD (Automatique) :
👨‍💻 Dev code
     ↓
git push
     ↓
🤖 TOUT est automatique :
   ✅ Tests (2 min)
   ✅ Build (3 min)
   ✅ Déploiement (2 min)
     ↓
✨ En production !

Total : 7 minutes + zéro erreur humaine
```

---

## Le Problème Sans CI/CD 😫

### Processus Manuel (Ancien Temps)

```bash
# 1. Développeur termine une feature
git add .
git commit -m "Nouvelle feature"
git push

# 2. Testeur manuel teste (2 heures)
# "Ça a l'air bon..."

# 3. DevOps build l'image Docker
ssh serveur-prod
cd app
docker build -t myapp:v2.5 .

# 4. Tests de l'image
docker run myapp:v2.5
# "Oups, ça ne marche pas..."

# 5. Retour au dev
# "Peux-tu corriger ?"

# 6. Recommence tout le processus...
```

**Problèmes :**

- ❌ Lent (plusieurs heures)
- ❌ Erreurs humaines
- ❌ Pas reproductible
- ❌ Différences dev/prod
- ❌ Déploiements stressants
- ❌ Bugs découverts tard

---

## La Solution : CI/CD ✨

### Processus Automatisé (Moderne)

```bash
# 1. Développeur termine une feature
git add .
git commit -m "Nouvelle feature"
git push origin main

# 2. GitHub Actions s'active AUTOMATIQUEMENT :

✅ Job 1 : Tests (2 minutes)
   - npm install
   - npm test
   - Si échec → STOP et notifie

✅ Job 2 : Build (3 minutes)
   - docker build
   - Si échec → STOP et notifie

✅ Job 3 : Publish (1 minute)
   - docker push vers registry
   - Tag l'image avec le numéro de version

✅ Job 4 : Deploy (2 minutes)
   - Déploie sur le serveur
   - Rolling update (zéro downtime)
   - Health check

✅ Job 5 : Notification (5 secondes)
   - Slack : "✅ Deploy réussi v2.5"
   - Email aux devs

# Total : 8 minutes, ZÉRO intervention humaine
```

---

## GitHub Actions 🤖

### Qu'est-ce que c'est ?

**GitHub Actions** est l'outil de CI/CD intégré à GitHub.

**Avantages :**

- ✅ Gratuit (2000 minutes/mois)
- ✅ Intégré à GitHub (pas de config externe)
- ✅ Facile à utiliser
- ✅ Énorme marketplace d'actions
- ✅ Supporte Docker nativement

---

### Comment Ça Marche ?

```
1. Vous créez un fichier YAML dans :
   .github/workflows/ci-cd.yml

2. GitHub détecte le fichier

3. À chaque git push, le workflow s'exécute

4. Vous voyez les résultats dans l'onglet "Actions"
```

---

### Où Ça S'exécute ?

```
GitHub met à disposition des machines virtuelles :
- Ubuntu Linux (le plus courant)
- Windows Server
- macOS

Avec :
- Docker pré-installé
- Node.js, Python, etc.
- 7 GB RAM, 14 GB SSD
```

---

## Structure d'un Workflow 📝

### Fichier de Base

```yaml
# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

# Quand lancer le workflow ?
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Les jobs à exécuter
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t myapp .
```

---

## Les Composants d'un Workflow 🔧

### 1. name

```yaml
name: CI/CD Pipeline
```

**Rôle :** Nom du workflow (affiché dans l'onglet Actions)

---

### 2. on (Déclencheurs)

```yaml
# Lancer sur push vers main
on:
  push:
    branches: [main]

# Lancer sur pull request
on:
  pull_request:
    branches: [main]

# Lancer manuellement
on:
  workflow_dispatch:

# Lancer à intervalles réguliers (cron)
on:
  schedule:
    - cron: '0 0 * * *'  # Tous les jours à minuit

# Plusieurs déclencheurs
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

---

### 3. jobs

```yaml
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      # ...
```

**Un job = un ensemble d'étapes à exécuter**

**Les jobs peuvent :**

- S'exécuter en **parallèle** (par défaut)
- S'exécuter en **séquence** (avec `needs`)
- Avoir des **conditions** (`if`)

---

### 4. runs-on

```yaml
runs-on: ubuntu-latest
```

**Rôle :** Quelle machine virtuelle utiliser

**Options :**

- `ubuntu-latest` (recommandé)
- `ubuntu-22.04` (version spécifique)
- `windows-latest`
- `macos-latest`

---

### 5. steps

```yaml
steps:
  - name: Étape 1
    run: echo "Hello"

  - name: Étape 2
    uses: actions/checkout@v4

  - name: Étape 3
    run: |
      npm install
      npm test
```

**Chaque step = une action à faire**

**Deux types :**

- `run` : Commande shell
- `uses` : Action pré-faite du marketplace

---

### 6. uses (Actions du Marketplace)

```yaml
# Checkout le code
- uses: actions/checkout@v4

# Setup Node.js
- uses: actions/setup-node@v4
  with:
    node-version: "18"

# Setup Docker Buildx
- uses: docker/setup-buildx-action@v3

# Login à Docker Hub
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

---

### 7. needs (Dépendances entre jobs)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: test # Attend que 'test' soit fini
    runs-on: ubuntu-latest
    steps:
      - run: docker build .

  deploy:
    needs: [test, build] # Attend test ET build
    runs-on: ubuntu-latest
    steps:
      - run: kubectl apply -f k8s/
```

**Ordre d'exécution :**

```
1. test
     ↓
2. build (attend test)
     ↓
3. deploy (attend test + build)
```

---

### 8. if (Conditions)

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploy seulement sur main"

  notify:
    if: failure()
    steps:
      - run: echo "Un job a échoué !"
```

---

### 9. env (Variables d'environnement)

```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    env:
      DATABASE_URL: postgres://localhost/mydb
    steps:
      - run: echo $NODE_ENV
```

---

### 10. secrets (Données sensibles)

```yaml
steps:
  - name: Login to Docker Hub
    uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}
```

**Les secrets sont définis dans :**

```
Repo GitHub → Settings → Secrets and variables → Actions
```

---

## Pipeline Complet pour Backend 🚀

### Workflow Complet

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  DOCKER_IMAGE: myusername/backend
  NODE_VERSION: "18"

jobs:
  # ================================
  # JOB 1 : TESTS
  # ================================
  test:
    name: 🧪 Tests Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: 📚 Install dependencies
        run: npm ci

      - name: 🧪 Run tests
        run: npm test

      - name: 📊 Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  # ================================
  # JOB 2 : BUILD IMAGE DOCKER
  # ================================
  build:
    name: 🐳 Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: 🔐 Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: 🏷️ Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.DOCKER_IMAGE }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: 🏗️ Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ env.DOCKER_IMAGE }}:buildcache
          cache-to: type=registry,ref=${{ env.DOCKER_IMAGE }}:buildcache,mode=max

  # ================================
  # JOB 3 : SCAN DE SÉCURITÉ
  # ================================
  security:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔍 Run Trivy scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.DOCKER_IMAGE }}:latest
          format: "sarif"
          output: "trivy-results.sarif"

      - name: 📤 Upload to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: "trivy-results.sarif"

  # ================================
  # JOB 4 : DEPLOY (Simulation)
  # ================================
  deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🚀 Deploy to production
        run: |
          echo "🎉 Déploiement en production !"
          echo "Image: ${{ env.DOCKER_IMAGE }}:latest"
          # Ici, vous ajouteriez vos commandes de déploiement
          # Par exemple :
          # - kubectl apply -f k8s/
          # - helm upgrade myapp ./charts
          # - ssh serveur "docker-compose pull && docker-compose up -d"

      - name: 📝 Generate deployment summary
        run: |
          echo "### 🎉 Déploiement réussi !" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**Commit:** ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "**Auteur:** ${{ github.actor }}" >> $GITHUB_STEP_SUMMARY
          echo "**Image:** \`${{ env.DOCKER_IMAGE }}:latest\`" >> $GITHUB_STEP_SUMMARY

  # ================================
  # JOB 5 : NOTIFICATION
  # ================================
  notify:
    name: 📢 Notification
    runs-on: ubuntu-latest
    needs: [deploy]
    if: always()

    steps:
      - name: 📊 Check status
        run: |
          if [ "${{ needs.deploy.result }}" == "success" ]; then
            echo "✅ Pipeline réussi !"
          else
            echo "❌ Pipeline échoué !"
          fi
```

---

## Secrets et Variables 🔐

### Créer des Secrets GitHub

1. Allez sur votre repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
4. Ajoutez :
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `DEPLOY_KEY` (si SSH)

### Utiliser les Secrets

```yaml
steps:
  - name: Login to Docker Hub
    env:
      USERNAME: ${{ secrets.DOCKER_USERNAME }}
      PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
    run: |
      echo $PASSWORD | docker login -u $USERNAME --password-stdin
```

**⚠️ Les secrets ne sont JAMAIS affichés dans les logs !**

---

## Exemples Pratiques 💻

### Exemple 1 : Tests Simples

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "18"

      - run: npm install
      - run: npm test
```

---

### Exemple 2 : Build et Push Docker

```yaml
name: Build Docker

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - run: docker build -t myusername/myapp:latest ./backend
      - run: docker push myusername/myapp:latest
```

---

### Exemple 3 : Déploiement SSH

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
```

---

### Exemple 4 : Multi-environnements

```yaml
name: Multi-env Deploy

on:
  push:
    branches: [main, staging, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Determine environment
        id: env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == "refs/heads/staging" ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
          fi

      - name: Deploy to ${{ steps.env.outputs.environment }}
        run: |
          echo "Deploying to ${{ steps.env.outputs.environment }}"
```

---

## Bonnes Pratiques 🌟

### 1. Séparer les Jobs

```yaml
# ✅ Bon (jobs séparés)
jobs:
  test:
    # ...
  build:
    needs: test
    # ...
  deploy:
    needs: build
    # ...

# ❌ Mauvais (tout dans un job)
jobs:
  all:
    steps:
      - run: npm test
      - run: docker build
      - run: deploy
```

---

### 2. Utiliser le Cache

```yaml
# ✅ Avec cache (rapide)
- uses: actions/setup-node@v4
  with:
    node-version: "18"
    cache: "npm"

# ❌ Sans cache (lent)
- uses: actions/setup-node@v4
  with:
    node-version: "18"
```

---

### 3. Conditions sur les Déploiements

```yaml
# ✅ Déployer seulement sur main
deploy:
  if: github.ref == 'refs/heads/main'
  steps:
    # ...

# ✅ Déployer seulement si tag
deploy:
  if: startsWith(github.ref, 'refs/tags/')
  steps:
    # ...
```

---

### 4. Fail Fast

```yaml
# ✅ Arrêter si les tests échouent
jobs:
  test:
    # ...

  build:
    needs: test # N'exécute pas si test échoue
    # ...
```

---

### 5. Timeout

```yaml
jobs:
  test:
    timeout-minutes: 10 # Arrêter après 10 minutes
    steps:
      # ...
```

---

### 6. Notifications

```yaml
# Slack
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}

# Discord
- name: Notify Discord
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## Aide-Mémoire (Cheat Sheet) 📋

### Structure Minimale

```yaml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Hello CI/CD"
```

### Actions Courantes

```yaml
# Checkout code
- uses: actions/checkout@v4

# Setup Node.js
- uses: actions/setup-node@v4
  with:
    node-version: "18"

# Setup Docker
- uses: docker/setup-buildx-action@v3

# Login Docker Hub
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

# Build and push
- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myimage:latest
```

---

## Récapitulatif 🎯

### CI/CD en 5 Points

1. **Automatise** tout le processus dev → prod
2. **GitHub Actions** = gratuit et intégré
3. **Workflows** = fichiers YAML dans `.github/workflows/`
4. **Jobs** = tâches qui s'exécutent (test, build, deploy)
5. **Déclencheurs** = push, pull request, manual, cron

### Pipeline Typique

```
git push
   ↓
✅ Tests (2 min)
   ↓
✅ Build Docker (3 min)
   ↓
✅ Security scan (2 min)
   ↓
✅ Deploy (2 min)
   ↓
✨ En production !
```

---

**Félicitations ! Vous maîtrisez maintenant les bases du CI/CD avec GitHub Actions ! 🎉**

**Prochaine étape :** Créer le workflow pour votre projet backend ! 🚀
