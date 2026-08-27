import { getServicesAdmin } from "@/lib/admin-queries";
import { LayananRow } from "@/components/admin/layanan/LayananRow";

export default async function AdminLayananPage() {
  const services = await getServicesAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Layanan</h1>
      <p className="text-sm text-gray-500 mb-8">
        Ditampilkan di bagian &quot;Apa yang saya tawarkan&quot;. Nonaktifkan checkbox untuk
        menyembunyikan tanpa menghapus.
      </p>
      <div className="space-y-3 max-w-2xl">
        {services.map((s) => (
          <LayananRow key={s.id} service={s} />
        ))}
        <LayananRow />
      </div>
    </div>
  );
}
