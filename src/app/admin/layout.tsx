import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Panel Admin | Rizal Ammar",
  robots: { index: false, follow: false },
};

const MENU = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/profil", label: "Profil" },
  { href: "/admin/keahlian", label: "Keahlian" },
  { href: "/admin/layanan", label: "Layanan" },
  { href: "/admin/pengalaman", label: "Pengalaman" },
  { href: "/admin/proyek", label: "Proyek" },
  { href: "/admin/tulisan", label: "Tulisan" },
  { href: "/admin/pesan", label: "Pesan" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Penjagaan sungguhan (query DB, cek user.aktif). proxy.ts hanya UX cepat
  // di depan — layout ini yang menegakkan otorisasi untuk semua Server
  // Component di bawah /admin. Server Action TIDAK melewati layout ini,
  // jadi setiap action tetap wajib requireSession() sendiri.
  const { user } = await requireSession();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] glass sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-8 overflow-x-auto">
              <Link href="/admin" className="font-bold text-white text-sm shrink-0">
                rizal<span className="gradient-text">ammar</span>{" "}
                <span className="text-gray-600 font-normal">/admin</span>
              </Link>
              <nav className="flex gap-1 shrink-0">
                {MENU.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    {m.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4 shrink-0 pl-4">
              <span className="text-xs text-gray-600 hidden sm:inline">{user.nama}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
