# Image de base Node.js
FROM node:18-alpine

# Métadonnées
LABEL maintainer="DevOps Learning Project"
LABEL description="Backend API pour l'apprentissage CI/CD"

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Health check (important pour Docker et Kubernetes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Utilisateur non-root pour la sécurité
USER node

# Commande de démarrage
CMD ["npm", "start"]

