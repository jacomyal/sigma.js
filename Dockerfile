# Bazowy obraz z Node.js i Pythonem
FROM node:18-bullseye

# Ustaw katalog roboczy
WORKDIR /app

# Kopiuj i instaluj zależności Node.js
COPY package.json package-lock.json ./
RUN npm install

# Kopiuj kod backendu i frontendu
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Instaluj zależności backendu
WORKDIR /app/backend
RUN npm install

# Buduj frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Wróć do głównego katalogu
WORKDIR /app

# Kopiuj skrypt Pythona i zależności
COPY python/ ./python/
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install -r python/requirements.txt

# Eksponuj port 8080
EXPOSE 8080

# Zmienna środowiskowa dla portu
ENV PORT=8080

# Uruchom serwer
CMD ["node", "backend/api-server.js"] 