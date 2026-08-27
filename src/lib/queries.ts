import 'server-only'
import { query, queryOne } from '@/lib/db'
import type {
  ContactMessage,
  Experience,
  Post,
  Profile,
  Project,
  ProjectDetail,
  ProjectMetric,
  ProjectSection,
  ProjectSectionItem,
  Service,
  SkillGroup,
  TechStackItem,
} from '@/lib/types'

/**
 * Postgres ini co-tenant (numpang instance milik project ssb-poultry) dan
 * bisa restart tanpa peringatan. Beranda TIDAK boleh ikut mati karena itu —
 * fungsi yang menyusun beranda dibungkus ini dan jatuh ke nilai cadangan.
 * Halaman detail (project/post) sengaja TIDAK dibungkus: 500 yang jujur
 * lebih baik daripada beranda kosong yang menyamar sukses.
 */
async function aman<T>(label: string, fn: () => Promise<T>, cadangan: T): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    console.error(`[queries] ${label} gagal:`, e)
    return cadangan
  }
}

const DEFAULT_LOCALE = 'id'

// ── Profil ───────────────────────────────────────────────────────────────

export async function getProfile(locale = DEFAULT_LOCALE): Promise<Profile | null> {
  return aman(
    'getProfile',
    () =>
      queryOne<Profile>(
        `select p.id, p.locale, p.nama, p.title, p.tagline, p.location, p.email,
                p.github_url, p.linkedin_url, p.instagram_url, p.whatsapp_url,
                p.bio, p.bio2, p.years_of_experience, p.projects_completed,
                p.clients_satisfied, p.cv_path,
                og.path as og_image_path, av.path as avatar_path
           from profile p
           left join media og on og.id = p.og_image_id
           left join media av on av.id = p.avatar_id
          where p.locale = $1`,
        [locale],
      ),
    null,
  )
}

// ── Skills ───────────────────────────────────────────────────────────────

export async function getSkillGroups(locale = DEFAULT_LOCALE): Promise<SkillGroup[]> {
  return aman(
    'getSkillGroups',
    async () => {
      const cats = await query<Omit<SkillGroup, 'items'>>(
        `select id, key, label, color, sort_order
           from skill_categories
          where locale = $1
          order by sort_order`,
        [locale],
      )
      if (cats.length === 0) return []

      const items = await query<{ category_id: string } & SkillGroup['items'][number]>(
        `select s.id, s.category_id, s.name, s.level, s.icon, s.sort_order
           from skills s
           join skill_categories c on c.id = s.category_id
          where c.locale = $1
          order by s.sort_order`,
        [locale],
      )

      return cats.map((cat) => ({
        ...cat,
        items: items.filter((i) => i.category_id === cat.id),
      }))
    },
    [],
  )
}

export async function getTechStack(): Promise<TechStackItem[]> {
  return aman(
    'getTechStack',
    () => query<TechStackItem>(`select id, name from tech_stack order by sort_order`),
    [],
  )
}

// ── Layanan ──────────────────────────────────────────────────────────────

export async function getServices(locale = DEFAULT_LOCALE): Promise<Service[]> {
  return aman(
    'getServices',
    () =>
      query<Service>(
        `select id, icon, title, description, sort_order
           from services
          where locale = $1 and aktif
          order by sort_order`,
        [locale],
      ),
    [],
  )
}

// ── Pengalaman ───────────────────────────────────────────────────────────

export async function getExperiences(locale = DEFAULT_LOCALE): Promise<Experience[]> {
  return aman(
    'getExperiences',
    () =>
      query<Experience>(
        `select id, role, company, period, description, highlights, sort_order
           from experiences
          where locale = $1
          order by sort_order`,
        [locale],
      ),
    [],
  )
}

// ── Proyek ───────────────────────────────────────────────────────────────

const PROJECT_SELECT = `
  select pr.id, pr.slug, pr.title, pr.client_name, pr.description, pr.core_insight,
         pr.category, pr.accent_color, m.path as cover_path, pr.live_url,
         pr.live_status, pr.github_url, pr.featured, pr.published, pr.sort_order,
         pr.updated_at
    from projects pr
    left join media m on m.id = pr.cover_id
`

async function withTech(projects: Omit<Project, 'tech'>[]): Promise<Project[]> {
  if (projects.length === 0) return []
  const tech = await query<{ project_id: string; name: string }>(
    `select project_id, name from project_tech
      where project_id = any($1::uuid[])
      order by sort_order`,
    [projects.map((p) => p.id)],
  )
  return projects.map((p) => ({
    ...p,
    tech: tech.filter((t) => t.project_id === p.id).map((t) => t.name),
  }))
}

