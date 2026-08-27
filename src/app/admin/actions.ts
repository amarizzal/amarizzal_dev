"use server";

import { revalidatePath } from "next/cache";
import { query, queryOne, pool } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { bersihkanHtml } from "@/lib/html";

/**
 * Semua server action mengembalikan HasilAksi, tidak pernah melempar galat
 * database mentah. Form memakai useActionState untuk menampilkan pesannya
 * inline, sehingga isian yang sudah diketik tidak hilang.
 *
 * Setiap action WAJIB membuka dengan requireSession() — layout admin TIDAK
 * melindungi Server Action (endpoint-nya bisa di-POST langsung dari luar
 * layout React manapun).
 */
export type HasilAksi = { error?: string; ok?: boolean; id?: string };

type GalatPg = { code?: string; message: string; constraint?: string };

/** Menerjemahkan galat Postgres ke bahasa yang dimengerti operator. */
function terjemahkanGalat(e: unknown): string {
  const g = e as GalatPg;
  switch (g.code) {
    case "23505":
      if (g.constraint?.includes("slug")) return "Slug sudah dipakai. Ganti agar unik.";
      return "Data dengan nilai itu sudah ada.";
    case "23503":
      return "Data ini masih terhubung dengan data lain, jadi tidak bisa dihapus.";
    case "22P02":
      return "Data yang dikirim tidak dikenali database. Muat ulang halaman lalu coba lagi.";
    case "23514":
      if (g.constraint === "live_butuh_url")
        return 'Status "live" harus disertai URL. Isi URL-nya atau ubah statusnya.';
      if (g.constraint === "terbit_butuh_tanggal")
        return "Tulisan yang diterbitkan harus punya tanggal terbit.";
      if (g.constraint === "baris_butuh_kanan")
        return "Baris hasil butuh dua sisi: peran dan hasilnya.";
      return "Ada isian yang tidak memenuhi aturan. Periksa kembali.";
    case "42501":
      return "Sesi Anda tidak punya izin. Coba keluar lalu masuk kembali.";
    // Relevan justru karena Postgres ini dipakai bersama project ssb-poultry:
    case "53300":
      return "Server database sedang penuh koneksi. Coba lagi sebentar lagi.";
    case "57014":
      return "Permintaan terlalu lama diproses dan dihentikan. Coba lagi.";
    case "ECONNREFUSED":
      return "Database sedang tidak bisa dihubungi.";
    default:
      return `Gagal menyimpan: ${g.message}`;
  }
}

