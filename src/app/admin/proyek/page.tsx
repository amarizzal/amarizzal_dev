import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { getProjectsAdmin } from "@/lib/admin-queries";
import { hapusProyek } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

const STATUS_BADGE: Record<string, string> = {
  live: "bg-green-500/15 text-green-400",
  offline: "bg-yellow-500/15 text-yellow-400",
  private: "bg-gray-500/15 text-gray-400",
  none: "bg-gray-500/15 text-gray-500",
};

export default async function AdminProyekPage() {
  const projects = await getProjectsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Proyek</h1>
          <p className="text-sm text-gray-500">Studi kasus & portofolio.</p>
        </div>
        <Link
          href="/admin/proyek/baru"
          className="inline-flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={15} />
          Proyek Baru
        </Link>
      </div>

      <div className="space-y-2">
        {projects.length === 0 && (
          <p className="text-sm text-gray-600">Belum ada proyek.</p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="glass rounded-xl p-4 border border-[var(--border)] flex items-center gap-4"
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.accent_color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/admin/proyek/${p.id}`} className="font-semibold text-white text-sm hover:text-[#818cf8]">
                  {p.title}
                </Link>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[p.live_status]}`}>
                  {p.live_status}
                </span>
                {!p.published && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">draft</span>
                )}
                {p.featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8]">featured</span>
                )}
              </div>
              <p className="text-xs text-gray-600 truncate">{p.slug} · {p.category}</p>
            </div>
            {p.published && (
              <Link href={`/project/${p.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5">
                <ExternalLink size={14} />
              </Link>
            )}
            <ConfirmDeleteForm action={hapusProyek} id={p.id} label={`Hapus proyek "${p.title}" beserta seluruh bagian & metriknya?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
