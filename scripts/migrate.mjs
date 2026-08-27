/**
 * Menerapkan migrasi di db/migrations/*.sql secara berurutan, idempoten.
 * Aman dijalankan berulang — versi yang sudah tercatat di schema_migrations
 * dilewati. Pakai: npm run db:migrate
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL belum diatur (cek .env.local).')
  process.exit(1)
}

const client = new pg.Client({ connectionString: DATABASE_URL })
await client.connect()

// Bootstrap: schema_migrations harus ada SEBELUM kita bisa mengecek apa pun.
// Migrasi 0001 juga mendefinisikannya (if not exists), jadi ini aman dobel.
await client.query(`
  create table if not exists schema_migrations (
    version     text primary key,
    applied_at  timestamptz not null default now()
  )
`)

const dir = path.join(process.cwd(), 'db', 'migrations')
const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()

if (files.length === 0) {
  console.log('Tidak ada berkas migrasi di db/migrations/.')
  process.exit(0)
}

let diterapkan = 0

for (const file of files) {
  const { rows } = await client.query(
    'select 1 from schema_migrations where version = $1',
    [file],
  )
  if (rows.length > 0) {
    console.log(`- ${file} (sudah diterapkan)`)
    continue
  }

  const sql = await readFile(path.join(dir, file), 'utf8')
  console.log(`→ menerapkan ${file}...`)
  try {
    await client.query('begin')
    await client.query(sql)
    await client.query('insert into schema_migrations (version) values ($1)', [file])
    await client.query('commit')
    console.log(`✓ ${file}`)
    diterapkan++
  } catch (e) {
    await client.query('rollback')
    console.error(`✗ ${file} gagal:`, e.message)
    process.exit(1)
  }
}

console.log(
  diterapkan === 0
    ? 'Migrasi selesai — tidak ada yang baru.'
    : `Migrasi selesai — ${diterapkan} berkas diterapkan.`,
)
await client.end()
