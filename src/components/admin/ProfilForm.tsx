"use client";

import { useActionState } from "react";
import { simpanProfil } from "@/app/admin/actions";
import type { Profile } from "@/lib/types";

export default function ProfilForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState(simpanProfil, {});

  const F = ({ label, name, defaultValue, type = "text", required = false }: {
    label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
      />
    </div>
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <F label="Nama" name="nama" defaultValue={profile?.nama} required />
        <F label="Jabatan / Title" name="title" defaultValue={profile?.title} required />
      </div>
      <F label="Tagline" name="tagline" defaultValue={profile?.tagline} required />
      <div className="grid sm:grid-cols-2 gap-4">
        <F label="Lokasi" name="location" defaultValue={profile?.location} required />
        <F label="Email" name="email" type="email" defaultValue={profile?.email} required />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Bio (paragraf 1)</label>
        <textarea
          name="bio"
          required
          rows={3}
          defaultValue={profile?.bio ?? ""}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50 resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Bio (paragraf 2, opsional)</label>
        <textarea
          name="bio2"
          rows={3}
          defaultValue={profile?.bio2 ?? ""}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50 resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <F label="GitHub URL" name="github_url" defaultValue={profile?.github_url} />
        <F label="LinkedIn URL" name="linkedin_url" defaultValue={profile?.linkedin_url} />
        <F label="Instagram URL" name="instagram_url" defaultValue={profile?.instagram_url} />
        <F label="WhatsApp URL (wa.me/...)" name="whatsapp_url" defaultValue={profile?.whatsapp_url} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <F label="Tahun Pengalaman" name="years_of_experience" type="number" defaultValue={profile?.years_of_experience} />
        <F label="Proyek Selesai" name="projects_completed" type="number" defaultValue={profile?.projects_completed} />
        <F label="Klien Puas" name="clients_satisfied" type="number" defaultValue={profile?.clients_satisfied} />
      </div>

      <F label="Path CV (mis. /uploads/cv.pdf) — kosongkan bila belum ada" name="cv_path" defaultValue={profile?.cv_path} />

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}
      {state.ok && !pending && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">
          Tersimpan.
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
