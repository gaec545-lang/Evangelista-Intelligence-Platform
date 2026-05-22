# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias (mejor cache de capas de Docker)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copiar el código fuente
COPY . .

# Use environment variables from .env during build
# Vite automatically reads .env files, so no ARGs are needed.
# Ensure the .env file is present in the build context.
RUN if [ ! -f .env ]; then cp .env.example .env; fi && npm run build

# ── Stage 2: Servir con Nginx ────────────────────────────────────────────────
FROM nginx:alpine

# Copiar el build generado por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración Nginx para SPA con proxy al backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
