import 'server-only'
import { Pool, types } from 'pg'

// numeric (OID 1700) default-nya string di node-pg — angka ditampilkan
// langsung di JS (level skill, tahun, dsb), jadi lebih praktis number.
types.setTypeParser(1700, (v) => Number(v))
// date (OID 1082) cukup sebagai 'YYYY-MM-DD' tanpa konversi zona waktu.
types.setTypeParser(1082, (v) => v)

declare global {
  // Hindari pool baru tiap hot-reload di mode dev. Nama global unik supaya
  // tidak bentrok kalau suatu saat ada proses lain di ruang global yang sama.
  var __amzPool: Pool | undefined
}

export const pool =
  global.__amzPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // max 3, BUKAN 10 seperti ssb-poutlry. Postgres ini dipakai bersama
    // dengan max_connections=20; jatah ssb 10, sisanya untuk superuser +
    // migrasi. Ditegakkan ganda di level role: `connection limit 5`.
    max: 3,
    idleTimeoutMillis: 30_000, // lepaskan koneksi nganggur cepat
    connectionTimeoutMillis: 5_000, // gagal cepat kalau db sedang restart
  })

if (process.env.NODE_ENV !== 'production') global.__amzPool = pool

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await pool.query(text, params)
  return res.rows as T[]
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
