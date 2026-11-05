FROM node:20-alpine

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port par défaut d'Angular
EXPOSE 4200

# Lancer le serveur de dev avec écoute sur toutes les interfaces et polling pour Docker
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]