function buatSlug(teks: string): string {
  return teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const teks = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
};
const wajib = (v: FormDataEntryValue | null) => teks(v) ?? "";
const angka = (v: FormDataEntryValue | null) => {
  const s = teks(v);
  if (s === null) return null;
  const n = Number(s.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const cek = (v: FormDataEntryValue | null) => v === "on" || v === "true";
const baris = (v: FormDataEntryValue | null) =>
  (typeof v === "string" ? v : "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const daftar = (v: FormDataEntryValue | null) =>
  (typeof v === "string" ? v : "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

function segarkan(opts?: { proyekSlug?: string; tulisanSlug?: string }) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (opts?.proyekSlug) revalidatePath(`/project/${opts.proyekSlug}`);
  if (opts?.tulisanSlug) revalidatePath(`/blog/${opts.tulisanSlug}`);
}

const LOCALE = "id";

// ────────────────────────── Profil ──────────────────────────

export async function simpanProfil(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const nama = wajib(fd.get("nama"));
  if (!nama) return { error: "Nama wajib diisi." };
  const email = wajib(fd.get("email"));
  if (!email) return { error: "Email wajib diisi." };

  try {
    await query(
      `insert into profile
         (locale, nama, title, tagline, location, email, github_url, linkedin_url,
          instagram_url, whatsapp_url, bio, bio2, years_of_experience,
          projects_completed, clients_satisfied, cv_path)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       on conflict (locale) do update set
         nama=excluded.nama, title=excluded.title, tagline=excluded.tagline,
         location=excluded.location, email=excluded.email,
         github_url=excluded.github_url, linkedin_url=excluded.linkedin_url,
         instagram_url=excluded.instagram_url, whatsapp_url=excluded.whatsapp_url,
         bio=excluded.bio, bio2=excluded.bio2,
         years_of_experience=excluded.years_of_experience,
         projects_completed=excluded.projects_completed,
         clients_satisfied=excluded.clients_satisfied,
         cv_path=excluded.cv_path, updated_at=now()`,
      [
        LOCALE, nama, wajib(fd.get("title")), wajib(fd.get("tagline")), wajib(fd.get("location")),
        email, teks(fd.get("github_url")), teks(fd.get("linkedin_url")), teks(fd.get("instagram_url")),
        teks(fd.get("whatsapp_url")), wajib(fd.get("bio")), teks(fd.get("bio2")),
        angka(fd.get("years_of_experience")) ?? 0, angka(fd.get("projects_completed")) ?? 0,
        angka(fd.get("clients_satisfied")) ?? 0, teks(fd.get("cv_path")),
      ],
    );
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ────────────────────────── Skills ──────────────────────────

export async function simpanKategoriSkill(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const key = wajib(fd.get("key"));
  const label = wajib(fd.get("label"));
  if (!key || !label) return { error: "Key dan label wajib diisi." };

  try {
    if (id) {
      await query(
        `update skill_categories set key=$1, label=$2, color=$3, sort_order=$4, updated_at=now() where id=$5`,
        [key, label, wajib(fd.get("color")) || "#6366f1", angka(fd.get("sort_order")) ?? 0, id],
      );
    } else {
      await query(
        `insert into skill_categories (key, label, color, locale, sort_order) values ($1,$2,$3,$4,$5)`,
        [key, label, wajib(fd.get("color")) || "#6366f1", LOCALE, angka(fd.get("sort_order")) ?? 0],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusKategoriSkill(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from skill_categories where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function simpanSkill(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const categoryId = teks(fd.get("category_id"));
  const name = wajib(fd.get("name"));
  if (!categoryId || !name) return { error: "Kategori dan nama skill wajib diisi." };
  const level = angka(fd.get("level")) ?? 0;

  try {
    if (id) {
      await query(
        `update skills set name=$1, level=$2, icon=$3, sort_order=$4, updated_at=now() where id=$5`,
        [name, level, teks(fd.get("icon")), angka(fd.get("sort_order")) ?? 0, id],
      );
    } else {
      await query(
        `insert into skills (category_id, name, level, icon, sort_order) values ($1,$2,$3,$4,$5)`,
        [categoryId, name, level, teks(fd.get("icon")), angka(fd.get("sort_order")) ?? 0],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusSkill(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from skills where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function simpanTech(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const name = wajib(fd.get("name"));
  if (!name) return { error: "Nama teknologi wajib diisi." };

  try {
    if (id) {
      await query(`update tech_stack set name=$1, sort_order=$2 where id=$3`, [
        name, angka(fd.get("sort_order")) ?? 0, id,
      ]);
    } else {
      await query(
        `insert into tech_stack (name, sort_order) values ($1,$2)
         on conflict (name) do update set sort_order = excluded.sort_order`,
        [name, angka(fd.get("sort_order")) ?? 0],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusTech(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from tech_stack where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ────────────────────────── Layanan ──────────────────────────

export async function simpanLayanan(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const title = wajib(fd.get("title"));
  if (!title) return { error: "Judul layanan wajib diisi." };

  try {
    if (id) {
      await query(
        `update services set icon=$1, title=$2, description=$3, sort_order=$4, aktif=$5, updated_at=now() where id=$6`,
        [teks(fd.get("icon")), title, wajib(fd.get("description")), angka(fd.get("sort_order")) ?? 0, cek(fd.get("aktif")), id],
      );
    } else {
      await query(
        `insert into services (locale, icon, title, description, sort_order, aktif) values ($1,$2,$3,$4,$5,$6)`,
        [LOCALE, teks(fd.get("icon")), title, wajib(fd.get("description")), angka(fd.get("sort_order")) ?? 0, cek(fd.get("aktif"))],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusLayanan(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from services where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ────────────────────────── Pengalaman ──────────────────────────

export async function simpanPengalaman(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const role = wajib(fd.get("role"));
  const company = wajib(fd.get("company"));
  if (!role || !company) return { error: "Peran dan perusahaan wajib diisi." };

  const params = [
    role, company, wajib(fd.get("period")), wajib(fd.get("description")),
    baris(fd.get("highlights")), angka(fd.get("sort_order")) ?? 0,
  ];

  try {
    if (id) {
      await query(
        `update experiences set role=$1, company=$2, period=$3, description=$4, highlights=$5, sort_order=$6, updated_at=now() where id=$7`,
        [...params, id],
      );
    } else {
      await query(
        `insert into experiences (role, company, period, description, highlights, sort_order, locale) values ($1,$2,$3,$4,$5,$6,$7)`,
        [...params, LOCALE],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusPengalaman(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from experiences where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ────────────────────────── Proyek ──────────────────────────

export async function simpanProyek(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const title = wajib(fd.get("title"));
  if (!title) return { error: "Judul proyek wajib diisi." };
  const slugInput = teks(fd.get("slug"));
  const slug = slugInput ? buatSlug(slugInput) : buatSlug(title);
  if (!slug) return { error: "Slug tidak valid." };

  const liveStatus = wajib(fd.get("live_status")) || "none";
  const liveUrl = teks(fd.get("live_url"));
  if (liveStatus === "live" && !liveUrl) {
    return { error: 'Status "live" harus disertai URL.' };
  }

  const coverMediaId = teks(fd.get("cover_media_id"));
  const params = [
    slug, title, teks(fd.get("client_name")), wajib(fd.get("description")),
    teks(fd.get("core_insight")), wajib(fd.get("category")) || "Website",
    wajib(fd.get("accent_color")) || "#6366f1", coverMediaId, liveUrl, liveStatus,
    teks(fd.get("github_url")), cek(fd.get("featured")), cek(fd.get("published")),
    angka(fd.get("sort_order")) ?? 0,
  ];

  let projectId: string | undefined = id ?? undefined;
  try {
    if (id) {
      await query(
        `update projects set
           slug=$1, title=$2, client_name=$3, description=$4, core_insight=$5,
           category=$6, accent_color=$7, cover_id=$8, live_url=$9, live_status=$10,
           github_url=$11, featured=$12, published=$13, sort_order=$14,
           published_at = case when $13 and published_at is null then now() else published_at end,
           updated_at=now()
         where id=$15`,
        [...params, id],
      );
    } else {
      const row = await queryOne<{ id: string }>(
        `insert into projects
           (locale, slug, title, client_name, description, core_insight, category,
            accent_color, cover_id, live_url, live_status, github_url, featured,
            published, sort_order, published_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, case when $14 then now() else null end)
         returning id`,
        [LOCALE, ...params],
      );
      projectId = row?.id;
    }

    // Tech list ditulis ulang (hapus-lalu-tulis) — daftar teks bebas, tidak
    // ada kunci alami untuk upsert per baris.
    await query(`delete from project_tech where project_id=$1`, [projectId]);
    const techList = daftar(fd.get("tech"));
    for (const [i, name] of techList.entries()) {
      await query(`insert into project_tech (project_id, name, sort_order) values ($1,$2,$3)`, [projectId, name, i]);
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan({ proyekSlug: slug });
  return { ok: true, id: projectId };
}

export async function hapusProyek(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from projects where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ── Bagian studi kasus (project_sections) ──

export async function simpanBagian(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const projectId = teks(fd.get("project_id"));
  const heading = wajib(fd.get("heading"));
  if (!projectId || !heading) return { error: "Judul bagian wajib diisi." };

  const bodyRaw = teks(fd.get("body_html"));
  const bodyHtml = bodyRaw ? bersihkanHtml(bodyRaw) : null;

  try {
    if (id) {
      await query(
        `update project_sections set kind=$1, label=$2, heading=$3, body_html=$4, highlight=$5, updated_at=now() where id=$6`,
        [wajib(fd.get("kind")) || "custom", wajib(fd.get("label")), heading, bodyHtml, teks(fd.get("highlight")), id],
      );
    } else {
      const urutan = await queryOne<{ n: number }>(
        `select coalesce(max(sort_order),0)+1 as n from project_sections where project_id=$1`,
        [projectId],
      );
      await query(
        `insert into project_sections (project_id, sort_order, kind, label, heading, body_html, highlight)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [projectId, urutan?.n ?? 1, wajib(fd.get("kind")) || "custom", wajib(fd.get("label")), heading, bodyHtml, teks(fd.get("highlight"))],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusBagian(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from project_sections where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

/** Menukar sort_order dengan tetangganya — unique(project_id, sort_order)
 *  sengaja deferrable supaya pertukaran tidak melanggar constraint di tengah
 *  transaksi. */
export async function geserBagian(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const arah = fd.get("arah") === "naik" ? -1 : 1;
  if (!id) return { error: "ID tidak valid." };

  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("set constraints project_sections_project_id_sort_order_key deferred");

    const { rows: [current] } = await client.query(
      `select project_id, sort_order from project_sections where id=$1`,
      [id],
    );
    if (!current) {
      await client.query("rollback");
      return { error: "Bagian tidak ditemukan." };
    }

    const { rows: [tetangga] } = await client.query(
      `select id, sort_order from project_sections
        where project_id=$1 and sort_order = $2
        order by sort_order limit 1`,
      [current.project_id, current.sort_order + arah],
    );
    if (!tetangga) {
      await client.query("rollback");
      return { ok: true }; // sudah di ujung, diam saja
    }

    await client.query(`update project_sections set sort_order=$1 where id=$2`, [tetangga.sort_order, id]);
    await client.query(`update project_sections set sort_order=$1 where id=$2`, [current.sort_order, tetangga.id]);
    await client.query("commit");
  } catch (e) {
    await client.query("rollback");
    return { error: terjemahkanGalat(e) };
  } finally {
    client.release();
  }
  segarkan();
  return { ok: true };
}

// ── Item bagian (project_section_items) ──

export async function simpanItemBagian(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const sectionId = teks(fd.get("section_id"));
  const kiri = wajib(fd.get("kiri"));
  const kind = wajib(fd.get("kind")) || "poin";
  if (!sectionId || !kiri) return { error: "Isian wajib diisi." };
  if (kind === "baris" && !teks(fd.get("kanan"))) {
    return { error: "Baris hasil butuh dua sisi: peran dan hasilnya." };
  }

  try {
    if (id) {
      await query(`update project_section_items set kind=$1, kiri=$2, kanan=$3 where id=$4`, [
        kind, kiri, teks(fd.get("kanan")), id,
      ]);
    } else {
      const urutan = await queryOne<{ n: number }>(
        `select coalesce(max(sort_order),0)+1 as n from project_section_items where section_id=$1`,
        [sectionId],
      );
      await query(
        `insert into project_section_items (section_id, sort_order, kind, kiri, kanan) values ($1,$2,$3,$4,$5)`,
        [sectionId, urutan?.n ?? 1, kind, kiri, teks(fd.get("kanan"))],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusItemBagian(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from project_section_items where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ── Metrik (project_metrics) ──

export async function simpanMetrik(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const projectId = teks(fd.get("project_id"));
  const label = wajib(fd.get("label"));
  const value = wajib(fd.get("value"));
  if (!projectId || !label || !value) return { error: "Label dan nilai metrik wajib diisi." };

  const params = [
    label, value, wajib(fd.get("provenance")) || "my_work", teks(fd.get("note")), cek(fd.get("is_public")),
  ];

  try {
    if (id) {
      await query(`update project_metrics set label=$1, value=$2, provenance=$3, note=$4, is_public=$5 where id=$6`, [
        ...params, id,
      ]);
    } else {
      await query(
        `insert into project_metrics (label, value, provenance, note, is_public, project_id, sort_order)
         values ($1,$2,$3,$4,$5,$6, (select coalesce(max(sort_order),0)+1 from project_metrics where project_id=$6))`,
        [...params, projectId],
      );
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

export async function hapusMetrik(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from project_metrics where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ────────────────────────── Tulisan (blog) ──────────────────────────

export async function simpanTulisan(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const title = wajib(fd.get("title"));
  if (!title) return { error: "Judul tulisan wajib diisi." };
  const slugInput = teks(fd.get("slug"));
  const slug = slugInput ? buatSlug(slugInput) : buatSlug(title);
  if (!slug) return { error: "Slug tidak valid." };

  const status = wajib(fd.get("status")) || "draft";
  const bodyRaw = teks(fd.get("body_html")) ?? "";
  const bodyHtml = bersihkanHtml(bodyRaw);
  const coverMediaId = teks(fd.get("cover_media_id"));

  const params = [
    slug, title, teks(fd.get("excerpt")), bodyHtml, coverMediaId, daftar(fd.get("tags")), status,
    angka(fd.get("reading_minutes")) ?? Math.max(1, Math.round(bodyRaw.split(/\s+/).length / 200)),
  ];

  let postId: string | undefined = id ?? undefined;
  try {
    if (id) {
      await query(
        `update posts set
           slug=$1, title=$2, excerpt=$3, body_html=$4, cover_id=$5, tags=$6, status=$7,
           reading_minutes=$8,
           published_at = case when $7='published' and published_at is null then now() else published_at end,
           updated_at=now()
         where id=$9`,
        [...params, id],
      );
    } else {
      const row = await queryOne<{ id: string }>(
        `insert into posts (locale, slug, title, excerpt, body_html, cover_id, tags, status, reading_minutes, published_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9, case when $8='published' then now() else null end)
         returning id`,
        [LOCALE, ...params],
      );
      postId = row?.id;
    }
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan({ tulisanSlug: slug });
  return { ok: true, id: postId };
}

export async function hapusTulisan(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from posts where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  segarkan();
  return { ok: true };
}

// ────────────────────────── Pesan kontak ──────────────────────────

export async function updateStatusPesan(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  const status = wajib(fd.get("status"));
  if (!id || !status) return { error: "Data tidak valid." };
  try {
    await query(`update contact_messages set status=$1 where id=$2`, [status, id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  revalidatePath("/admin/pesan");
  return { ok: true };
}

export async function hapusPesan(_prev: HasilAksi, fd: FormData): Promise<HasilAksi> {
  await requireSession();
  const id = teks(fd.get("id"));
  if (!id) return { error: "ID tidak valid." };
  try {
    await query(`delete from contact_messages where id=$1`, [id]);
  } catch (e) {
    return { error: terjemahkanGalat(e) };
  }
  revalidatePath("/admin/pesan");
  return { ok: true };
}
