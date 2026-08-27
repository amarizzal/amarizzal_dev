"use client";

import { useActionState, useRef } from "react";
import { Plus } from "lucide-react";
import { simpanKategoriSkill } from "@/app/admin/actions";

export function NewCategoryForm() {
  const [state, formAction, pending] = useActionState(simpanKategoriSkill, {});
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={formAction}
      className="glass rounded-2xl p-5 border border-dashed border-[var(--border)] flex flex-wrap items-center gap-2"
    >
      <span className="text-xs text-gray-500 shrink-0">Kategori baru:</span>
      <input
        name="key"
        placeholder="key (mis. mobile)"
        required
        className="w-32 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs font-mono focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="label"
        placeholder="Label (mis. Mobile)"
        required
        className="w-36 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input name="color" type="color" defaultValue="#6366f1" className="w-9 h-8 rounded-lg bg-white/5 border border-[var(--border)] cursor-pointer" />
      <input name="sort_order" type="number" defaultValue={0} className="w-14 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs" />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white disabled:opacity-50"
      >
        <Plus size={13} />
        Tambah
      </button>
      {state.error && <span className="text-xs text-red-400">{state.error}</span>}
    </form>
  );
}
