-- amarizzal.dev — konten portofolio, studi kasus, blog, pesan kontak.
-- Postgres murni. Satu pengguna admin. Otorisasi di lapisan aplikasi.
-- Database ini menumpang instance Postgres milik project ssb-poultry;
-- peran "amarizzal" tidak punya akses apa pun ke database ssb_poultry
-- (lihat db/CATATAN-INFRA.md untuk setup role & isolasinya).

create extension if not exists pgcrypto;

-- Trigger updated_at dipakai ulang oleh semua tabel yang bisa diedit admin.
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── Admin ─────────────────────────────────────────────────────────────────
-- Kolom "role" sengaja DIPERTAHANKAN walau saat ini hanya ada satu nilai.
-- Alasannya: kolomnya gratis, dan menambahkannya belakangan berarti migrasi
-- + menyentuh src/lib/auth.ts. Tidak ada requireRole() di aplikasi ini.
create table if not exists users (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  password_hash  text not null,
  nama           text not null,
  role           text not null default 'admin',
  aktif          boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
drop trigger if exists trg_users_updated on users;
create trigger trg_users_updated before update on users
  for each row execute function set_updated_at();

-- ── Media ─────────────────────────────────────────────────────────────────
-- path relatif terhadap /public, contoh: /uploads/8f3c....webp
create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  alt         text,
  width       int,
  height      int,
  mime        text not null,
  bytes       int  not null,
  created_at  timestamptz not null default now()
);

-- ── Profil / pengaturan situs ────────────────────────────────────────────
-- Satu baris per locale. v1 hanya mengisi 'id'; EN tinggal insert baris baru.
create table if not exists profile (
  id                   uuid primary key default gen_random_uuid(),
  locale               text not null default 'id',
  nama                 text not null,
  title                text not null,
  tagline              text not null,
  location             text not null,
  email                text not null,
  github_url           text,
  linkedin_url         text,
  instagram_url        text,
  whatsapp_url         text,
  bio                  text not null,
  bio2                 text,
  years_of_experience  int  not null default 0,
  projects_completed   int  not null default 0,
  clients_satisfied    int  not null default 0,
  cv_path              text,
  og_image_id          uuid references media(id) on delete set null,
  avatar_id            uuid references media(id) on delete set null,
  updated_at           timestamptz not null default now(),
  unique (locale)
);
drop trigger if exists trg_profile_updated on profile;
create trigger trg_profile_updated before update on profile
  for each row execute function set_updated_at();

-- ── Skills ────────────────────────────────────────────────────────────────
-- Objek skills yang dulu dikunci-kategori di src/lib/data.ts di-FLATTEN:
-- kategori jadi tabel sendiri (agar label + warna bisa diedit admin), skill
-- jadi baris dengan FK + sort_order.
create table if not exists skill_categories (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,          -- 'frontend' | 'backend' | 'database' | 'tools'
  label       text not null,          -- 'Frontend', 'Tools & DevOps'
  color       text not null,          -- '#6366f1'
  locale      text not null default 'id',
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now(),
  unique (key, locale)
);
drop trigger if exists trg_skill_cat_updated on skill_categories;
create trigger trg_skill_cat_updated before update on skill_categories
  for each row execute function set_updated_at();

create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories(id) on delete cascade,
  name        text not null,
  level       int  not null default 0 check (level between 0 and 100),
  icon        text,                   -- emoji / glyph, seperti data lama
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_skills_updated on skills;
create trigger trg_skills_updated before update on skills
  for each row execute function set_updated_at();
create index if not exists idx_skills_cat on skills (category_id, sort_order);

-- Ticker "Teknologi yang pernah digunakan" — dulu techStack: string[]
create table if not exists tech_stack (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  int  not null default 0
);

