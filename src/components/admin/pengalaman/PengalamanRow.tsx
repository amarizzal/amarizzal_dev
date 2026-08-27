"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanPengalaman, hapusPengalaman } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import type { Experience } from "@/lib/types";

export function PengalamanRow({ exp }: { exp?: Experience }) {
  const [state, formAction, pending] = useActionState(simpanPengalaman, {});

  return (
    <form action={formAction} className="glass rounded-2xl p-4 border border-[var(--border)] space-y-3">
      <input type="hidden" name="id" value={exp?.id ?? ""} />
      <div className="grid sm:grid-cols-3 gap-2">
        <input
          name="role"
          defaultValue={exp?.role}
          placeholder="Peran (mis. Fullstack Developer)"
          required
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="company"
          defaultValue={exp?.company}
          placeholder="Perusahaan"
          required
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="period"
          defaultValue={exp?.period}
          placeholder="Periode (mis. 2023 — Sekarang)"
          required
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>
      <textarea
        name="description"
        defaultValue={exp?.description}
        placeholder="Deskripsi"
        rows={2}
        required
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
      />
      <textarea
        name="highlights"
        defaultValue={exp?.highlights.join("\n")}
        placeholder={"Highlight, satu per baris\nContoh:\nMembangun 15+ aplikasi web"}
        rows={3}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
      />
      <div className="flex items-center gap-2">
        <input
          name="sort_order"
          type="number"
          defaultValue={exp?.sort_order ?? 0}
          className="w-16 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs"
          title="Urutan"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white disabled:opacity-50"
        >
          <Check size={13} />
          Simpan
        </button>
        {exp?.id && <ConfirmDeleteForm action={hapusPengalaman} id={exp.id} label="Hapus pengalaman ini?" />}
        {state.error && <span className="text-xs text-red-400">{state.error}</span>}
      </div>
    </form>
  );
}
