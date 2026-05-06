FROM node:20-alpine AS base

# ── deps: install node_modules ──────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── builder: generate Prisma client + Next.js production build ───────────────
# Also used as the migration runner (full node_modules, no DB needed at build).
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ── runner: lean production image (no Prisma CLI, no dev deps) ───────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone output (includes traced node_modules for the app)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Generated Prisma client (runtime, not CLI)
COPY --from=builder /app/src/generated ./src/generated

RUN mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
