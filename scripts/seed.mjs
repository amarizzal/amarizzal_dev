/**
 * Mengisi database dengan konten awal: profil (dikoreksi dari src/lib/data.ts
 * lama), skill, tech stack, layanan, pengalaman, satu akun admin, dan project
 * NYATA (Hermus, Akasha, SSB Poultry, Bandarmologi) — menggantikan 4 project
 * filler generik yang dulu ada di data.ts.
 *
 * Idempoten: entitas dengan kunci alami (profile.locale, skill_categories
 * (key,locale), tech_stack.name, projects (slug,locale), users.email) memakai
 * `on conflict ... do update`. Entitas anak tanpa kunci alami sendiri (skills
 * dalam satu kategori, services, experiences, project_tech/sections/
 * items/metrics milik satu project) di-hapus-lalu-tulis-ulang dalam satu
 * transaksi per induk — hasil akhirnya identik walau dijalankan berulang,
 * tanpa duplikat, meski secara SQL bukan upsert murni. Ini sengaja: entitas
 * itu tidak punya kunci natural yang aman dipakai sebagai target konflik.
 *
 * Pakai: npm run db:seed
 */
import pg from 'pg'
import bcrypt from 'bcryptjs'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL belum diatur (cek .env.local).')
  process.exit(1)
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL / ADMIN_PASSWORD belum diatur (cek .env.local).')
  process.exit(1)
}

const client = new pg.Client({ connectionString: DATABASE_URL })
await client.connect()

const LOCALE = 'id'

// ── Profil ───────────────────────────────────────────────────────────────
// Dipindah dari src/lib/data.ts LAMA (personalInfo), dengan TIGA KOREKSI:
//  - github_url: rizalammar -> amarizzal (remote git yang sebenarnya adalah
//    github.com/amarizzal/amarizzal_dev.git, bukan rizalammar)
//  - whatsapp_url: nomor placeholder 6281234567890 dihapus, DIKOSONGKAN
//    sampai nomor asli tersedia (bukan tebakan)
//  - instagram_url: ditambahkan — dipakai di brief IG tapi tidak pernah
//    ditautkan di situs lama
// cv_path dibiarkan NULL: public/rizal-ammar-cv.pdf belum ada.
await client.query(
  `insert into profile
     (locale, nama, title, tagline, location, email, github_url, linkedin_url,
      instagram_url, whatsapp_url, bio, bio2,
      years_of_experience, projects_completed, clients_satisfied)
   values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
   on conflict (locale) do update set
     nama = excluded.nama, title = excluded.title, tagline = excluded.tagline,
     location = excluded.location, email = excluded.email,
     github_url = excluded.github_url, linkedin_url = excluded.linkedin_url,
     instagram_url = excluded.instagram_url, whatsapp_url = excluded.whatsapp_url,
     bio = excluded.bio, bio2 = excluded.bio2,
     years_of_experience = excluded.years_of_experience,
     projects_completed = excluded.projects_completed,
     clients_satisfied = excluded.clients_satisfied,
     updated_at = now()`,
  [
    LOCALE,
    'Rizal Ammar',
    'Fullstack Developer',
    'Membangun Produk Digital yang Berdampak',
    'Malang, Jawa Timur',
    'rizalama11.ra@gmail.com',
    'https://github.com/amarizzal',
    'https://linkedin.com/in/rizalammar',
    'https://instagram.com/amarizzal.dev',
    null, // whatsapp asli belum tersedia — isi lewat /admin/profil
    'Halo! Saya Rizal Ammar, fullstack developer berbasis di Malang dengan pengalaman membangun web dan aplikasi modern. Saya spesialis dalam ekosistem JavaScript/TypeScript — mulai dari interface yang indah hingga backend yang tangguh.',
    'Saya percaya bahwa teknologi harus memecahkan masalah nyata. Setiap baris kode yang saya tulis bertujuan memberikan pengalaman terbaik bagi pengguna dan nilai bisnis yang terukur.',
    3,
    20,
    15,
  ],
)
console.log('✓ profile')

