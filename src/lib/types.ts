export type User = {
  id: string
  email: string
  nama: string
  role: string
  aktif: boolean
}

export type Media = {
  id: string
  path: string
  alt: string | null
  width: number | null
  height: number | null
  mime: string
  bytes: number
}

export type Profile = {
  id: string
  locale: string
  nama: string
  title: string
  tagline: string
  location: string
  email: string
  github_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
  whatsapp_url: string | null
  bio: string
  bio2: string | null
  years_of_experience: number
  projects_completed: number
  clients_satisfied: number
  cv_path: string | null
  og_image_path: string | null
  avatar_path: string | null
}

export type Skill = {
  id: string
  name: string
  level: number
  icon: string | null
  sort_order: number
}

export type SkillGroup = {
  id: string
  key: string
  label: string
  color: string
  sort_order: number
  items: Skill[]
}

export type TechStackItem = { id: string; name: string }

export type Service = {
  id: string
  icon: string | null
  title: string
  description: string
  sort_order: number
  aktif: boolean
}

export type Experience = {
  id: string
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
  sort_order: number
}

export type LiveStatus = 'live' | 'offline' | 'private' | 'none'

export type Project = {
  id: string
  slug: string
  title: string
  client_name: string | null
  description: string
  core_insight: string | null
  category: string
  accent_color: string
  cover_path: string | null
  live_url: string | null
  live_status: LiveStatus
  github_url: string | null
  featured: boolean
  published: boolean
  sort_order: number
  updated_at: string
  tech: string[]
}

export type SectionItemKind = 'poin' | 'baris'

export type ProjectSectionItem = {
  id: string
  sort_order: number
  kind: SectionItemKind
  kiri: string
  kanan: string | null
}

export type SectionKind = 'masalah' | 'solusi' | 'hasil' | 'proses' | 'custom'

export type ProjectSection = {
  id: string
  sort_order: number
  kind: SectionKind
  label: string
  heading: string
  body_html: string | null
  highlight: string | null
  media_path: string | null
  items: ProjectSectionItem[]
}

export type ProjectMetric = {
  id: string
  label: string
  value: string
  provenance: 'my_work' | 'client_claim'
  note: string | null
  is_public: boolean
}

export type ProjectDetail = Project & {
  sections: ProjectSection[]
  metrics: ProjectMetric[]
}

export type PostStatus = 'draft' | 'published'

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body_html: string
  cover_path: string | null
  tags: string[]
  status: PostStatus
  reading_minutes: number
  published_at: string | null
}

export type ContactMessageStatus = 'baru' | 'dibaca' | 'dibalas' | 'spam'

export type ContactMessage = {
  id: string
  nama: string
  email: string
  subjek: string | null
  pesan: string
  status: ContactMessageStatus
  created_at: string
}
