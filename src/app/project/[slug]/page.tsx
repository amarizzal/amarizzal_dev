import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import CaseStudy from "@/components/project/CaseStudy";
import { getProfile, getProjectDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Next.js 16: params adalah Promise, wajib di-await.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetail(slug);
  if (!project || !project.published) return {};

  return {
    title: `${project.title} — Studi Kasus | Rizal Ammar`,
    description: project.core_insight ?? project.description,
    openGraph: project.cover_path ? { images: [project.cover_path] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [profile, project] = await Promise.all([getProfile(), getProjectDetail(slug)]);

  if (!project || !project.published) notFound();

  return (
    <>
      <Navbar profile={profile} />
      <main className="min-h-screen">
        <CaseStudy project={project} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