// ── Skill categories + skills ───────────────────────────────────────────
const SKILL_GROUPS = [
  {
    key: 'frontend',
    label: 'Frontend',
    color: '#6366f1',
    sort: 0,
    items: [
      { name: 'Next.js', level: 92, icon: '▲' },
      { name: 'React', level: 90, icon: '⚛' },
      { name: 'TypeScript', level: 85, icon: 'TS' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨' },
      { name: 'Framer Motion', level: 80, icon: '✨' },
    ],
  },
  {
    key: 'backend',
    label: 'Backend',
    color: '#06b6d4',
    sort: 1,
    items: [
      { name: 'Node.js', level: 85, icon: '🟢' },
      { name: 'Express.js', level: 82, icon: '🚂' },
      { name: 'Prisma ORM', level: 88, icon: '🔷' },
      { name: 'REST API', level: 88, icon: '🔌' },
      { name: 'JWT Auth', level: 82, icon: '🔐' },
    ],
  },
  {
    key: 'database',
    label: 'Database',
    color: '#a855f7',
    sort: 2,
    items: [
      { name: 'MySQL', level: 85, icon: '🐬' },
      { name: 'PostgreSQL', level: 78, icon: '🐘' },
      { name: 'MongoDB', level: 72, icon: '🍃' },
      { name: 'Redis', level: 65, icon: '⚡' },
    ],
  },
  {
    key: 'tools',
    label: 'Tools & DevOps',
    color: '#22c55e',
    sort: 3,
    items: [
      { name: 'Git / GitHub', level: 90, icon: '🐙' },
      { name: 'Docker', level: 72, icon: '🐳' },
      { name: 'Linux / VPS', level: 78, icon: '🐧' },
      { name: 'Figma', level: 70, icon: '🎭' },
    ],
  },
]

for (const group of SKILL_GROUPS) {
  const { rows: [cat] } = await client.query(
    `insert into skill_categories (key, label, color, locale, sort_order)
     values ($1,$2,$3,$4,$5)
     on conflict (key, locale) do update set
       label = excluded.label, color = excluded.color,
       sort_order = excluded.sort_order, updated_at = now()
     returning id`,
    [group.key, group.label, group.color, LOCALE, group.sort],
  )
  await client.query('delete from skills where category_id = $1', [cat.id])
  for (const [i, s] of group.items.entries()) {
    await client.query(
      `insert into skills (category_id, name, level, icon, sort_order)
       values ($1,$2,$3,$4,$5)`,
      [cat.id, s.name, s.level, s.icon, i],
    )
  }
}
console.log('✓ skill_categories + skills')

// ── Tech stack ───────────────────────────────────────────────────────────
const TECH_STACK = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Express',
  'Prisma', 'MySQL', 'PostgreSQL', 'MongoDB',
  'Tailwind CSS', 'Framer Motion', 'shadcn/ui',
  'Git', 'Docker', 'Linux', 'REST API', 'JWT',
  'Vercel', 'Railway', 'Nginx',
]
for (const [i, name] of TECH_STACK.entries()) {
  await client.query(
    `insert into tech_stack (name, sort_order) values ($1,$2)
     on conflict (name) do update set sort_order = excluded.sort_order`,
    [name, i],
  )
}
console.log('✓ tech_stack')

