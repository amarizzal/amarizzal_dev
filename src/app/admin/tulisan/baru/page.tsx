import TulisanForm from "@/components/admin/tulisan/TulisanForm";

export default function AdminTulisanBaruPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Tulisan Baru</h1>
      <p className="text-sm text-gray-500 mb-8">Simpan sebagai draft dulu, terbitkan setelah siap.</p>
      <TulisanForm />
    </div>
  );
}
