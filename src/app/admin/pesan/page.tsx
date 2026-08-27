import { getContactMessages } from "@/lib/queries";
import { PesanRow } from "@/components/admin/pesan/PesanRow";

export default async function AdminPesanPage() {
  const pesan = await getContactMessages();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Pesan Kontak</h1>
      <p className="text-sm text-gray-500 mb-8">Pesan masuk dari form kontak situs.</p>
      <div className="space-y-4 max-w-2xl">
        {pesan.length === 0 && <p className="text-sm text-gray-600">Belum ada pesan masuk.</p>}
        {pesan.map((p) => (
          <PesanRow key={p.id} pesan={p} />
        ))}
      </div>
    </div>
  );
}
