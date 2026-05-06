FROM node:24-alpine AS build

WORKDIR /app

COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

COPY . .

WORKDIR /app/apps/web

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app/apps/web

ENV NODE_ENV=production

# Copy built app
COPY --from=build /app/apps/web/dist ./dist

# Copy ALL node_modules (picocolors dan deps lain ada di sini)
COPY --from=build /app/apps/web/node_modules ./node_modules
COPY --from=build /app/apps/web/package.json ./package.json

EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
