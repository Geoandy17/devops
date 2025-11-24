# 🚀 Démarrage Rapide (5 minutes)

Ce guide vous permet de lancer l'application complète en quelques minutes.

## Prérequis

Installez uniquement **Docker Desktop** :

- 🍎 **Mac** : [Télécharger Docker Desktop pour Mac](https://www.docker.com/products/docker-desktop)
- 🪟 **Windows** : [Télécharger Docker Desktop pour Windows](https://www.docker.com/products/docker-desktop)
- 🐧 **Linux** : [Installer Docker](https://docs.docker.com/engine/install/)

## Lancement de l'Application

### Option 1 : Script automatique (Recommandé)

```bash
# Cloner le projet
git clone <votre-repo>
cd devops

# Rendre le script exécutable
chmod +x start.sh

# Lancer le projet
./start.sh
```

### Option 2 : Commande manuelle

```bash
# Cloner le projet
git clone <votre-repo>
cd devops

# Lancer tous les services
docker-compose up --build -d

# Attendre 10-15 secondes que tout démarre
```

## Accès aux Services

Une fois lancé, ouvrez votre navigateur :

| Service            | URL                   | Description                  |
| ------------------ | --------------------- | ---------------------------- |
| 🎨 **Frontend**    | http://localhost:3000 | Application Todo (interface) |
| 🔌 **Backend API** | http://localhost:5000 | API REST                     |
| 📊 **Prometheus**  | http://localhost:9090 | Métriques et monitoring      |
| 📈 **Grafana**     | http://localhost:3001 | Dashboards (admin/admin)     |

## Tester l'Application

### Via l'interface web (Frontend)

1. Ouvrez http://localhost:3000
2. Ajoutez une tâche (ex: "Apprendre Docker")
3. Cochez la case pour la marquer comme complétée
4. Supprimez-la avec le bouton 🗑️

### Via l'API (Backend)

```bash
# Health check
curl http://localhost:5000/health

# Récupérer toutes les tâches
curl http://localhost:5000/api/todos

# Créer une nouvelle tâche
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma première tâche","description":"Découvrir DevOps"}'

# Mettre à jour une tâche (ID = 1)
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Supprimer une tâche (ID = 1)
curl -X DELETE http://localhost:5000/api/todos/1
```

## Commandes Utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Vérifier l'état des services

```bash
docker-compose ps
```

### Redémarrer un service

```bash
docker-compose restart backend
```

### Arrêter tous les services

```bash
docker-compose down
```

### Tout supprimer (y compris les données)

```bash
docker-compose down -v
```

## Résolution de Problèmes

### Port déjà utilisé

Si un port est déjà utilisé (erreur "port is already allocated") :

```bash
# Trouver le processus qui utilise le port 3000 (exemple)
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans docker-compose.yml
```

### Conteneur qui redémarre en boucle

```bash
# Voir les logs du conteneur problématique
docker-compose logs backend

# Reconstruire le conteneur
docker-compose up --build backend
```

### Problèmes de connexion à la base de données

```bash
# Vérifier que PostgreSQL est bien démarré
docker-compose ps postgres

# Voir les logs PostgreSQL
docker-compose logs postgres

# Redémarrer PostgreSQL
docker-compose restart postgres
```

### Docker manque de ressources

Augmentez les ressources allouées à Docker Desktop :

1. Ouvrez Docker Desktop
2. Settings → Resources
3. Augmentez CPU et Memory (recommandé : 4 CPU, 4 GB RAM)
4. Apply & Restart

## Prochaines Étapes

Maintenant que votre application fonctionne :

1. 📖 **Lisez le [README.md](README.md)** pour comprendre l'architecture complète
2. 🎓 **Suivez le [LEARNING_PATH.md](LEARNING_PATH.md)** pour un parcours d'apprentissage structuré
3. 🔧 **Explorez le code** dans `backend/` et `frontend/`
4. 🐳 **Étudiez les Dockerfiles** pour comprendre la conteneurisation
5. ⚙️ **Analysez le docker-compose.yml** pour l'orchestration

## Concepts DevOps Démontrés

En lançant ce projet, vous venez d'utiliser :

- ✅ **Conteneurisation** - Docker pour isoler les services
- ✅ **Orchestration** - Docker Compose pour gérer plusieurs conteneurs
- ✅ **Microservices** - Architecture frontend/backend/database séparée
- ✅ **Infrastructure as Code** - Configuration déclarative (YAML)
- ✅ **Monitoring** - Prometheus et Grafana pour observer le système

---

**Besoin d'aide ?** Consultez le [README.md](README.md) pour plus de détails ou ouvrez une issue sur GitHub.

**Bonne exploration DevOps ! 🚀**
