"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanLayanan, hapusLayanan } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import type { Service } from "@/lib/types";

export function LayananRow({ service }: { service?: Service }) {
  const [state, formAction, pending] = useActionState(simpanLayanan, {});

  return (
    <form action={formAction} className="glass rounded-2xl p-4 border border-[var(--border)] space-y-2">
      <input type="hidden" name="id" value={service?.id ?? ""} />
      <div className="flex flex-wrap items-center gap-2">
        <input
          name="icon"
          defaultValue={service?.icon ?? ""}
          placeholder="🖥️"
          className="w-14 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm text-center focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="title"
          defaultValue={service?.title}
          placeholder="Judul layanan"
          required
          className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={service?.sort_order ?? 0}
          className="w-16 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs"
          title="Urutan"
        />
        <label className="flex items-center gap-1.5 text-xs text-gray-400">
          <input type="checkbox" name="aktif" defaultChecked={service ? service.aktif : true} className="accent-[#6366f1]" />
          Aktif
        </label>
      </div>
      <textarea
        name="description"
        defaultValue={service?.description}
        placeholder="Deskripsi singkat"
        rows={2}
        required
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white disabled:opacity-50"
        >
          <Check size={13} />
          Simpan
        </button>
        {service?.id && <ConfirmDeleteForm action={hapusLayanan} id={service.id} label="Hapus layanan ini?" />}
        {state.error && <span className="text-xs text-red-400">{state.error}</span>}
      </div>
    </form>
  );
}
