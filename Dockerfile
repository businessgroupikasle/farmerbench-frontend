# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json turbo.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

RUN npm ci

# Copy sources
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build Shared Package
WORKDIR /app/shared
RUN npm run build

# Build Web App
WORKDIR /app/frontend
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Production stage with NGINX
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
