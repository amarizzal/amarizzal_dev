import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { getPostsAdmin } from "@/lib/admin-queries";
import { hapusTulisan } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export default async function AdminTulisanPage() {
  const posts = await getPostsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tulisan</h1>
          <p className="text-sm text-gray-500">Artikel panjang gaya blog.</p>
        </div>
        <Link
          href="/admin/tulisan/baru"
          className="inline-flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={15} />
          Tulisan Baru
        </Link>
      </div>

      <div className="space-y-2">
        {posts.length === 0 && <p className="text-sm text-gray-600">Belum ada tulisan.</p>}
        {posts.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 border border-[var(--border)] flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/admin/tulisan/${p.id}`} className="font-semibold text-white text-sm hover:text-[#818cf8]">
                  {p.title}
                </Link>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === "published" ? "bg-green-500/15 text-green-400" : "bg-orange-500/15 text-orange-400"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate">{p.slug}</p>
            </div>
            {p.status === "published" && (
              <Link href={`/blog/${p.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5">
                <ExternalLink size={14} />
              </Link>
            )}
            <ConfirmDeleteForm action={hapusTulisan} id={p.id} label={`Hapus tulisan "${p.title}"?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
