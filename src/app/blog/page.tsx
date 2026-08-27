import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getProfile, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tulisan | Rizal Ammar",
  description: "Catatan dan tulisan panjang seputar pengembangan web, arsitektur sistem, dan proses kerja.",
};

function formatTanggal(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const [profile, posts] = await Promise.all([getProfile(), getPublishedPosts()]);

  return (
    <>
      <Navbar profile={profile} />
      <main className="min-h-screen pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-2">
            — Tulisan
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white section-heading mb-4">
            Catatan &amp; Tulisan
          </h1>
          <p className="text-gray-500 max-w-lg mb-16">
            Hal-hal yang saya pelajari dan pikirkan seputar pengembangan produk digital.
          </p>

          {posts.length === 0 ? (
            <div className="glass rounded-2xl p-8 border border-[var(--border)] text-center text-gray-500">
              Belum ada tulisan yang diterbitkan.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block glass rounded-2xl p-6 border border-[var(--border)] glass-hover"
                >
                  <h2 className="text-white font-bold text-lg mb-2">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {formatTanggal(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.reading_minutes} menit baca
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