// ── Layanan ──────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: '🖥️', title: 'Website & Landing Page', description: 'Website profesional yang cepat, SEO-friendly, dan responsif di semua perangkat. Dari company profile hingga landing page konversi tinggi.' },
  { icon: '⚡', title: 'Web Application', description: 'Aplikasi web kompleks dengan fitur lengkap — dashboard, manajemen data, autentikasi, dan integrasi API pihak ketiga.' },
  { icon: '🔌', title: 'Backend & API', description: 'REST API yang robust dan scalable. Database design, autentikasi JWT, dan infrastruktur backend yang aman dan maintainable.' },
  { icon: '🚀', title: 'Konsultasi & Optimasi', description: 'Audit performa website, optimasi SEO teknis, code review, dan konsultasi arsitektur sistem untuk bisnis yang ingin scale.' },
]
await client.query('delete from services where locale = $1', [LOCALE])
for (const [i, s] of SERVICES.entries()) {
  await client.query(
    `insert into services (locale, icon, title, description, sort_order)
     values ($1,$2,$3,$4,$5)`,
    [LOCALE, s.icon, s.title, s.description, i],
  )
}
console.log('✓ services')

// ── Pengalaman ───────────────────────────────────────────────────────────
const EXPERIENCES = [
  {
    role: 'Fullstack Developer — Freelance', company: 'Independent / Remote', period: '2023 — Sekarang',
    description: 'Mengerjakan berbagai proyek website dan aplikasi web untuk klien dari Malang dan luar kota. Fokus pada Next.js, TypeScript, dan solusi berbasis cloud.',
    highlights: ['Membangun 15+ aplikasi web production-ready', 'Pengelolaan server VPS dan deployment CI/CD', 'Kolaborasi langsung dengan klien untuk desain sistem'],
  },
  {
    role: 'Frontend Developer', company: 'Startup Lokal Malang', period: '2022 — 2023',
    description: 'Mengembangkan dan memaintain antarmuka pengguna menggunakan React dan Next.js. Berkolaborasi dengan tim backend untuk integrasi API.',
    highlights: ['Migrasi codebase dari CRA ke Next.js', 'Implementasi design system dengan Tailwind CSS', 'Optimasi performa web (Core Web Vitals)'],
  },
  {
    role: 'Web Developer — Intern', company: 'Digital Agency Malang', period: '2021 — 2022',
    description: 'Magang sebagai web developer, membantu pengembangan website klien dan belajar workflow profesional dalam tim.',
    highlights: ['Membangun 5+ website klien dari desain ke deployment', 'Belajar version control dan code review', 'Fundamental database design dan REST API'],
  },
]
await client.query('delete from experiences where locale = $1', [LOCALE])
for (const [i, e] of EXPERIENCES.entries()) {
  await client.query(
    `insert into experiences (locale, role, company, period, description, highlights, sort_order)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    [LOCALE, e.role, e.company, e.period, e.description, e.highlights, i],
  )
}
console.log('✓ experiences')

// ── Admin ────────────────────────────────────────────────────────────────
const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
await client.query(
  `insert into users (email, password_hash, nama, role)
   values ($1,$2,$3,'admin')
   on conflict (email) do update set
     password_hash = excluded.password_hash, nama = excluded.nama, updated_at = now()`,
  [ADMIN_EMAIL, hash, 'Rizal Ammar'],
)
console.log(`✓ users (${ADMIN_EMAIL})`)

// ── Proyek ───────────────────────────────────────────────────────────────

/** Insert/replace satu project beserta tech, sections+items, dan metrics. */
async function seedProject(p) {
  const { rows: [row] } = await client.query(
    `insert into projects
       (locale, slug, title, client_name, description, core_insight, category,
        accent_color, live_url, live_status, github_url, featured, published, sort_order)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     on conflict (slug, locale) do update set
       title = excluded.title, client_name = excluded.client_name,
       description = excluded.description, core_insight = excluded.core_insight,
       category = excluded.category, accent_color = excluded.accent_color,
       live_url = excluded.live_url, live_status = excluded.live_status,
       github_url = excluded.github_url, featured = excluded.featured,
       published = excluded.published, sort_order = excluded.sort_order,
       published_at = case when excluded.published and projects.published_at is null
                            then now() else projects.published_at end,
       updated_at = now()
     returning id`,
    [
      LOCALE, p.slug, p.title, p.client_name ?? null, p.description, p.core_insight ?? null,
      p.category, p.accent_color, p.live_url ?? null, p.live_status, p.github_url ?? null,
      p.featured ?? false, p.published ?? true, p.sort_order ?? 0,
    ],
  )
  const projectId = row.id

  await client.query('delete from project_tech where project_id = $1', [projectId])
  for (const [i, name] of (p.tech ?? []).entries()) {
    await client.query(
      `insert into project_tech (project_id, name, sort_order) values ($1,$2,$3)`,
      [projectId, name, i],
    )
  }

  // Section + item lama dihapus lewat cascade saat delete di bawah.
  await client.query('delete from project_sections where project_id = $1', [projectId])
  for (const [i, sec] of (p.sections ?? []).entries()) {
    const { rows: [secRow] } = await client.query(
      `insert into project_sections
         (project_id, sort_order, kind, label, heading, body_html, highlight)
       values ($1,$2,$3,$4,$5,$6,$7)
       returning id`,
      [projectId, i, sec.kind, sec.label, sec.heading, sec.body_html ?? null, sec.highlight ?? null],
    )
    for (const [j, item] of (sec.items ?? []).entries()) {
      await client.query(
        `insert into project_section_items (section_id, sort_order, kind, kiri, kanan)
         values ($1,$2,$3,$4,$5)`,
        [secRow.id, j, item.kind, item.kiri, item.kanan ?? null],
      )
    }
  }

  await client.query('delete from project_metrics where project_id = $1', [projectId])
  for (const [i, m] of (p.metrics ?? []).entries()) {
    await client.query(
      `insert into project_metrics (project_id, label, value, provenance, note, is_public, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [projectId, m.label, m.value, m.provenance ?? 'my_work', m.note ?? null, m.is_public ?? true, i],
    )
  }

  console.log(`✓ project ${p.slug}`)
}

