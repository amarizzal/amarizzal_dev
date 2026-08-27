"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanMetrik, hapusMetrik } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import type { ProjectMetric } from "@/lib/types";

export function MetricRow({ projectId, metric }: { projectId: string; metric?: ProjectMetric }) {
  const [state, formAction, pending] = useActionState(simpanMetrik, {});

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={metric?.id ?? ""} />
      <input type="hidden" name="project_id" value={projectId} />
      <input
        name="value"
        defaultValue={metric?.value}
        placeholder="9"
        required
        className="w-20 px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <input
        name="label"
        defaultValue={metric?.label}
        placeholder="Modul kalkulator"
        required
        className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <select
        name="provenance"
        defaultValue={metric?.provenance ?? "my_work"}
        className="px-2 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs"
      >
        <option value="my_work">Hasil pekerjaan sendiri</option>
        <option value="client_claim">Klaim klien (bukan hasil sendiri)</option>
      </select>
      <input
        name="note"
        defaultValue={metric?.note ?? ""}
        placeholder="Sumber / catatan"
        className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
      />
      <label className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
        <input type="checkbox" name="is_public" defaultChecked={metric ? metric.is_public : true} className="accent-[#6366f1]" />
        Publik
      </label>
      <button type="submit" disabled={pending} className="p-1.5 rounded-lg text-gray-500 hover:text-[#6366f1] hover:bg-[#6366f1]/10 disabled:opacity-50">
        <Check size={13} />
      </button>
      {metric?.id && <ConfirmDeleteForm action={hapusMetrik} id={metric.id} label="Hapus metrik ini?" />}
      {state.error && <span className="text-xs text-red-400 w-full">{state.error}</span>}
    </form>
  );
}
