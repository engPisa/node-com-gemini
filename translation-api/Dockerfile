# --- ESTÁGIO 1: Builder ---
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app-api

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run generate

# --- ESTÁGIO 2: Production ---
FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app-api

COPY --from=builder /app-api/node_modules ./node_modules
COPY --from=builder /app-api/prisma ./prisma
COPY --from=builder /app-api/src ./src
COPY --from=builder /app-api/swagger.config.js ./ 
COPY --from=builder /app-api/src/server.js ./

RUN chown -R node:node /app-api/prisma

USER node

EXPOSE 3000

CMD [ "node", "server.js" ]