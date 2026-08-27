"use client";

import { useActionState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { simpanBagian } from "@/app/admin/actions";

export function NewSectionForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(simpanBagian, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={ref}
      action={formAction}
      className="glass rounded-2xl p-5 border border-dashed border-[var(--border)] space-y-2"
    >
      <input type="hidden" name="project_id" value={projectId} />
      <p className="text-xs text-gray-500 mb-1">Tambah bagian baru</p>
      <div className="grid sm:grid-cols-3 gap-2">
        <select name="kind" defaultValue="solusi" className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs">
          <option value="masalah">Masalah</option>
          <option value="solusi">Solusi / Yang dibangun</option>
          <option value="hasil">Hasil</option>
          <option value="proses">Cara bekerja</option>
          <option value="custom">Bebas</option>
        </select>
        <input
          name="label"
          placeholder="02 — YANG SAYA BANGUN"
          required
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs font-mono focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="highlight"
          placeholder="Highlight (opsional)"
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>
      <input
        name="heading"
        placeholder="Judul bagian"
        required
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white disabled:opacity-50"
      >
        <Plus size={13} />
        Tambah Bagian
      </button>
      {state.error && <span className="text-xs text-red-400 ml-2">{state.error}</span>}
    </form>
  );
}
