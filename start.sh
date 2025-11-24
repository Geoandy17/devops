#!/bin/bash

# Script de démarrage rapide pour le projet DevOps
# Usage: ./start.sh

echo "🚀 Démarrage du projet DevOps..."
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    echo "   👉 https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Vérifier que Docker Compose est disponible
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Arrêter les conteneurs existants s'ils existent
echo "🧹 Nettoyage des conteneurs existants..."
docker-compose down 2>/dev/null

# Construire et lancer tous les services
echo ""
echo "🏗️  Construction et lancement de tous les services..."
echo "   Cela peut prendre quelques minutes la première fois..."
echo ""

docker-compose up --build -d

# Attendre que les services démarrent
echo ""
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier l'état des services
echo ""
echo "📊 État des services:"
docker-compose ps

echo ""
echo "✅ Projet DevOps démarré avec succès !"
echo ""
echo "🌐 Accès aux services:"
echo "   • Frontend:    http://localhost:3000"
echo "   • Backend API: http://localhost:5000"
echo "   • Prometheus:  http://localhost:9090"
echo "   • Grafana:     http://localhost:3001 (admin/admin)"
echo ""
echo "📝 Commandes utiles:"
echo "   • Voir les logs:        docker-compose logs -f"
echo "   • Arrêter les services: docker-compose down"
echo "   • Redémarrer:           docker-compose restart"
echo ""
echo "📚 Consultez le README.md pour le guide complet d'apprentissage"
echo ""

