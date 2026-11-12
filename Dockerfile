# One container: Vite frontend + NestJS API (same origin, no CORS).
# Works on Railway, Koyeb, and other Docker hosts.

FROM node:20-bookworm-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM node:20-bookworm-slim AS backend
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend ./
RUN npx prisma generate && npm run build

FROM node:20-bookworm-slim
WORKDIR /app/backend
ENV NODE_ENV=production
ENV CLIENT_DIR=/app/backend/public
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=backend /app/backend/node_modules ./node_modules
COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/prisma ./prisma
COPY --from=backend /app/backend/package.json ./
COPY --from=frontend /app/frontend/dist ./public
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
