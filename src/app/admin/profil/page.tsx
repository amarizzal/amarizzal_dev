import { getProfileForEdit } from "@/lib/admin-queries";
import ProfilForm from "@/components/admin/ProfilForm";

export default async function AdminProfilPage() {
  const profile = await getProfileForEdit();
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Profil</h1>
      <p className="text-sm text-gray-500 mb-8">Data yang tampil di hero, tentang, dan footer situs.</p>
      <ProfilForm profile={profile} />
    </div>
  );
}
