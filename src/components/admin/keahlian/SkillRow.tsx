"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanSkill } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import { hapusSkill } from "@/app/admin/actions";
import type { Skill } from "@/lib/types";

export function SkillRow({ categoryId, skill }: { categoryId: string; skill?: Skill }) {
  const [state, formAction, pending] = useActionState(simpanSkill, {});

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={skill?.id ?? ""} />
      <input type="hidden" name="category_id" value={categoryId} />
      <input
        name="name"
        defaultValue={skill?.name}
        placeholder="Nama skill"
        required
        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="icon"
        defaultValue={skill?.icon ?? ""}
        placeholder="Ikon"
        className="w-16 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="level"
        type="number"
        min={0}
        max={100}
        defaultValue={skill?.level ?? 70}
        className="w-16 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="sort_order"
        type="number"
        defaultValue={skill?.sort_order ?? 0}
        className="w-14 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
        title="Urutan"
      />
      <button
        type="submit"
        disabled={pending}
        title="Simpan"
        className="p-1.5 rounded-lg text-gray-500 hover:text-[#6366f1] hover:bg-[#6366f1]/10 disabled:opacity-50"
      >
        <Check size={14} />
      </button>
      {skill?.id && <ConfirmDeleteForm action={hapusSkill} id={skill.id} label="Hapus skill ini?" />}
      {state.error && <span className="text-xs text-red-400">{state.error}</span>}
    </form>
  );
}
