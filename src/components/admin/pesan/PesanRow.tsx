"use client";

import { useActionState } from "react";
import { updateStatusPesan, hapusPesan } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import type { ContactMessage } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  baru: "bg-blue-500/15 text-blue-400",
  dibaca: "bg-gray-500/15 text-gray-400",
  dibalas: "bg-green-500/15 text-green-400",
  spam: "bg-red-500/15 text-red-400",
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function PesanRow({ pesan }: { pesan: ContactMessage }) {
  const [, formAction] = useActionState(updateStatusPesan, {});

  return (
    <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white text-sm">{pesan.nama}</p>
          <p className="text-xs text-gray-500">{pesan.email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[pesan.status]}`}>{pesan.status}</span>
          <span className="text-xs text-gray-600">{formatTanggal(pesan.created_at)}</span>
        </div>
      </div>
      {pesan.subjek && <p className="text-sm text-gray-300 font-medium">{pesan.subjek}</p>}
      <p className="text-sm text-gray-400 whitespace-pre-wrap">{pesan.pesan}</p>

      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={pesan.id} />
          <select
            name="status"
            defaultValue={pesan.status}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="px-2 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs"
          >
            <option value="baru">Baru</option>
            <option value="dibaca">Dibaca</option>
            <option value="dibalas">Dibalas</option>
            <option value="spam">Spam</option>
          </select>
        </form>
        <a
          href={`mailto:${pesan.email}?subject=${encodeURIComponent(`Re: ${pesan.subjek ?? "Pesan dari amarizzal.dev"}`)}`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white"
        >
          Balas via Email
        </a>
        <ConfirmDeleteForm action={hapusPesan} id={pesan.id} label="Hapus pesan ini?" />
      </div>
    </div>
  );
}
