# --- ESTÁGIO 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app-api

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run generate

FROM node:20-alpine

WORKDIR /app-api

COPY --from=builder /app-api/node_modules ./node_modules

COPY --from=builder /app-api/prisma ./prisma
COPY --from=builder /app-api/src ./src
COPY --from=builder /app-api/swagger.config.js ./ 
COPY --from=builder /app-api/src/server.js ./

USER node

EXPOSE 3000

CMD [ "node", "server.js" ]