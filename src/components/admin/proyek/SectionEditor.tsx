"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { simpanBagian, hapusBagian } from "@/app/admin/actions";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import RichEditor from "@/components/admin/editor/RichEditor";
import { ReorderButtons } from "./ReorderButtons";
import { SectionItemRow } from "./SectionItemRow";
import type { ProjectSection } from "@/lib/types";

const KIND_LABEL: Record<string, string> = {
  masalah: "Masalah",
  solusi: "Solusi / Yang dibangun",
  hasil: "Hasil",
  proses: "Cara bekerja",
  custom: "Bebas",
};

export function SectionEditor({ projectId, section }: { projectId: string; section: ProjectSection }) {
  const [state, formAction, pending] = useActionState(simpanBagian, {});

  return (
    <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-4">
      <div className="flex items-start gap-3">
        <ReorderButtons id={section.id} />
        <form action={formAction} className="flex-1 space-y-3">
          <input type="hidden" name="id" value={section.id} />
          <input type="hidden" name="project_id" value={projectId} />

          <div className="grid sm:grid-cols-3 gap-2">
            <select
              name="kind"
              defaultValue={section.kind}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs"
            >
              {Object.entries(KIND_LABEL).map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </select>
            <input
              name="label"
              defaultValue={section.label}
              placeholder="01 — MASALAHNYA"
              required
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs font-mono focus:outline-none focus:border-[#6366f1]/50"
            />
            <input
              name="highlight"
              defaultValue={section.highlight ?? ""}
              placeholder="Highlight (opsional, mis. 9 modul)"
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[#6366f1]/50"
            />
          </div>

          <input
            name="heading"
            defaultValue={section.heading}
            placeholder="Judul bagian"
            required
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-white text-sm font-semibold focus:outline-none focus:border-[#6366f1]/50"
          />

          <RichEditor name="body_html" defaultValue={section.body_html ?? ""} />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white disabled:opacity-50"
            >
              <Check size={13} />
              Simpan Bagian
            </button>
            <ConfirmDeleteForm action={hapusBagian} id={section.id} label="Hapus bagian ini beserta semua isinya?" />
            {state.error && <span className="text-xs text-red-400">{state.error}</span>}
          </div>
        </form>
      </div>

      <div className="pl-8 pt-3 border-t border-[var(--border)] space-y-2">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
          Poin / baris hasil (opsional)
        </p>
        {section.items.map((item) => (
          <SectionItemRow key={item.id} sectionId={section.id} item={item} />
        ))}
        <SectionItemRow sectionId={section.id} />
      </div>
    </div>
  );
}