// 4 project filler lama (E-Commerce Platform, SaaS Dashboard Analytics, REST
// API Microservices, Mobile-First POS System) SENGAJA TIDAK dimigrasikan —
// itu placeholder generik dengan liveUrl "#". Diganti project nyata:

await seedProject({
  slug: 'hermus-poultry-consultant',
  title: 'Hermus Poultry Consultant',
  client_name: 'Hermus Syaifuddin',
  category: 'Full-Stack App',
  accent_color: '#D4621A', // palet brief IG, warm ember — bukan indigo situs
  description: 'Platform untuk konsultan peternakan unggas 30+ tahun: landing page kredibilitas, 9 kalkulator analisis performa ayam gratis, distribusi materi premium berbasis kode akses, dan dashboard admin penuh.',
  core_insight:
    'Hermus punya pengalaman 30+ tahun, 150+ farm dibantu, 3 juta ekor chicks ditangani — tapi semua ilmu itu hanya bisa dipakai kalau beliau hadir langsung. Yang dibangun bukan website, melainkan sistem yang memindahkan sebagian keahliannya supaya bisa bekerja tanpa beliau.',
  live_url: 'https://hermuspoultryconsultant.id',
  live_status: 'live',
  featured: true,
  sort_order: 0,
  tech: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind CSS', 'JWT Auth', 'Vitest'],
  sections: [
    {
      kind: 'masalah', label: '01 — MASALAHNYA', heading: 'Klien saya tidak kekurangan klien.',
      body_html:
        '<p>Dia kekurangan waktu.</p><p>Hermus Syaifuddin, konsultan unggas 30 tahun, eks PT. JAPFA. 150+ peternakan pernah dia dampingi.</p><p>Tapi setiap peternak yang mau tahu berat badan ayamnya normal atau tidak, harus menunggu beliau menjawab. Satu per satu, lewat WhatsApp.</p><p>Ilmunya tidak bisa naik kelas kalau caranya masih begini.</p>',
      items: [
        { kind: 'poin', kiri: 'Kredibilitas 30 tahun tidak terlihat di internet.' },
        { kind: 'poin', kiri: 'Hitungan teknis masih manual, diulang ratusan kali.' },
        { kind: 'poin', kiri: 'Materi premium dikirim satu-satu, tanpa kontrol.' },
      ],
    },
    {
      kind: 'solusi', label: '02 — YANG SAYA BANGUN', heading: 'Kredibilitas yang bisa dilihat.',
      body_html:
        '<p>Sebelum orang bayar konsultan, mereka mau tahu: "orang ini beneran ahli, atau cuma jago ngomong?"</p><p>Halaman depan tidak diisi jargon, tapi bukti: sertifikat internasional Aviagen &amp; Lohmann, testimoni asli dari pemilik farm, dan 4 langkah kerja yang jelas dari konsultasi awal sampai pendampingan.</p><p>Formnya langsung masuk ke dashboard. Tidak ada lead yang hilang.</p>',
    },
    {
      kind: 'solusi', label: '03 — YANG SAYA BANGUN', heading: 'Bagian ilmunya saya jadikan alat.',
      highlight: '9 modul analisis',
      body_html:
        '<p>Ini bagian paling penting.</p><p>9 kalkulator analisis performa ayam — berat badan, konsumsi pakan, uniformity, sampai koefisien varian. Plus kalkulator ventilasi kandang lengkap dengan faktor wind chill.</p><p>Gratis. Siapa saja boleh pakai.</p><p>Orang yang datang untuk memakai alat punya alasan untuk kembali. Dan saat mereka butuh konsultan sungguhan, mereka sudah tahu harus ke siapa.</p>',
    },
    {
      kind: 'solusi', label: '04 — YANG SAYA BANGUN', heading: 'Ilmu berbayar, dikunci rapi.',
      body_html:
        '<p>Materi premium tidak lagi dikirim manual.</p><p>Setiap klien dapat satu kode akses yang bisa dibatasi: berlaku sampai kapan, boleh dipakai berapa kali, dan kategori materi mana saja yang bisa dibuka. Setiap pemakaian tercatat — siapa, kapan, buka apa.</p><p>File PDF-nya tidak pernah bisa diunduh sembarangan. Bahkan link langsungnya pun tidak bisa dibuka orang luar.</p>',
    },
    {
      kind: 'hasil', label: '05 — HASILNYA', heading: 'Satu website, tiga pekerjaan.',
      body_html:
        '<p>Dan satu hal yang jarang orang minta, tapi selalu disertakan: panel admin. Standar industri, harga, materi, kode akses — semuanya bisa diubah sendiri lewat dashboard.</p>',
      items: [
        { kind: 'baris', kiri: 'BROSUR', kanan: 'Meyakinkan calon klien tanpa beliau hadir.' },
        { kind: 'baris', kiri: 'ASISTEN TEKNIS', kanan: 'Menjawab hitungan yang dulu ditanya berulang.' },
        { kind: 'baris', kiri: 'ETALASE ILMU', kanan: 'Menjual materi tanpa repot kirim manual.' },
      ],
    },
    {
      kind: 'proses', label: '06 — CARA SAYA BEKERJA', heading: 'Saya tidak mulai dari desain.',
      body_html:
        '<p>Saya mulai dari satu pertanyaan: "Pekerjaan apa yang Anda ulang terus setiap minggu, dan sebenarnya tidak perlu Anda kerjakan sendiri?"</p><p>Jawaban dari pertanyaan itu yang menentukan website atau aplikasi seperti apa yang dibutuhkan. Bukan sebaliknya.</p>',
    },
  ],
  metrics: [
    { label: 'Modul kalkulator', value: '9', provenance: 'my_work', note: 'PORTFOLIO_FEATURES §1' },
    { label: 'Unit test', value: '148', provenance: 'my_work', note: 'PORTFOLIO_FEATURES §8, Vitest' },
    // Sengaja disimpan TAPI is_public=false — angka marketing milik klien,
    // bukan hasil pekerjaan sendiri. Lihat IG-POST-01-HERMUS/README.md
    // "Angka yang sengaja TIDAK saya pakai".
    { label: 'Tingkat keberhasilan (klaim situs klien)', value: '98%', provenance: 'client_claim', note: 'Klaim marketing Hermus, bukan hasil pekerjaan developer — jangan dipublikasikan.', is_public: false },
    { label: 'Peningkatan produktivitas (klaim situs klien)', value: '35%', provenance: 'client_claim', note: 'Klaim marketing Hermus, bukan hasil pekerjaan developer — jangan dipublikasikan.', is_public: false },
  ],
})

