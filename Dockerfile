# syntax=docker/dockerfile:1

# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:24-alpine AS build

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json package-lock.json* ./

# Use ci for reproducible installs from lockfile
RUN npm ci

# Copy source and build static output
COPY . .
RUN npm run build

# ─── Production stage ─────────────────────────────────────────────────────────
# Astro builds to plain static files — nginx serves them with zero Node runtime.
FROM nginx:stable-alpine AS runner

# Copy the built static site
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
