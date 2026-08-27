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
# BARU — migrasi & seed dijalankan di dalam container ini saat deploy.
# `pg` dan `bcryptjs` sudah ikut ter-trace ke .next/standalone/node_modules
# (dipakai src/lib/db.ts & src/lib/auth.ts), jadi scripts/*.mjs bisa
# me-resolve keduanya dari /app/node_modules tanpa npm install tambahan.
COPY --from=builder /app/db ./db
COPY --from=builder /app/scripts ./scripts
# Titik mount volume uploads_data (lihat docker-compose.yml). Isi apa pun di
# sini akan tertutup mount begitu volume terpasang — hanya jaga-jaga direktori
# ada sebelum volume pertama kali dipasang.
RUN mkdir -p /app/public/uploads

EXPOSE 3000
CMD ["node", "server.js"]
