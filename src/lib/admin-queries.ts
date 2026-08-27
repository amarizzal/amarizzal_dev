import "server-only";
import { query, queryOne } from "@/lib/db";
import type {
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
} from "@/lib/types";

/**
 * Query khusus panel admin — TIDAK difilter published/status seperti
 * src/lib/queries.ts (yang menyuplai situs publik), dan TIDAK dibungkus
 * aman(): kalau database bermasalah, admin harus melihat error sungguhan,
 * bukan halaman kosong yang menyamar baik-baik saja.
 */

const LOCALE = "id";

export async function getProfileForEdit(): Promise<Profile | null> {
  return queryOne<Profile>(
    `select p.id, p.locale, p.nama, p.title, p.tagline, p.location, p.email,
            p.github_url, p.linkedin_url, p.instagram_url, p.whatsapp_url,
            p.bio, p.bio2, p.years_of_experience, p.projects_completed,
            p.clients_satisfied, p.cv_path,
            og.path as og_image_path, av.path as avatar_path
       from profile p
       left join media og on og.id = p.og_image_id
       left join media av on av.id = p.avatar_id
      where p.locale = $1`,
    [LOCALE],
  );
}

export async function getSkillGroupsAdmin(): Promise<SkillGroup[]> {
  const cats = await query<Omit<SkillGroup, "items">>(
    `select id, key, label, color, sort_order
       from skill_categories where locale = $1 order by sort_order`,
    [LOCALE],
  );
  if (cats.length === 0) return [];
  const items = await query<{ category_id: string } & SkillGroup["items"][number]>(
    `select s.id, s.category_id, s.name, s.level, s.icon, s.sort_order
       from skills s join skill_categories c on c.id = s.category_id
      where c.locale = $1 order by s.sort_order`,
    [LOCALE],
  );
  return cats.map((cat) => ({ ...cat, items: items.filter((i) => i.category_id === cat.id) }));
}

export async function getTechStackAdmin() {
  return query<{ id: string; name: string; sort_order: number }>(
    `select id, name, sort_order from tech_stack order by sort_order`,
  );
}

export async function getServicesAdmin(): Promise<Service[]> {
  return query<Service>(
    `select id, icon, title, description, sort_order, aktif
       from services where locale = $1 order by sort_order`,
    [LOCALE],
  );
}

export async function getExperiencesAdmin(): Promise<Experience[]> {
  return query<Experience>(
    `select id, role, company, period, description, highlights, sort_order
       from experiences where locale = $1 order by sort_order`,
    [LOCALE],
  );
}

const PROJECT_SELECT_ADMIN = `
  select pr.id, pr.slug, pr.title, pr.client_name, pr.description, pr.core_insight,
         pr.category, pr.accent_color, m.path as cover_path, pr.live_url,
         pr.live_status, pr.github_url, pr.featured, pr.published, pr.sort_order,
         pr.updated_at
    from projects pr
    left join media m on m.id = pr.cover_id
`;

export async function getProjectsAdmin(): Promise<Project[]> {
  const rows = await query<Omit<Project, "tech">>(
    `${PROJECT_SELECT_ADMIN} where pr.locale = $1 order by pr.sort_order`,
    [LOCALE],
  );
  if (rows.length === 0) return [];
  const tech = await query<{ project_id: string; name: string }>(
    `select project_id, name from project_tech
      where project_id = any($1::uuid[]) order by sort_order`,
    [rows.map((p) => p.id)],
  );
  return rows.map((p) => ({ ...p, tech: tech.filter((t) => t.project_id === p.id).map((t) => t.name) }));
}

export async function getProjectForEdit(id: string): Promise<ProjectDetail | null> {
  const row = await queryOne<Omit<Project, "tech">>(`${PROJECT_SELECT_ADMIN} where pr.id = $1`, [id]);
  if (!row) return null;

  const tech = await query<{ name: string }>(
    `select name from project_tech where project_id = $1 order by sort_order`,
    [id],
  );

  const sectionsRaw = await query<
    Omit<ProjectSection, "items" | "media_path"> & { media_path: string | null }
  >(
    `select ps.id, ps.sort_order, ps.kind, ps.label, ps.heading, ps.body_html,
            ps.highlight, m.path as media_path
       from project_sections ps
       left join media m on m.id = ps.media_id
      where ps.project_id = $1
      order by ps.sort_order`,
    [id],
  );

  const items =
    sectionsRaw.length === 0
      ? []
      : await query<{ section_id: string } & ProjectSectionItem>(
          `select section_id, id, sort_order, kind, kiri, kanan
             from project_section_items
            where section_id = any($1::uuid[])
            order by sort_order`,
          [sectionsRaw.map((s) => s.id)],
        );

  const sections: ProjectSection[] = sectionsRaw.map((s) => ({
    ...s,
    items: items.filter((i) => i.section_id === s.id),
  }));

  const metrics = await query<ProjectMetric>(
    `select id, label, value, provenance, note, is_public
       from project_metrics where project_id = $1 order by sort_order`,
    [id],
  );

  return { ...row, tech: tech.map((t) => t.name), sections, metrics };
}

const POST_SELECT_ADMIN = `
  select p.id, p.slug, p.title, p.excerpt, p.body_html, m.path as cover_path,
         p.tags, p.status, p.reading_minutes, p.published_at
    from posts p
    left join media m on m.id = p.cover_id
`;

export async function getPostsAdmin(): Promise<Post[]> {
  return query<Post>(`${POST_SELECT_ADMIN} where p.locale = $1 order by p.created_at desc`, [LOCALE]);
}

export async function getPostForEdit(id: string): Promise<Post | null> {
  return queryOne<Post>(`${POST_SELECT_ADMIN} where p.id = $1`, [id]);
}
