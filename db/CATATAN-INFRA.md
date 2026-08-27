# Catatan infrastruktur database

Database `amarizzal_dev` menumpang **instance Postgres milik project `ssb-poutlry`**
(container `db` di `~/projects/<SSB_FOLDER>/docker-compose.yml` pada droplet yang sama),
bukan container Postgres sendiri. Ini keputusan sadar karena droplet hanya 512 MB RAM.

Detail lengkap, alasan, dan urutan eksekusi yang aman ada di rencana implementasi:
`/Users/rizal/.claude/plans/users-rizal-claude-projects-personal-po-abundant-valiant.md`
(Langkah 1). Ringkasan yang perlu diingat siapa pun yang menyentuh infra ini:

## Topologi

```
                 network: npm_network (external)
                          │
                 ┌────────┴────────┐
                 │ amarizzal-nextjs│──┐
                 └──────────────────┘  │
                                        │ network: db_shared (external)
                 ┌──────────────────┐  │
project ssb ───▶ │ db (postgres:17) │◀─┘   alias di db_shared: "ssb-db"
                 │  network: default │       (TIDAK di npm_network, TIDAK expose ke host)
                 │  network: db_shared (alias ssb-db)
                 └──────────────────┘
                          │ network: default
                 ┌────────┴────────┐
                 │   ssb-nextjs    │  (host "db", tidak berubah)
                 └──────────────────┘
```

## Aturan yang TIDAK BOLEH dilanggar

1. **`db` container tidak pernah publish port ke host** dan tidak pernah masuk `npm_network`.
   Satu-satunya jalur baru adalah network `db_shared`, dibuat eksplisit
   (`docker network create db_shared`), bukan network default Compose mana pun.
2. **Host untuk amarizzal SELALU `ssb-db`** (alias di `db_shared`), bukan `db`. Nama generik
   `db` sudah dipakai `ssb-nextjs` di network lain — memakainya di sini berisiko collision
   yang sama seperti yang sudah pernah terjadi di project ini (lihat komentar di
   `docker-compose.yml` masing-masing project).
3. **`max_connections` Postgres TETAP 20.** Jangan dinaikkan tanpa menaikkan `mem_limit` `db`
   secara proporsional — cgroup OOM-kill satu backend Postgres menjatuhkan seluruh instance,
   termasuk `ssb-poultry` yang melayani data produksi klien.
4. **Pool koneksi amarizzal `max: 3`**, ditegakkan ganda dengan
   `alter role amarizzal connection limit 5` di level database (lihat `src/lib/db.ts`).
5. **Role `amarizzal` tidak boleh bisa `CONNECT` ke `ssb_poultry`.** Isolasi ditegakkan dengan
   `revoke connect ... from public` di kedua database. Setelah setup, uji ini HARUS gagal:
   ```
   psql "postgresql://amarizzal:PASSWORD@ssb-db:5432/ssb_poultry" -c 'select 1'
   ```

## Setup awal (dijalankan sekali, manual, di droplet)

Urutan lengkap ada di Langkah 1.4 dan 1.7 rencana implementasi: backup `pg_dumpall` dulu,
`docker network create db_shared`, `docker network connect` zero-downtime, baru terapkan
perubahan `docker-compose.yml` kedua project, lalu buat role + database dengan SQL di 1.7.

**Belum dieksekusi di droplet pada titik penulisan ini** — pengembangan berjalan dulu
sepenuhnya terhadap Postgres lokal (Docker) sebelum menyentuh infrastruktur bersama ini.
