# Multi-stage Docker build for QAgent
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/server/package*.json ./apps/server/

# Install dependencies
RUN npm install
RUN cd apps/server && npm install

# Copy source files
COPY . .

# Build frontend and backend
RUN npm run build
RUN cd apps/server && npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/server ./apps/server

EXPOSE 4000

CMD ["node", "apps/server/dist/app.js"]
