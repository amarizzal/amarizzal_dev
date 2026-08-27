"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanKategoriSkill, hapusKategoriSkill } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import { SkillRow } from "./SkillRow";
import type { SkillGroup } from "@/lib/types";

export function CategoryCard({ group }: { group: SkillGroup }) {
  const [state, formAction, pending] = useActionState(simpanKategoriSkill, {});

  return (
    <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-4">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={group.id} />
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: group.color }}
        />
        <input
          name="key"
          defaultValue={group.key}
          placeholder="key (frontend)"
          required
          className="w-28 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs font-mono focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="label"
          defaultValue={group.label}
          placeholder="Label"
          required
          className="w-32 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs font-semibold focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="color"
          type="color"
          defaultValue={group.color}
          className="w-9 h-8 rounded-lg bg-white/5 border border-[var(--border)] cursor-pointer"
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={group.sort_order}
          className="w-14 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
          title="Urutan"
        />
        <button
          type="submit"
          disabled={pending}
          title="Simpan kategori"
          className="p-1.5 rounded-lg text-gray-500 hover:text-[#6366f1] hover:bg-[#6366f1]/10 disabled:opacity-50"
        >
          <Check size={14} />
        </button>
        <ConfirmDeleteForm
          action={hapusKategoriSkill}
          id={group.id}
          label="Hapus kategori ini beserta semua skill di dalamnya?"
        />
        {state.error && <span className="text-xs text-red-400">{state.error}</span>}
      </form>

      <div className="space-y-2 pl-4 border-l border-[var(--border)]">
        {group.items.map((skill) => (
          <SkillRow key={skill.id} categoryId={group.id} skill={skill} />
        ))}
        <SkillRow categoryId={group.id} />
      </div>
    </div>
  );
}