-- ── Layanan ───────────────────────────────────────────────────────────────
create table if not exists services (
  id           uuid primary key default gen_random_uuid(),
  locale       text not null default 'id',
  icon         text,
  title        text not null,
  description  text not null,
  sort_order   int  not null default 0,
  aktif        boolean not null default true,
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_services_updated on services;
create trigger trg_services_updated before update on services
  for each row execute function set_updated_at();

-- ── Pengalaman ────────────────────────────────────────────────────────────
-- "period" tetap teks bebas ("2023 — Sekarang") karena itu yang ditampilkan.
-- sort_order dipakai untuk urutan timeline, BUKAN parsing tanggal dari teks.
create table if not exists experiences (
  id           uuid primary key default gen_random_uuid(),
  locale       text not null default 'id',
  role         text not null,
  company      text not null,
  period       text not null,
  description  text not null,
  highlights   text[] not null default '{}',
  sort_order   int  not null default 0,
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_exp_updated on experiences;
create trigger trg_exp_updated before update on experiences
  for each row execute function set_updated_at();

-- ── Proyek ────────────────────────────────────────────────────────────────
-- Menambahkan yang hilang di data.ts: id, slug, image.
-- live_status ada karena aturan sendiri: "jangan cetak URL yang mati".
-- Komponen publik HANYA mencetak live_url bila live_status = 'live'.
create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  locale        text not null default 'id',
  slug          text not null,
  title         text not null,
  client_name   text,
  description   text not null,          -- ringkas, untuk kartu di beranda
  core_insight  text,                   -- tesis 3 kalimat, dasar seluruh narasi
  category      text not null,
  accent_color  text not null default '#6366f1',
  cover_id      uuid references media(id) on delete set null,
  live_url      text,
  live_status   text not null default 'none'
                check (live_status in ('live','offline','private','none')),
  github_url    text,
  featured      boolean not null default false,
  published     boolean not null default false,
  sort_order    int  not null default 0,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (slug, locale),
  -- Tidak mungkin menyimpan status 'live' tanpa URL-nya.
  constraint live_butuh_url check (live_status <> 'live' or live_url is not null)
);
drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();
create index if not exists idx_projects_pub on projects (published, sort_order);

create table if not exists project_tech (
  project_id  uuid not null references projects(id) on delete cascade,
  name        text not null,
  sort_order  int  not null default 0,
  primary key (project_id, name)
);

-- Tulang punggung studi kasus: BARIS BERURUT, bukan kolom tetap.
-- Jumlah bagian "YANG SAYA BANGUN" berbeda tiap proyek (Hermus & Akasha
-- kebetulan sama-sama 3, proyek lain belum tentu), jadi memodelkannya sebagai
-- kolom solusi_1..solusi_3 akan salah sejak hari pertama.
-- "label" menyimpan penomoran yang memang sudah ditulis manual di brief:
-- '01 — MASALAHNYA', '02 — YANG SAYA BANGUN', '05 — HASILNYA', dst.
create table if not exists project_sections (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  sort_order  int  not null,
  kind        text not null
              check (kind in ('masalah','solusi','hasil','proses','custom')),
  label       text not null,
  heading     text not null,
  body_html   text,                     -- HTML hasil Tiptap, SUDAH disanitasi
  highlight   text,                     -- angka besar opsional, mis. "9 modul analisis"
  media_id    uuid references media(id) on delete set null,
  updated_at  timestamptz not null default now(),
  unique (project_id, sort_order) deferrable initially deferred
);
drop trigger if exists trg_sections_updated on project_sections;
create trigger trg_sections_updated before update on project_sections
  for each row execute function set_updated_at();
create index if not exists idx_sections_proj on project_sections (project_id, sort_order);

-- Dua sub-bentuk yang benar-benar muncul di brief, satu tabel:
--   'poin'  -> "Tiga poin masalah"      : hanya kiri terisi
--   'baris' -> "BROSUR → Meyakinkan..." : kiri = peran, kanan = hasil
create table if not exists project_section_items (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references project_sections(id) on delete cascade,
  sort_order  int  not null default 0,
  kind        text not null default 'poin' check (kind in ('poin','baris')),
  kiri        text not null,
  kanan       text,
  constraint baris_butuh_kanan check (kind <> 'baris' or kanan is not null)
);
create index if not exists idx_section_items on project_section_items (section_id, sort_order);

-- Metrik dengan PROVENANCE. Aturan yang sudah ditulis sendiri di README
-- Hermus: angka marketing milik klien (98% keberhasilan, 35% produktivitas)
-- TIDAK boleh terbaca seolah hasil pekerjaan sendiri. Kolom ini memaksakan
-- keputusan itu di level data, bukan di level ingatan.
create table if not exists project_metrics (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  label       text not null,            -- "Modul kalkulator"
  value       text not null,            -- "9"
  provenance  text not null default 'my_work'
              check (provenance in ('my_work','client_claim')),
  note        text,                     -- sumber klaim, mis. "situs klien, hero"
  is_public   boolean not null default true,
  sort_order  int  not null default 0
);
create index if not exists idx_metrics_proj on project_metrics (project_id, sort_order);

-- ── Blog ──────────────────────────────────────────────────────────────────
create table if not exists posts (
  id                uuid primary key default gen_random_uuid(),
  locale            text not null default 'id',
  slug              text not null,
  title             text not null,
  excerpt           text,
  body_html         text not null default '',   -- HTML Tiptap, SUDAH disanitasi
  cover_id          uuid references media(id) on delete set null,
  tags              text[] not null default '{}',
  status            text not null default 'draft'
                    check (status in ('draft','published')),
  reading_minutes   int  not null default 1,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (slug, locale),
  constraint terbit_butuh_tanggal
    check (status <> 'published' or published_at is not null)
);
drop trigger if exists trg_posts_updated on posts;
create trigger trg_posts_updated before update on posts
  for each row execute function set_updated_at();
create index if not exists idx_posts_terbit on posts (status, published_at desc);
create index if not exists idx_posts_tags on posts using gin (tags);

-- ── Pesan kontak ──────────────────────────────────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  email       text not null,
  subjek      text,
  pesan       text not null,
  ip          inet,
  user_agent  text,
  status      text not null default 'baru'
              check (status in ('baru','dibaca','dibalas','spam')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_pesan_baru on contact_messages (status, created_at desc);
-- Rate limit sederhana untuk form publik: hitung pesan per IP per jam.
create index if not exists idx_pesan_ip on contact_messages (ip, created_at desc);

-- ── Riwayat migrasi ───────────────────────────────────────────────────────
create table if not exists schema_migrations (
  version     text primary key,
  applied_at  timestamptz not null default now()
);
