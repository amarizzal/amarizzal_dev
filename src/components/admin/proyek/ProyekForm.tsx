"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { simpanProyek } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Project } from "@/lib/types";

const KATEGORI_UMUM = ["Full-Stack App", "SaaS", "Backend", "Website", "PWA", "E-Commerce"];

export default function ProyekForm({ project }: { project?: Project & { cover_media_id?: string } }) {
  const [state, formAction, pending] = useActionState(simpanProyek, {});
  const router = useRouter();

  // Setelah proyek baru berhasil dibuat, langsung pindah ke halaman edit
  // supaya bagian studi kasus & metrik bisa ditambahkan (butuh project_id).
  useEffect(() => {
    if (state.ok && state.id && !project) {
      router.push(`/admin/proyek/${state.id}`);
    }
  }, [state.ok, state.id, project, router]);

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      <input type="hidden" name="id" value={project?.id ?? ""} />

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Gambar sampul</label>
        <ImageUpload fieldName="cover_media_id" defaultPath={project?.cover_path} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Judul</label>
          <input
            name="title"
            defaultValue={project?.title}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Slug (kosongkan untuk otomatis)</label>
          <input
            name="slug"
            defaultValue={project?.slug}
            placeholder="dari-judul-otomatis"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm font-mono focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Nama klien (opsional)</label>
          <input
            name="client_name"
            defaultValue={project?.client_name ?? ""}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Kategori</label>
          <input
            name="category"
            list="kategori-umum"
            defaultValue={project?.category ?? "Website"}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
          <datalist id="kategori-umum">
            {KATEGORI_UMUM.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Deskripsi ringkas (untuk kartu di beranda)</label>
        <textarea
          name="description"
          defaultValue={project?.description}
          required
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Core insight (tesis 3 kalimat, opsional)</label>
        <textarea
          name="core_insight"
          defaultValue={project?.core_insight ?? ""}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Tech stack (pisahkan dengan koma atau baris baru)</label>
        <textarea
          name="tech"
          defaultValue={project?.tech.join(", ")}
          rows={2}
          placeholder="Next.js, TypeScript, PostgreSQL"
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Warna aksen</label>
          <input
            name="accent_color"
            type="color"
            defaultValue={project?.accent_color ?? "#6366f1"}
            className="w-full h-10 rounded-xl bg-white/5 border border-[var(--border)] cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Urutan tampil</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Status live</label>
          <select
            name="live_status"
            defaultValue={project?.live_status ?? "none"}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          >
            <option value="none">Tidak ada / belum relevan</option>
            <option value="live">Live — tampilkan URL</option>
            <option value="offline">Offline — sembunyikan URL</option>
            <option value="private">Privat — sembunyikan URL</option>
          </select>
          <p className="text-xs text-gray-600">
            URL hanya dicetak di situs publik saat status &quot;Live&quot;.
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">URL live</label>
          <input
            name="live_url"
            defaultValue={project?.live_url ?? ""}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">URL GitHub (opsional)</label>
        <input
          name="github_url"
          defaultValue={project?.github_url ?? ""}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} className="accent-[#6366f1]" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" name="published" defaultChecked={project?.published} className="accent-[#6366f1]" />
          Terbitkan (tampil di situs publik)
        </label>
      </div>

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