await seedProject({
  slug: 'akasha-karya',
  title: 'Akasha Karya',
  client_name: 'Akasha Karya',
  category: 'SaaS',
  accent_color: '#2B6CB0', // placeholder — brand Akasha belum menetapkan hex resmi
  description: 'Company profile studio desain & konstruksi dengan model 3D interaktif yang bisa dijelajahi di browser, kalkulator estimasi biaya, dan portal progres klien dengan gating berbasis pembayaran.',
  core_insight:
    'Akasha Karya menjual sesuatu yang belum ada wujudnya — klien diminta menyetujui dan membayar puluhan sampai ratusan juta berdasarkan gambar 2D dan imajinasinya sendiri. Yang dibangun bukan company profile biasa, melainkan bangunannya lebih dulu, di browser, supaya klien tidak perlu membayangkan.',
  live_url: 'https://demo-akasha-karya.amarizzal.dev',
  // Demo mati per pengecekan IG-POST-02-AKASHA/README.md — aturan sendiri:
  // jangan cetak URL yang mati. live_status 'offline' menahan itu di renderer.
  live_status: 'offline',
  featured: true,
  sort_order: 1,
  tech: ['Three.js', 'React Three Fiber', 'Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Midtrans', 'Docker'],
  sections: [
    {
      kind: 'masalah', label: '01 — MASALAHNYA', heading: 'Yang dijual belum ada. Yang dibayar sudah nyata.',
      body_html:
        '<p>Akasha Karya adalah studio desain dan konstruksi di Malang.</p><p>Seperti semua studio desain, mereka meminta klien menyetujui sesuatu yang wujudnya baru ada di gambar kerja. Hasilnya bisa ditebak: revisi bolak-balik, dan kalimat yang selalu muncul terlambat — "ternyata ruangannya lebih sempit dari bayangan saya."</p>',
      items: [
        { kind: 'poin', kiri: 'Klien sulit membayangkan hasil akhir dari gambar 2D.' },
        { kind: 'poin', kiri: '"Berapa biayanya?" dijawab manual, satu per satu.' },
        { kind: 'poin', kiri: 'Progres dan termin pembayaran dikabari lewat chat.' },
      ],
    },
    {
      kind: 'solusi', label: '02 — YANG SAYA BANGUN', heading: 'Bangunannya dibangun dulu. Di browser.',
      body_html:
        '<p>Bukan render foto diam.</p><p>Model 3D yang bisa diputar dari luar untuk melihat keseluruhan struktur — lalu dimasuki, dan dijelajahi dari sudut pandang orang pertama. Seperti Google Street View, tapi di rumah yang belum berdiri.</p><p>Klien memahami proporsi ruang, penempatan bukaan, dan alur sirkulasi sebelum satu batu bata pun dipasang. Tanpa install aplikasi — cukup buka link.</p>',
    },
    {
      kind: 'solusi', label: '03 — YANG SAYA BANGUN', heading: '"Berapa biayanya?" dijawab dalam sepuluh detik.',
      body_html:
        '<p>Pengunjung memasukkan luas bangunan, jumlah lantai, dan tingkat kualitas material. Estimasi rentang biaya keluar seketika.</p><p>Harga satuannya diatur admin dari dashboard — bisa berubah kapan saja tanpa menyentuh kode. Efeknya bukan cuma hemat waktu: orang yang tetap lanjut menghubungi setelah melihat angkanya, adalah orang yang serius.</p>',
    },
    {
      kind: 'solusi', label: '04 — YANG SAYA BANGUN', heading: 'Sistem yang menagih tanpa terasa menagih.',
      body_html:
        '<p>Setiap klien dapat satu link berisi linimasa progres mingguan proyeknya — dikelompokkan tahap desain dan konstruksi.</p><p>Progres minggu berikutnya terbuka setelah termin pembayaran terkait lunas. Aturan itu dijalankan di level database, bukan di tampilan — minggu yang terkunci memang tidak dikirim datanya, bukan sekadar disembunyikan.</p>',
    },
    {
      kind: 'hasil', label: '05 — HASILNYA', heading: 'Satu website, tiga pekerjaan.',
      body_html:
        '<p>Ditambah panel admin: portofolio proyek, harga estimator, laporan progres klien, sampai akses tim — semuanya bisa diubah sendiri.</p><p>Semua dijalankan sendiri dari nol: desain sistem, database, frontend, backend, sampai deployment ke server produksi.</p>',
      items: [
        { kind: 'baris', kiri: 'RUANG PAMER', kanan: 'Klien menjelajahi desain sebelum menyetujuinya.' },
        { kind: 'baris', kiri: 'PENYARING LEAD', kanan: 'Estimasi biaya menjawab sebelum ditanya.' },
        { kind: 'baris', kiri: 'ASISTEN PENAGIH', kanan: 'Progres terbuka mengikuti termin yang lunas.' },
      ],
    },
    {
      kind: 'proses', label: '06 — CARA SAYA BEKERJA', heading: 'Saya tidak mulai dari desain.',
      body_html:
        '<p>Saya mulai dari satu pertanyaan: "Di titik mana calon klien Anda paling sering ragu — dan apa yang bisa menghilangkan keraguan itu?"</p><p>Jawaban dari pertanyaan itu yang menentukan website atau aplikasi seperti apa yang dibutuhkan. Bukan sebaliknya.</p>',
    },
  ],
  metrics: [
    { label: 'Mode navigasi 3D', value: '2 (orbit & walkthrough)', provenance: 'my_work' },
    { label: 'Aturan gating termin', value: 'level database (Postgres RPC)', provenance: 'my_work' },
  ],
})

