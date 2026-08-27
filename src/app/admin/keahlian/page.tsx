import { getSkillGroupsAdmin, getTechStackAdmin } from "@/lib/admin-queries";
import { CategoryCard } from "@/components/admin/keahlian/CategoryCard";
import { NewCategoryForm } from "@/components/admin/keahlian/NewCategoryForm";
import { TechStackEditor } from "@/components/admin/keahlian/TechStackEditor";

export default async function AdminKeahlianPage() {
  const [groups, techStack] = await Promise.all([getSkillGroupsAdmin(), getTechStackAdmin()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Keahlian</h1>
        <p className="text-sm text-gray-500">
          Kategori, skill dengan persentase, dan daftar teknologi yang pernah dipakai. Baris kosong
          paling bawah tiap kategori untuk menambah skill baru.
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((g) => (
          <CategoryCard key={g.id} group={g} />
        ))}
        <NewCategoryForm />
      </div>

      <TechStackEditor items={techStack} />
    </div>
  );
}
