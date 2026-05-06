FROM node:24-alpine AS build

WORKDIR /app

# Copy root package.json (for workspaces config)
COPY package.json ./
COPY package-lock.json* ./

# Copy web app package.json
COPY apps/web/package.json ./apps/web/package.json

# Install dependencies
RUN npm install

# Copy source code
COPY . .

WORKDIR /app/apps/web

# Build the app
RUN npm run build

# Production stage - use same node image, not alpine for better compatibility
FROM node:24-alpine AS runner

WORKDIR /app/apps/web

ENV NODE_ENV=production

# Copy built output
COPY --from=build /app/apps/web/dist ./dist

# Copy node_modules (includes picocolors and all runtime deps)
COPY --from=build /app/apps/web/node_modules ./node_modules

# Copy package.json
COPY --from=build /app/apps/web/package.json ./package.json

EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
