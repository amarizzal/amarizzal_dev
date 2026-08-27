"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanItemBagian, hapusItemBagian } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import type { ProjectSectionItem } from "@/lib/types";

export function SectionItemRow({ sectionId, item }: { sectionId: string; item?: ProjectSectionItem }) {
  const [state, formAction, pending] = useActionState(simpanItemBagian, {});

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="section_id" value={sectionId} />
      <select
        name="kind"
        defaultValue={item?.kind ?? "poin"}
        className="px-2 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs"
      >
        <option value="poin">Poin (satu sisi)</option>
        <option value="baris">Baris (kiri → kanan)</option>
      </select>
      <input
        name="kiri"
        defaultValue={item?.kiri}
        placeholder="Teks / label kiri"
        required
        className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="kanan"
        defaultValue={item?.kanan ?? ""}
        placeholder="Teks kanan (hanya untuk baris)"
        className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <button type="submit" disabled={pending} className="p-1.5 rounded-lg text-gray-500 hover:text-[#6366f1] hover:bg-[#6366f1]/10 disabled:opacity-50">
        <Check size={13} />
      </button>
      {item?.id && <ConfirmDeleteForm action={hapusItemBagian} id={item.id} label="Hapus item ini?" />}
      {state.error && <span className="text-xs text-red-400 w-full">{state.error}</span>}
    </form>
  );
}
