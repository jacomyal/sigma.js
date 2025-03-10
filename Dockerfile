# Etap budowania
FROM node:18-alpine AS build

WORKDIR /app

# Kopiujemy pliki package.json i instalujemy zależności
COPY package*.json ./
COPY lerna.json ./
COPY tsconfig*.json ./
COPY babel.config.js ./

# Kopiujemy katalogi packages
COPY packages ./packages

# Instalujemy zależności
RUN npm install

# Budujemy aplikację demo
RUN cd packages/demo && npm run build

# Etap produkcyjny
FROM node:18-alpine AS production

WORKDIR /app

# Kopiujemy zbudowaną aplikację demo
COPY --from=build /app/packages/demo/build ./build

# Kopiujemy plik API i dane
COPY api-server.js ./
COPY graph_data_cache.json ./

# Instalujemy tylko zależności produkcyjne dla API
RUN npm install express cors body-parser

# Zmienna środowiskowa dla portu
ENV PORT=5001

# Eksponujemy port
EXPOSE 5001

# Uruchamiamy serwer API
CMD ["node", "api-server.js"] 