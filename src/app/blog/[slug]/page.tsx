import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getProfile, getPostBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Next.js 16: params adalah Promise, wajib di-await.
type Props = { params: Promise<{ slug: string }> };

function formatTanggal(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return {};

  return {
    title: `${post.title} | Rizal Ammar`,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_path ? { images: [post.cover_path] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [profile, post] = await Promise.all([getProfile(), getPostBySlug(slug)]);

  // Draft tetap ada di DB tapi tidak boleh terlihat publik walau slug ditebak.
  if (!post || post.status !== "published") notFound();

  return (
    <>
      <Navbar profile={profile} />
      <main className="min-h-screen pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-10">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatTanggal(post.published_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.reading_minutes} menit baca
            </span>
          </div>

          {post.cover_path && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_path}
              alt={post.title}
              className="w-full rounded-2xl border border-[var(--border)] mb-10"
            />
          )}

          {/* body_html sudah disanitasi di jalur tulis (lihat src/lib/html.ts) */}
          <div
            className="prose-artikel"
            dangerouslySetInnerHTML={{ __html: post.body_html }}
          />
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