await seedProject({
  slug: 'ssb-poultry',
  title: 'SSB Poultry — Pelaporan Harian',
  client_name: null,
  category: 'Backend',
  accent_color: '#0f766e',
  description: 'Sistem pelaporan harian peternakan ayam petelur: input pakan, telur per grade, dan kematian ternak per kandang, dengan role berjenjang (owner, kepala unit, admin) dan ringkasan analitik.',
  core_insight: null,
  live_url: null,
  live_status: 'private',
  featured: false,
  sort_order: 2,
  tech: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'pg', 'JWT (jose)', 'Tailwind CSS'],
})

await seedProject({
  slug: 'bandarmologi',
  title: 'Bandarmologi',
  client_name: null,
  category: 'Backend',
  accent_color: '#7c3aed',
  description: 'Alat analisis broker-flow (bandarmologi) untuk saham IDX — mengambil data transaksi broker, mengklasifikasikan pola akumulasi/distribusi, dan menyajikannya lewat dashboard web.',
  core_insight: null,
  live_url: null,
  live_status: 'none',
  featured: false,
  published: false, // draft — belum ada brief promosi, tunggu konfirmasi sebelum tayang
  sort_order: 3,
  tech: ['Python', 'Flask', 'SQLite'],
})

console.log('\nSeed selesai.')
await client.end()
