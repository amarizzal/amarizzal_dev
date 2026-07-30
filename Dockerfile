# Stage 1 — Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2 — Build aplikasi
#
# NEXT_PUBLIC_* dipanggang ke dalam bundle SAAT BUILD INI, bukan saat container
# jalan nanti. Nilainya dilewatkan sebagai build arg dari GitHub Actions
# (lihat docker-compose.yml build.args dan deploy.yml) — mengisi file .env di
# VPS TIDAK CUKUP untuk variabel NEXT_PUBLIC_*.
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_APP_URL
# Tambahkan ARG lain sesuai kebutuhan project (NEXT_PUBLIC_*)
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

# Stage 3 — Production runner (image lebih kecil)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
