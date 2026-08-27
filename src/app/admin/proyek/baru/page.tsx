import ProyekForm from "@/components/admin/proyek/ProyekForm";

export default function AdminProyekBaruPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Proyek Baru</h1>
      <p className="text-sm text-gray-500 mb-8">
        Isi data inti dulu — bagian studi kasus & metrik bisa ditambahkan setelah disimpan.
      </p>
      <ProyekForm />
    </div>
  );
}
