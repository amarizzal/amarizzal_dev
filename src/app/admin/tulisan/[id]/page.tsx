import { notFound } from "next/navigation";
import { getPostForEdit } from "@/lib/admin-queries";
import TulisanForm from "@/components/admin/tulisan/TulisanForm";

// Next.js 16: params adalah Promise, wajib di-await.
type Props = { params: Promise<{ id: string }> };

export default async function AdminTulisanEditPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostForEdit(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">Edit tulisan.</p>
      <TulisanForm post={post} />
    </div>
  );
}
