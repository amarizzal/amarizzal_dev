import { notFound } from "next/navigation";
import { getProjectForEdit } from "@/lib/admin-queries";
import ProyekForm from "@/components/admin/proyek/ProyekForm";
import { SectionEditor } from "@/components/admin/proyek/SectionEditor";
import { NewSectionForm } from "@/components/admin/proyek/NewSectionForm";
import { MetricRow } from "@/components/admin/proyek/MetricRow";

// Next.js 16: params adalah Promise, wajib di-await.
type Props = { params: Promise<{ id: string }> };

export default async function AdminProyekEditPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectForEdit(id);
  if (!project) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">{project.title}</h1>
        <p className="text-sm text-gray-500 mb-8">Data inti proyek.</p>
        <ProyekForm project={project} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-1">Bagian Studi Kasus</h2>
        <p className="text-sm text-gray-500 mb-4">
          Baris berurut — jumlah bagian &quot;Yang Dibangun&quot; bebas, tidak harus tiga. Gunakan
          panah untuk mengubah urutan tampil.
        </p>
        <div className="space-y-4">
          {project.sections.map((s) => (
            <SectionEditor key={s.id} projectId={project.id} section={s} />
          ))}
          <NewSectionForm projectId={project.id} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-1">Metrik / Angka</h2>
        <p className="text-sm text-gray-500 mb-4">
          Tandai &quot;Klaim klien&quot; untuk angka marketing pihak klien (mis. tingkat
          keberhasilan) — bukan hasil pekerjaan sendiri. Non-publik disembunyikan dari situs.
        </p>
        <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-2">
          {project.metrics.map((m) => (
            <MetricRow key={m.id} projectId={project.id} metric={m} />
          ))}
          <MetricRow projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
