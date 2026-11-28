# ─── Stage 1: Build & Dependencies ─────────────────────────────────────────────
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# ─── Stage 2: Production Runner ─────────────────────────────────────────────────
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install curl for Docker healthcheck
RUN apk add --no-cache curl

# Create non-root system user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy installed production node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Container healthcheck targeting the liveness probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