export async function getFeaturedProjects(locale = DEFAULT_LOCALE): Promise<Project[]> {
  return aman(
    'getFeaturedProjects',
    async () => {
      const rows = await query<Omit<Project, 'tech'>>(
        `${PROJECT_SELECT}
          where pr.locale = $1 and pr.published
          order by pr.featured desc, pr.sort_order`,
        [locale],
      )
      return withTech(rows)
    },
    [],
  )
}

/** Dipakai halaman detail — TIDAK dibungkus aman(), boleh melempar. */
export async function getProjectDetail(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<ProjectDetail | null> {
  const row = await queryOne<Omit<Project, 'tech'>>(
    `${PROJECT_SELECT} where pr.slug = $1 and pr.locale = $2`,
    [slug, locale],
  )
  if (!row) return null

  const [project] = await withTech([row])

  const sectionsRaw = await query<Omit<ProjectSection, 'items' | 'media_path'> & {
    media_path: string | null
  }>(
    `select ps.id, ps.sort_order, ps.kind, ps.label, ps.heading, ps.body_html,
            ps.highlight, m.path as media_path
       from project_sections ps
       left join media m on m.id = ps.media_id
      where ps.project_id = $1
      order by ps.sort_order`,
    [project.id],
  )

  const items =
    sectionsRaw.length === 0
      ? []
      : await query<{ section_id: string } & ProjectSectionItem>(
          `select section_id, id, sort_order, kind, kiri, kanan
             from project_section_items
            where section_id = any($1::uuid[])
            order by sort_order`,
          [sectionsRaw.map((s) => s.id)],
        )

  const sections: ProjectSection[] = sectionsRaw.map((s) => ({
    ...s,
    items: items.filter((i) => i.section_id === s.id),
  }))

  const metrics = await query<ProjectMetric>(
    `select id, label, value, provenance, note, is_public
       from project_metrics
      where project_id = $1
      order by sort_order`,
    [project.id],
  )

  return { ...project, sections, metrics }
}

// ── Blog ─────────────────────────────────────────────────────────────────

const POST_SELECT = `
  select p.id, p.slug, p.title, p.excerpt, p.body_html, m.path as cover_path,
         p.tags, p.status, p.reading_minutes, p.published_at
    from posts p
    left join media m on m.id = p.cover_id
`

export async function getPublishedPosts(locale = DEFAULT_LOCALE): Promise<Post[]> {
  return aman(
    'getPublishedPosts',
    () =>
      query<Post>(
        `${POST_SELECT}
          where p.locale = $1 and p.status = 'published'
          order by p.published_at desc`,
        [locale],
      ),
    [],
  )
}

/** Dipakai halaman detail — TIDAK dibungkus aman(), boleh melempar. */
export async function getPostBySlug(slug: string, locale = DEFAULT_LOCALE): Promise<Post | null> {
  return queryOne<Post>(`${POST_SELECT} where p.slug = $1 and p.locale = $2`, [slug, locale])
}

// ── Sitemap ──────────────────────────────────────────────────────────────

export async function getSitemapEntries(): Promise<{
  projects: { slug: string; updated_at: string }[]
  posts: { slug: string; updated_at: string }[]
}> {
  return aman(
    'getSitemapEntries',
    async () => {
      const [projects, posts] = await Promise.all([
        query<{ slug: string; updated_at: string }>(
          `select slug, updated_at from projects where published order by sort_order`,
        ),
        query<{ slug: string; updated_at: string }>(
          `select slug, published_at as updated_at from posts
            where status = 'published' order by published_at desc`,
        ),
      ])
      return { projects, posts }
    },
    { projects: [], posts: [] },
  )
}

// ── Admin (dashboard ringkasan) ─────────────────────────────────────────

export async function getContactMessages(): Promise<ContactMessage[]> {
  return query<ContactMessage>(
    `select id, nama, email, subjek, pesan, status, created_at
       from contact_messages
      order by created_at desc`,
  )
}

export async function getAdminSummary() {
  return queryOne<{ pesan_baru: number; draft_tulisan: number; total_proyek: number }>(
    `select
       (select count(*) from contact_messages where status = 'baru') as pesan_baru,
       (select count(*) from posts where status = 'draft') as draft_tulisan,
       (select count(*) from projects) as total_proyek`,
  )
}
