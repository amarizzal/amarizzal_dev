import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/queries";

// Wajib. Tanpa ini Next mencoba mengeksekusi sitemap saat build — dan saat
// build (GitHub Actions) tidak ada database.
export const dynamic = "force-dynamic";

const BASE = "https://amarizzal.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, posts } = await getSitemapEntries();

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${BASE}/project/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
