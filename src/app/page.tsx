import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/experience/Experience";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
import {
  getProfile,
  getSkillGroups,
  getTechStack,
  getServices,
  getFeaturedProjects,
  getExperiences,
} from "@/lib/queries";

// Wajib: build produksi berjalan di GitHub Actions, di mana tidak ada
// database. Route ber-DB yang di-prerender akan menggagalkan build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, skillGroups, techStack, services, projects, experiences] =
    await Promise.all([
      getProfile(),
      getSkillGroups(),
      getTechStack(),
      getServices(),
      getFeaturedProjects(),
      getExperiences(),
    ]);

  return (
    <main>
      <Navbar profile={profile} />
      <Hero profile={profile} />
      <About profile={profile} services={services} />
      <Skills groups={skillGroups} techStack={techStack} />
      <Projects projects={projects} profile={profile} />
      <Experience experiences={experiences} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </main>
  );
}
