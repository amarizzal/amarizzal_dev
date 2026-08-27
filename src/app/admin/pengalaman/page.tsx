import { getExperiencesAdmin } from "@/lib/admin-queries";
import { PengalamanRow } from "@/components/admin/pengalaman/PengalamanRow";

export default async function AdminPengalamanPage() {
  const experiences = await getExperiencesAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Pengalaman</h1>
      <p className="text-sm text-gray-500 mb-8">Timeline riwayat kerja di halaman utama.</p>
      <div className="space-y-3 max-w-2xl">
        {experiences.map((e) => (
          <PengalamanRow key={e.id} exp={e} />
        ))}
        <PengalamanRow />
      </div>
    </div>
  );
}
