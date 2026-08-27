"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanTech, hapusTech } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

type TechItem = { id: string; name: string; sort_order: number };

function TechRow({ item }: { item?: TechItem }) {
  const [state, formAction, pending] = useActionState(simpanTech, {});
  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input
        name="name"
        defaultValue={item?.name}
        placeholder="Nama teknologi"
        required
        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="sort_order"
        type="number"
        defaultValue={item?.sort_order ?? 0}
        className="w-14 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <button type="submit" disabled={pending} className="p-1.5 rounded-lg text-gray-500 hover:text-[#6366f1] hover:bg-[#6366f1]/10 disabled:opacity-50">
        <Check size={14} />
      </button>
      {item?.id && <ConfirmDeleteForm action={hapusTech} id={item.id} label="Hapus item tech stack ini?" />}
      {state.error && <span className="text-xs text-red-400">{state.error}</span>}
    </form>
  );
}

export function TechStackEditor({ items }: { items: TechItem[] }) {
  return (
    <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-2">
      <h3 className="text-sm font-semibold text-white mb-3">Teknologi yang pernah digunakan</h3>
      {items.map((item) => (
        <TechRow key={item.id} item={item} />
      ))}
      <TechRow />
    </div>
  );
}
