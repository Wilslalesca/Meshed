FROM node:20-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
CMD ["npx", "tsx", "src/server.ts"]
