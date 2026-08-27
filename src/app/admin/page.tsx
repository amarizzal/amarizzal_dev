import Link from "next/link";
import { MessageSquare, FileText, Briefcase } from "lucide-react";
import { getAdminSummary } from "@/lib/queries";

export default async function AdminDashboard() {
  const summary = await getAdminSummary();

  const cards = [
    { href: "/admin/pesan", icon: MessageSquare, label: "Pesan Baru", value: summary?.pesan_baru ?? 0 },
    { href: "/admin/tulisan", icon: FileText, label: "Draft Tulisan", value: summary?.draft_tulisan ?? 0 },
    { href: "/admin/proyek", icon: Briefcase, label: "Total Proyek", value: summary?.total_proyek ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Ringkasan</h1>
      <p className="text-sm text-gray-500 mb-8">Kelola konten amarizzal.dev dari sini.</p>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="glass rounded-2xl p-5 border border-[var(--border)] glass-hover block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                <c.icon size={16} className="text-[#6366f1]" />
              </div>
              <span className="text-sm text-gray-400">{c.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{c.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
