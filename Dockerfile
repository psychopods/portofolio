FROM node:22-slim AS base
ENV NODE_ENV=production

# Install build dependencies for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency configs
COPY package*.json ./
RUN npm ci --include=dev

# Copy source files and build the production bundle
COPY . .
RUN npm run build

# Prune development modules to minimize image size
RUN npm prune --omit=dev

# Expose port and configure environment
EXPOSE 4321
ENV PORT=4321
ENV HOST=0.0.0.0

# Start Astro Node SSR Server
CMD ["node", "dist/server/entry.mjs"]
