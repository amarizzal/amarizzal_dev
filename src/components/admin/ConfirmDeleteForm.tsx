"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import type { HasilAksi } from "@/app/admin/actions";

export default function ConfirmDeleteForm({
  action,
  id,
  label = "Yakin ingin menghapus ini? Tindakan ini tidak bisa dibatalkan.",
}: {
  action: (prev: HasilAksi, fd: FormData) => Promise<HasilAksi>;
  id: string;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState<HasilAksi, FormData>(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(label)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        title="Hapus"
        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        <Trash2 size={14} />
      </button>
      {state.error && <p className="text-xs text-red-400 mt-1">{state.error}</p>}
    </form>
  );
}
